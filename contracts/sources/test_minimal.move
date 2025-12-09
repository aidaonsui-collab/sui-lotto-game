module playground::test_minimal {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};

    // Simple shared object to hold funds
    public struct GameTreasury has key {
        id: UID,
        balance: Balance<SUI>,
    }

    // Initialize the game
    fun init(ctx: &mut TxContext) {
        let treasury = GameTreasury {
            id: object::new(ctx),
            balance: balance::zero(),
        };
        transfer::share_object(treasury);
    }

    // Deposit SUI into the game
    #[allow(lint(public_entry))]
    public entry fun deposit(
        treasury: &mut GameTreasury,
        coin: Coin<SUI>,
    ) {
        let deposit_balance = coin::into_balance(coin);
        balance::join(&mut treasury.balance, deposit_balance);
    }

    // Get balance (view function)
    public fun get_balance(treasury: &GameTreasury): u64 {
        balance::value(&treasury.balance)
    }
}
