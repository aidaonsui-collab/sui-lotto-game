// The Playground - Sui Lotto Game Smart Contract
// This contract manages the game logic, payouts, and jackpot

module playground::lottery {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::random::{Self, Random};
    use sui::event;

    // Error codes
    const EInsufficientBet: u64 = 1;
    const EGameNotActive: u64 = 2;
    const EInvalidTileSelection: u64 = 3;
    const EInsufficientBalance: u64 = 4;

    // Constants
    const MIN_BET: u64 = 50_000_000; // 0.05 SUI (in MIST)
    const MAX_TILES: u64 = 25;
    const DEVELOPER_ADDRESS: address = @0x92a32ac7fd525f8bd37ed359423b8d7d858cad26224854dfbff1914b75ee658b;

    // Game state
    public struct GamePool has key {
        id: UID,
        balance: Balance<SUI>,
        jackpot_balance: Balance<SUI>,
        lucky_box_balance: Balance<SUI>,
        total_games: u64,
        total_players: u64,
    }

    // Player stats
    public struct PlayerStats has key, store {
        id: UID,
        player: address,
        total_plays: u64,
        total_wins: u64,
        total_losses: u64,
        consecutive_wins: u64,
        total_pnl: u64,
    }

    // Game entry
    public struct GameEntry has key, store {
        id: UID,
        player: address,
        bet_amount: u64,
        selected_tiles: vector<u64>,
        timestamp: u64,
    }

    // Events
    public struct GameStarted has copy, drop {
        player: address,
        bet_amount: u64,
        selected_tiles: vector<u64>,
    }

    public struct GameEnded has copy, drop {
        player: address,
        won: bool,
        payout: u64,
    }

    public struct JackpotWon has copy, drop {
        player: address,
        amount: u64,
    }

    public struct LuckyBoxClaimed has copy, drop {
        player: address,
        amount: u64,
    }

    // Initialize the game pool
    fun init(ctx: &mut TxContext) {
        let game_pool = GamePool {
            id: object::new(ctx),
            balance: balance::zero(),
            jackpot_balance: balance::zero(),
            lucky_box_balance: balance::zero(),
            total_games: 0,
            total_players: 0,
        };
        transfer::share_object(game_pool);
    }

    // Place a bet and start a game
    public entry fun play_game(
        game_pool: &mut GamePool,
        payment: Coin<SUI>,
        selected_tiles: vector<u64>,
        r: &Random,
        ctx: &mut TxContext
    ) {
        let bet_amount = coin::value(&payment);
        assert!(bet_amount >= MIN_BET, EInsufficientBet);
        assert!(vector::length(&selected_tiles) > 0 && vector::length(&selected_tiles) <= MAX_TILES, EInvalidTileSelection);

        let player = tx_context::sender(ctx);

        // Split the payment according to the distribution
        let payment_balance = coin::into_balance(payment);
        
        // 90% to prize pool
        let prize_amount = (bet_amount * 90) / 100;
        
        // 6% to jackpot
        let jackpot_amount = (bet_amount * 6) / 100;
        let jackpot_split = balance::split(&mut payment_balance, jackpot_amount);
        balance::join(&mut game_pool.jackpot_balance, jackpot_split);
        
        // 3% to developer
        let dev_amount = (bet_amount * 3) / 100;
        let dev_split = balance::split(&mut payment_balance, dev_amount);
        let dev_coin = coin::from_balance(dev_split, ctx);
        transfer::public_transfer(dev_coin, DEVELOPER_ADDRESS);
        
        // 1% to lucky box
        let lucky_amount = (bet_amount * 1) / 100;
        let lucky_split = balance::split(&mut payment_balance, lucky_amount);
        balance::join(&mut game_pool.lucky_box_balance, lucky_split);
        
        // Rest to game balance
        balance::join(&mut game_pool.balance, payment_balance);

        // Emit game started event
        event::emit(GameStarted {
            player,
            bet_amount,
            selected_tiles,
        });

        // Generate random outcome (simplified - in production use proper VRF)
        let mut generator = random::new_generator(r, ctx);
        let random_number = random::generate_u64_in_range(&mut generator, 1, 100);
        
        // 50% win chance for demo
        let won = random_number > 50;

        if (won) {
            // Pay winner (90% of bet * multiplier)
            let payout = (prize_amount * 150) / 100; // 1.5x multiplier
            
            if (balance::value(&game_pool.balance) >= payout) {
                let payout_balance = balance::split(&mut game_pool.balance, payout);
                let payout_coin = coin::from_balance(payout_balance, ctx);
                transfer::public_transfer(payout_coin, player);

                event::emit(GameEnded {
                    player,
                    won: true,
                    payout,
                });
            };
        } else {
            event::emit(GameEnded {
                player,
                won: false,
                payout: 0,
            });
        };

        game_pool.total_games = game_pool.total_games + 1;
    }

    // Claim jackpot (called by game when random jackpot winner is selected)
    public entry fun claim_jackpot(
        game_pool: &mut GamePool,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let jackpot_amount = balance::value(&game_pool.jackpot_balance);
        
        if (jackpot_amount > 0) {
            let payout_balance = balance::withdraw_all(&mut game_pool.jackpot_balance);
            let payout_coin = coin::from_balance(payout_balance, ctx);
            transfer::public_transfer(payout_coin, player);

            event::emit(JackpotWon {
                player,
                amount: jackpot_amount,
            });
        };
    }

    // Claim lucky box reward (10 consecutive wins)
    public entry fun claim_lucky_box(
        game_pool: &mut GamePool,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let lucky_box_amount = balance::value(&game_pool.lucky_box_balance);
        
        // In production, verify player has 10 consecutive wins
        if (lucky_box_amount > 0) {
            let payout_balance = balance::withdraw_all(&mut game_pool.lucky_box_balance);
            let payout_coin = coin::from_balance(payout_balance, ctx);
            transfer::public_transfer(payout_coin, player);

            event::emit(LuckyBoxClaimed {
                player,
                amount: lucky_box_amount,
            });
        };
    }

    // View functions
    public fun get_jackpot_balance(game_pool: &GamePool): u64 {
        balance::value(&game_pool.jackpot_balance)
    }

    public fun get_lucky_box_balance(game_pool: &GamePool): u64 {
        balance::value(&game_pool.lucky_box_balance)
    }

    public fun get_pool_balance(game_pool: &GamePool): u64 {
        balance::value(&game_pool.balance)
    }
}
