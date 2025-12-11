module playground::lotto_game {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::random;

    // Error codes
    const EInsufficientBet: u64 = 1;
    const EGameNotActive: u64 = 2;
    const EGameNotEnded: u64 = 3;
    const ENoWinners: u64 = 4;
    const EInvalidTileSelection: u64 = 5;
    const EInsufficientFunds: u64 = 6;

    // Constants
    const MIN_BET: u64 = 50_000_000; // 0.05 SUI (1 SUI = 1e9 MIST)
    const GAME_DURATION: u64 = 60_000; // 60 seconds in milliseconds
    const MAX_TILES: u8 = 25;
    
    const WINNERS_PERCENTAGE: u64 = 9000; // 90%
    const JACKPOT_PERCENTAGE: u64 = 600;  // 6%
    const DEV_PERCENTAGE: u64 = 300;      // 3%
    const LUCKY_BOX_PERCENTAGE: u64 = 100; // 1%
    
    // Developer wallet
    const DEV_WALLET: address = @0x92a32ac7fd525f8bd37ed359423b8d7d858cad26224854dfbff1914b75ee658b;

    // Structs
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

    // Events
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
        winners: vector<address>,
        total_winner_payout: u64,
        jackpot_added: u64,
        dev_paid: u64,
        lucky_box_added: u64,
    }

    public struct PayoutSent has copy, drop {
        round: u64,
        winner: address,
        amount: u64,
    }

    public struct JackpotWon has copy, drop {
        round: u64,
        winner: address,
        amount: u64,
    }

    public struct LuckyBoxWon has copy, drop {
        player: address,
        amount: u64,
    }

    // Initialize the game
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

    // Start a new game round
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

    // Player joins the game
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
        
        // Validate tile selection
        let tile_count = vector::length(&selected_tiles);
        assert!(tile_count > 0 && tile_count <= (MAX_TILES as u64), EInvalidTileSelection);

        let player_address = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);

        // Add player to the game
        let player = Player {
            address: player_address,
            bet_amount,
            selected_tiles,
            timestamp: current_time,
        };
        vector::push_back(&mut game.players, player);

        // Add bet to pool
        let bet_balance = coin::into_balance(payment);
        balance::join(&mut game.total_pool, bet_balance);

        event::emit(PlayerJoined {
            round: game.current_round,
            player: player_address,
            bet_amount,
            selected_tiles,
        });
    }

    // End the game and determine winners
    public entry fun end_round(
        game: &mut GameState,
        clock: &Clock,
        random: &random::Random,
        ctx: &mut TxContext
    ) {
        assert!(game.is_active, EGameNotActive);
        assert!(clock::timestamp_ms(clock) >= game.round_end_time, EGameNotEnded);

        game.is_active = false;

        // Generate winning tiles using randomness
        let mut generator = random::new_generator(random, ctx);
        let num_winning_tiles = random::generate_u8_in_range(&mut generator, 3, 6);
        let mut winning_tiles = vector::empty<u8>();
        let mut i = 0;
        while (i < num_winning_tiles) {
            let tile = random::generate_u8_in_range(&mut generator, 0, MAX_TILES - 1);
            if (!vector::contains(&winning_tiles, &tile)) {
                vector::push_back(&mut winning_tiles, tile);
                i = i + 1;
            };
        };
        game.winning_tiles = winning_tiles;

        // Find winners
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
        
        if (vector::length(&winners) > 0 && total_pool_value > 0) {
            distribute_payouts(game, &winners, total_winning_bets, total_pool_value, ctx);
        } else {
            // No winners, entire pool goes to jackpot
            if (total_pool_value > 0) {
                let entire_pool = balance::withdraw_all(&mut game.total_pool);
                balance::join(&mut game.jackpot_pool, entire_pool);
            };
        };

        let final_pool_value = balance::value(&game.total_pool);

        event::emit(GameEnded {
            round: game.current_round,
            winning_tiles: game.winning_tiles,
            total_pool: total_pool_value,
            winners,
            total_winner_payout: if (vector::length(&winners) > 0) { 
                total_pool_value * WINNERS_PERCENTAGE / 10000 
            } else { 0 },
            jackpot_added: total_pool_value * JACKPOT_PERCENTAGE / 10000,
            dev_paid: total_pool_value * DEV_PERCENTAGE / 10000,
            lucky_box_added: total_pool_value * LUCKY_BOX_PERCENTAGE / 10000,
        });
    }

    // Helper function to check if player has winning tiles
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
        
        // Player wins if they match at least 50% of winning tiles
        matches >= (winning_len / 2)
    }

    // Helper function to count exact match percentage
    fun count_tile_matches(selected: vector<u8>, winning: vector<u8>): u64 {
        let mut matches = 0u64;
        let selected_len = vector::length(&selected);
        
        let mut i = 0;
        while (i < selected_len) {
            let tile = vector::borrow(&selected, i);
            if (vector::contains(&winning, tile)) {
                matches = matches + 1;
            };
            i = i + 1;
        };
        
        matches
    }

    fun distribute_payouts(
        game: &mut GameState,
        winners: &vector<address>,
        total_winning_bets: u64,
        total_pool_value: u64,
        ctx: &mut TxContext
    ) {
        // Calculate ALL distribution amounts FIRST before splitting
        let jackpot_amount = total_pool_value * JACKPOT_PERCENTAGE / 10000;
        let dev_amount = total_pool_value * DEV_PERCENTAGE / 10000;
        let lucky_box_amount = total_pool_value * LUCKY_BOX_PERCENTAGE / 10000;
        let winners_amount = total_pool_value * WINNERS_PERCENTAGE / 10000;

        // 1. Split and send to jackpot pool
        if (jackpot_amount > 0) {
            let jackpot_balance = balance::split(&mut game.total_pool, jackpot_amount);
            balance::join(&mut game.jackpot_pool, jackpot_balance);
        };

        // 2. Split and send to lucky box pool
        if (lucky_box_amount > 0) {
            let lucky_box_balance = balance::split(&mut game.total_pool, lucky_box_amount);
            balance::join(&mut game.lucky_box_pool, lucky_box_balance);
        };

        // 3. Split and send to developer wallet IMMEDIATELY
        if (dev_amount > 0) {
            let dev_balance = balance::split(&mut game.total_pool, dev_amount);
            let dev_coin = coin::from_balance(dev_balance, ctx);
            transfer::public_transfer(dev_coin, DEV_WALLET);
        };

        let winning_tile_count = vector::length(&game.winning_tiles);
        let mut jackpot_winners = vector::empty<address>();
        let mut jackpot_winning_bets = 0u64;
        
        let player_count = vector::length(&game.players);
        let mut k = 0;
        while (k < player_count) {
            let player = vector::borrow(&game.players, k);
            let matches = count_tile_matches(player.selected_tiles, game.winning_tiles);
            // Perfect match: matched ALL winning tiles
            if (matches == winning_tile_count) {
                vector::push_back(&mut jackpot_winners, player.address);
                jackpot_winning_bets = jackpot_winning_bets + player.bet_amount;
            };
            k = k + 1;
        };

        if (vector::length(&jackpot_winners) > 0) {
            let current_jackpot = balance::value(&game.jackpot_pool);
            if (current_jackpot > 0) {
                let mut m = 0;
                while (m < vector::length(&jackpot_winners)) {
                    let jackpot_winner = *vector::borrow(&jackpot_winners, m);
                    
                    // Find winner's bet amount
                    let mut winner_bet = 0u64;
                    let mut n = 0;
                    while (n < player_count) {
                        let player = vector::borrow(&game.players, n);
                        if (player.address == jackpot_winner) {
                            winner_bet = player.bet_amount;
                            break
                        };
                        n = n + 1;
                    };

                    // Calculate proportional jackpot payout
                    let jackpot_payout = current_jackpot * winner_bet / jackpot_winning_bets;
                    
                    if (jackpot_payout > 0 && balance::value(&game.jackpot_pool) >= jackpot_payout) {
                        let jackpot_balance = balance::split(&mut game.jackpot_pool, jackpot_payout);
                        let jackpot_coin = coin::from_balance(jackpot_balance, ctx);
                        transfer::public_transfer(jackpot_coin, jackpot_winner);

                        event::emit(JackpotWon {
                            round: game.current_round,
                            winner: jackpot_winner,
                            amount: jackpot_payout,
                        });
                    };

                    m = m + 1;
                };
            };
        };

        let mut mystery_winners = vector::empty<address>();
        let mut mystery_winning_bets = 0u64;
        
        let mut p = 0;
        while (p < player_count) {
            let player = vector::borrow(&game.players, p);
            let matches = count_tile_matches(player.selected_tiles, game.winning_tiles);
            let match_percentage = matches * 100 / winning_tile_count;
            // 80%+ match for mystery box
            if (match_percentage >= 80 && matches < winning_tile_count) {
                vector::push_back(&mut mystery_winners, player.address);
                mystery_winning_bets = mystery_winning_bets + player.bet_amount;
            };
            p = p + 1;
        };

        if (vector::length(&mystery_winners) > 0) {
            let current_mystery = balance::value(&game.lucky_box_pool);
            if (current_mystery > 0) {
                let mut q = 0;
                while (q < vector::length(&mystery_winners)) {
                    let mystery_winner = *vector::borrow(&mystery_winners, q);
                    
                    // Find winner's bet amount
                    let mut winner_bet = 0u64;
                    let mut r = 0;
                    while (r < player_count) {
                        let player = vector::borrow(&game.players, r);
                        if (player.address == mystery_winner) {
                            winner_bet = player.bet_amount;
                            break
                        };
                        r = r + 1;
                    };

                    // Calculate proportional mystery box payout
                    let mystery_payout = current_mystery * winner_bet / mystery_winning_bets;
                    
                    if (mystery_payout > 0 && balance::value(&game.lucky_box_pool) >= mystery_payout) {
                        let mystery_balance = balance::split(&mut game.lucky_box_pool, mystery_payout);
                        let mystery_coin = coin::from_balance(mystery_balance, ctx);
                        transfer::public_transfer(mystery_coin, mystery_winner);

                        event::emit(LuckyBoxWon {
                            player: mystery_winner,
                            amount: mystery_payout,
                        });
                    };

                    q = q + 1;
                };
            };
        };

        // Distribute remaining pool to winners proportionally
        let winner_count = vector::length(winners);
        if (winner_count > 0 && winners_amount > 0) {
            let mut i = 0;
            while (i < winner_count) {
                let winner = *vector::borrow(winners, i);
                
                // Find winner's bet amount
                let mut winner_bet = 0u64;
                let mut j = 0;
                while (j < player_count) {
                    let player = vector::borrow(&game.players, j);
                    if (player.address == winner) {
                        winner_bet = player.bet_amount;
                        break
                    };
                    j = j + 1;
                };

                // Calculate proportional payout based on bet amount
                let payout = winners_amount * winner_bet / total_winning_bets;
                
                // Only send payout if amount > 0 and we have sufficient balance
                if (payout > 0 && balance::value(&game.total_pool) >= payout) {
                    let payout_balance = balance::split(&mut game.total_pool, payout);
                    let payout_coin = coin::from_balance(payout_balance, ctx);
                    transfer::public_transfer(payout_coin, winner);

                    event::emit(PayoutSent {
                        round: game.current_round,
                        winner,
                        amount: payout,
                    });
                };

                i = i + 1;
            };
        };

        // Any remaining dust stays in the pool for the next round
    }

    // View functions
    public fun get_current_round(game: &GameState): u64 {
        game.current_round
    }

    public fun is_game_active(game: &GameState): bool {
        game.is_active
    }

    public fun get_total_pool(game: &GameState): u64 {
        balance::value(&game.total_pool)
    }

    public fun get_jackpot_pool(game: &GameState): u64 {
        balance::value(&game.jackpot_pool)
    }

    public fun get_lucky_box_pool(game: &GameState): u64 {
        balance::value(&game.lucky_box_pool)
    }

    public fun get_round_end_time(game: &GameState): u64 {
        game.round_end_time
    }

    public fun get_player_count(game: &GameState): u64 {
        vector::length(&game.players)
    }

    public fun get_winning_tiles(game: &GameState): vector<u8> {
        game.winning_tiles
    }
}
