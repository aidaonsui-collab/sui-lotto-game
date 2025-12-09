module playground::lotto_game_simple {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::tx_context::TxContext;

    // Error codes
    const EInsufficientBet: u64 = 1;
    const EGameNotActive: u64 = 2;
    const EGameNotEnded: u64 = 3;
    const EInvalidTileSelection: u64 = 5;

    // Constants
    const MIN_BET: u64 = 50_000_000; // 0.05 SUI
    const GAME_DURATION: u64 = 60_000; // 60 seconds
    const MAX_TILES: u8 = 25;
    
    // Payout percentages (basis points)
    const WINNERS_PERCENTAGE: u64 = 9000; // 90%
    const JACKPOT_PERCENTAGE: u64 = 600;  // 6%
    const DEV_PERCENTAGE: u64 = 300;      // 3%
    const LUCKY_BOX_PERCENTAGE: u64 = 100; // 1%
    
    const DEV_WALLET: address = @0x92a32ac7fd525f8bd37ed359423b8d7d858cad26224854dfbff1914b75ee658b;

    public struct GameState has key {
        id: UID,
        current_round: u64,
        round_start_time: u64,
        round_end_time: u64,
        is_active: bool,
        total_pool: Balance<SUI>,
        jackpot_pool: Balance<SUI>,
        lucky_box_pool: Balance<SUI>,
        winning_tiles: vector<u8>,
        players: vector<Player>,
    }

    public struct Player has store, copy, drop {
        address: address,
        bet_amount: u64,
        selected_tiles: vector<u8>,
        timestamp: u64,
    }

    public struct GameStarted has copy, drop {
        round: u64,
        start_time: u64,
        end_time: u64,
    }

    public struct PlayerJoined has copy, drop {
        round: u64,
        player: address,
        bet_amount: u64,
        selected_tiles: vector<u8>,
    }

    public struct GameEnded has copy, drop {
        round: u64,
        winning_tiles: vector<u8>,
        total_pool: u64,
        winners_count: u64,
    }

    fun init(ctx: &mut TxContext) {
        let game_state = GameState {
            id: object::new(ctx),
            current_round: 0,
            round_start_time: 0,
            round_end_time: 0,
            is_active: false,
            total_pool: balance::zero(),
            jackpot_pool: balance::zero(),
            lucky_box_pool: balance::zero(),
            winning_tiles: vector::empty(),
            players: vector::empty(),
        };
        transfer::share_object(game_state);
    }

    #[allow(lint(public_entry))]
    public entry fun start_round(
        game: &mut GameState,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        assert!(!game.is_active, EGameNotActive);
        
        let current_time = clock::timestamp_ms(clock);
        game.current_round = game.current_round + 1;
        game.round_start_time = current_time;
        game.round_end_time = current_time + GAME_DURATION;
        game.is_active = true;
        game.players = vector::empty();
        game.winning_tiles = vector::empty();

        event::emit(GameStarted {
            round: game.current_round,
            start_time: game.round_start_time,
            end_time: game.round_end_time,
        });
    }

    #[allow(lint(public_entry))]
    public entry fun play_game(
        game: &mut GameState,
        payment: Coin<SUI>,
        selected_tiles: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(game.is_active, EGameNotActive);
        assert!(clock::timestamp_ms(clock) < game.round_end_time, EGameNotEnded);
        
        let bet_amount = coin::value(&payment);
        assert!(bet_amount >= MIN_BET, EInsufficientBet);
        
        let tile_count = vector::length(&selected_tiles);
        assert!(tile_count > 0 && tile_count <= (MAX_TILES as u64), EInvalidTileSelection);

        let player_address = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);

        let player = Player {
            address: player_address,
            bet_amount,
            selected_tiles,
            timestamp: current_time,
        };
        vector::push_back(&mut game.players, player);

        let bet_balance = coin::into_balance(payment);
        balance::join(&mut game.total_pool, bet_balance);

        event::emit(PlayerJoined {
            round: game.current_round,
            player: player_address,
            bet_amount,
            selected_tiles,
        });
    }

    #[allow(lint(public_entry))]
    public entry fun end_round(
        game: &mut GameState,
        winning_tiles: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(game.is_active, EGameNotActive);
        assert!(clock::timestamp_ms(clock) >= game.round_end_time, EGameNotEnded);

        game.is_active = false;
        game.winning_tiles = winning_tiles;

        let mut winners = vector::empty<address>();
        let mut total_winning_bets = 0u64;
        let player_count = vector::length(&game.players);
        let mut j = 0;
        
        while (j < player_count) {
            let player = vector::borrow(&game.players, j);
            if (has_winning_tiles(player.selected_tiles, game.winning_tiles)) {
                vector::push_back(&mut winners, player.address);
                total_winning_bets = total_winning_bets + player.bet_amount;
            };
            j = j + 1;
        };

        let total_pool_value = balance::value(&game.total_pool);
        
        if (vector::length(&winners) > 0) {
            distribute_payouts(game, &winners, total_winning_bets, ctx);
        } else {
            let entire_pool = balance::withdraw_all(&mut game.total_pool);
            balance::join(&mut game.jackpot_pool, entire_pool);
        };

        event::emit(GameEnded {
            round: game.current_round,
            winning_tiles: game.winning_tiles,
            total_pool: total_pool_value,
            winners_count: vector::length(&winners),
        });
    }

    fun has_winning_tiles(selected: vector<u8>, winning: vector<u8>): bool {
        let mut matches = 0u64;
        let selected_len = vector::length(&selected);
        let winning_len = vector::length(&winning);
        
        let mut i = 0;
        while (i < selected_len) {
            let tile = vector::borrow(&selected, i);
            if (vector::contains(&winning, tile)) {
                matches = matches + 1;
            };
            i = i + 1;
        };
        
        matches >= (winning_len / 2)
    }

    fun distribute_payouts(
        game: &mut GameState,
        winners: &vector<address>,
        total_winning_bets: u64,
        ctx: &mut TxContext
    ) {
        let total_pool_value = balance::value(&game.total_pool);
        
        let winners_amount = total_pool_value * WINNERS_PERCENTAGE / 10000;
        let jackpot_amount = total_pool_value * JACKPOT_PERCENTAGE / 10000;
        let dev_amount = total_pool_value * DEV_PERCENTAGE / 10000;
        let lucky_box_amount = total_pool_value * LUCKY_BOX_PERCENTAGE / 10000;

        let jackpot_balance = balance::split(&mut game.total_pool, jackpot_amount);
        balance::join(&mut game.jackpot_pool, jackpot_balance);

        let lucky_box_balance = balance::split(&mut game.total_pool, lucky_box_amount);
        balance::join(&mut game.lucky_box_pool, lucky_box_balance);

        let dev_balance = balance::split(&mut game.total_pool, dev_amount);
        let dev_coin = coin::from_balance(dev_balance, ctx);
        transfer::public_transfer(dev_coin, DEV_WALLET);

        let winner_count = vector::length(winners);
        let mut i = 0;
        while (i < winner_count) {
            let winner = *vector::borrow(winners, i);
            
            let mut winner_bet = 0u64;
            let player_count = vector::length(&game.players);
            let mut j = 0;
            while (j < player_count) {
                let player = vector::borrow(&game.players, j);
                if (player.address == winner) {
                    winner_bet = player.bet_amount;
                    break
                };
                j = j + 1;
            };

            let payout = winners_amount * winner_bet / total_winning_bets;
            let payout_balance = balance::split(&mut game.total_pool, payout);
            let payout_coin = coin::from_balance(payout_balance, ctx);
            transfer::public_transfer(payout_coin, winner);

            i = i + 1;
        };
    }

    public fun get_current_round(game: &GameState): u64 {
        game.current_round
    }

    public fun is_game_active(game: &GameState): bool {
        game.is_active
    }

    public fun get_jackpot_pool(game: &GameState): u64 {
        balance::value(&game.jackpot_pool)
    }
}
