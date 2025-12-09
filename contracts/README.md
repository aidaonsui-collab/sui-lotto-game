# The Playground - Sui Smart Contract

This smart contract powers "The Playground" lotto-style game on the Sui blockchain.

## Features

- **Game Rounds**: 60-second game rounds with automatic payout distribution
- **Tile Selection**: Players select from 25 tiles (0-24)
- **Minimum Bet**: 0.05 SUI (50,000,000 MIST)
- **Payout Distribution**:
  - 90% to winners (proportional to their bets)
  - 6% to jackpot pool
  - 3% to developer wallet
  - 1% to lucky box pool

## Contract Structure

### Main Structs

- `GameState`: Shared object that manages the current game state
- `Player`: Represents a player in the current round
- `PlayerStats`: Tracks individual player statistics (not yet implemented on-chain)

### Key Functions

#### Admin Functions
- `start_round()`: Starts a new game round (callable by anyone)
- `end_round()`: Ends the current round and distributes payouts

#### Player Functions
- `play_game()`: Join the current game round with a bet
- `claim_jackpot()`: Claim the jackpot pool (randomly triggered)
- `claim_lucky_box()`: Claim lucky box after 10 consecutive wins

#### View Functions
- `get_current_round()`: Get current round number
- `is_game_active()`: Check if game is active
- `get_total_pool()`: Get total pool amount
- `get_jackpot_pool()`: Get jackpot pool amount
- `get_lucky_box_pool()`: Get lucky box pool amount

## Deployment Instructions

### Prerequisites

1. Install Sui CLI:
\`\`\`bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
\`\`\`

2. Configure your Sui client:
\`\`\`bash
sui client
\`\`\`

### Build and Test

1. Build the contract:
\`\`\`bash
cd contracts
sui move build
\`\`\`

2. Test the contract:
\`\`\`bash
sui move test
\`\`\`

### Deploy to Testnet

1. Make sure you're on testnet:
\`\`\`bash
sui client switch --env testnet
\`\`\`

2. Get testnet SUI:
\`\`\`bash
sui client faucet
\`\`\`

3. Publish the contract:
\`\`\`bash
sui client publish --gas-budget 100000000
\`\`\`

4. Save the package ID from the output - you'll need it for the frontend!

### Deploy to Mainnet

1. Switch to mainnet:
\`\`\`bash
sui client switch --env mainnet
\`\`\`

2. Update Move.toml to use mainnet dependencies:
\`\`\`toml
[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "mainnet" }
\`\`\`

3. Publish:
\`\`\`bash
sui client publish --gas-budget 100000000
\`\`\`

## Important Notes

- The contract uses Sui's `Random` module for generating winning tiles
- The developer wallet is hardcoded: `0x92a32ac7fd525f8bd37ed359423b8d7d858cad26224854dfbff1914b75ee658b`
- Players win if they match at least 50% of the winning tiles
- The jackpot and lucky box pools accumulate over multiple rounds

## Events

The contract emits the following events:
- `GameStarted`: When a new round begins
- `PlayerJoined`: When a player joins the game
- `GameEnded`: When a round ends
- `JackpotWon`: When the jackpot is claimed
- `LuckyBoxWon`: When the lucky box is claimed

## Security Considerations

- The contract uses Sui's native randomness for fairness
- All funds are managed through Sui's `Balance` type
- The developer fee is automatically distributed
- Players must join before the round ends
