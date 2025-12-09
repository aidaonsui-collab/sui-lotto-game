# Smart Contract Quick Start

## TL;DR - Deploy in 5 Minutes

### 1. Setup
\`\`\`bash
# Install Sui CLI (if not installed)
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

# Configure wallet
sui client
# Choose testnet, save recovery phrase
\`\`\`

### 2. Get Tokens
\`\`\`bash
# Get your address
sui client active-address

# Get test SUI
sui client faucet
\`\`\`

### 3. Clean & Deploy
\`\`\`bash
cd contracts

# IMPORTANT: Fix groth16 error
rm -rf ~/.cargo/git/checkouts/sui-*
rm -rf build/ Move.lock

# Deploy
sui client publish --gas-budget 100000000
\`\`\`

### 4. Save Contract Info

After deployment, save these to `.env.local`:
\`\`\`bash
NEXT_PUBLIC_PACKAGE_ID=0xYOUR_PACKAGE_ID
NEXT_PUBLIC_GAME_STATE_ID=0xYOUR_GAME_STATE_OBJECT_ID
NEXT_PUBLIC_NETWORK=testnet
\`\`\`

### 5. Start Frontend
\`\`\`bash
cd ..
npm install
npm run dev
\`\`\`

Open http://localhost:3000

Done!

---

## Contract Functions

### Admin Functions

**Start a new round:**
\`\`\`bash
sui client call \
  --package $PACKAGE_ID \
  --module lotto_game \
  --function start_round \
  --args $GAME_STATE_ID "0x6" \
  --gas-budget 10000000
\`\`\`

**End current round:**
\`\`\`bash
sui client call \
  --package $PACKAGE_ID \
  --module lotto_game \
  --function end_round \
  --args $GAME_STATE_ID "0x6" "0x8" \
  --gas-budget 10000000
\`\`\`

### Player Functions

**Play game:**
\`\`\`bash
sui client call \
  --package $PACKAGE_ID \
  --module lotto_game \
  --function play_game \
  --args $GAME_STATE_ID $COIN_ID "[1,5,10,15,20]" "0x6" \
  --gas-budget 10000000
\`\`\`

### View Functions

**Check game state:**
\`\`\`bash
sui client object $GAME_STATE_ID
\`\`\`

---

## Contract Structure

\`\`\`
playground::lotto_game
├── GameState (shared object)
│   ├── current_round: u64
│   ├── total_pool: Balance<SUI>
│   ├── jackpot_pool: Balance<SUI>
│   ├── lucky_box_pool: Balance<SUI>
│   └── players: vector<Player>
├── Functions
│   ├── start_round()
│   ├── play_game()
│   ├── end_round()
│   ├── claim_jackpot()
│   └── claim_lucky_box()
└── Events
    ├── GameStarted
    ├── PlayerJoined
    ├── GameEnded
    ├── JackpotWon
    └── LuckyBoxWon
\`\`\`

---

## Payout Distribution

Every game distributes funds as follows:
- 90% → Winners (split proportionally by bet amount)
- 6% → Jackpot pool
- 3% → Developer wallet (`0x92a32...ee658b`)
- 1% → Lucky Box pool

---

## Important Notes

1. **groth16 Error Fix**: Always run `rm -rf ~/.cargo/git/checkouts/sui-*` before building
2. **Move.toml**: No dependencies section needed (auto-added)
3. **Minimum Bet**: 0.05 SUI (50,000,000 MIST)
4. **Game Duration**: 60 seconds per round
5. **Max Tiles**: 25 tiles available

---

## Upgrade Contract

To upgrade after deployment:

\`\`\`bash
sui client upgrade \
  --upgrade-capability $UPGRADE_CAP_ID \
  --gas-budget 100000000
\`\`\`

Save the new package ID and update `.env.local`.
