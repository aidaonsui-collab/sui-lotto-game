# Sui Lotto Game - Contract Setup Guide

## Prerequisites

1. Sui wallet installed (Sui Wallet browser extension)
2. Sui CLI installed: `cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui`
3. Some SUI tokens for gas fees

## Step 1: Deploy Your Smart Contract

1. Navigate to your contract directory
2. Build the contract:
   \`\`\`bash
   sui move build
   \`\`\`

3. Deploy to testnet:
   \`\`\`bash
   sui client publish --gas-budget 100000000
   \`\`\`

4. Save the following from the deployment output:
   - **Package ID**: `0x...` (the main package identifier)
   - **Game State Object ID**: Look for the created objects

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
# Sui Network Configuration
NEXT_PUBLIC_NETWORK=testnet

# Contract Configuration (Update these after deployment)
NEXT_PUBLIC_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
NEXT_PUBLIC_GAME_STATE_ID=0xYOUR_GAME_STATE_OBJECT_ID_HERE

# Optional: Custom RPC URL
# NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
\`\`\`

## Step 3: Update Contract Configuration

The app will automatically use the environment variables. You can also update `lib/contract-config.ts` if you want to hardcode values:

\`\`\`typescript
export const CONTRACT_CONFIG = {
  NETWORK: "testnet" as "mainnet" | "testnet" | "devnet",
  PACKAGE_ID: "0xYOUR_ACTUAL_PACKAGE_ID",
  GAME_STATE_ID: "0xYOUR_ACTUAL_GAME_STATE_ID",
  // ... rest of config
}
\`\`\`

## Step 4: Test the Application

1. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Open http://localhost:3000

3. Connect your Sui wallet

4. Try playing a game!

## Features Overview

### Game Mechanics
- **Tile Selection**: Choose 1-5 tiles (numbers 1-25)
- **Betting**: Minimum 0.05 SUI per game
- **Round Duration**: 60 seconds per round
- **Winning**: Match tiles with the random selection

### Reward Distribution
- **Winner**: 90% of the pot
- **Jackpot Pool**: 6% accumulation
- **Developer**: 3% fee
- **Mystery Box**: 1% for special rewards

### Special Features
- **Mystery Box**: Win 10 consecutive games to unlock
- **Leaderboard**: Track top players
- **Top Picks**: See what successful players are betting on
- **Live Updates**: Real-time game state

## Troubleshooting

### "Invalid Sui Object id" Error
- Make sure you've deployed the contract
- Verify PACKAGE_ID and GAME_STATE_ID are correct in .env.local
- Check that you're connected to the correct network

### "Insufficient Gas" Error
- Get testnet SUI from: https://discord.com/channels/916379725201563759/971488439931392130
- Use the faucet: `!faucet <your-address>` in Sui Discord

### Wallet Connection Issues
- Make sure Sui Wallet extension is installed
- Switch to the correct network (testnet/mainnet) in wallet
- Refresh the page after connecting

## Going to Production (Mainnet)

1. Deploy contract to mainnet:
   \`\`\`bash
   sui client publish --gas-budget 100000000
   \`\`\`

2. Update .env.local:
   \`\`\`env
   NEXT_PUBLIC_NETWORK=mainnet
   NEXT_PUBLIC_PACKAGE_ID=<mainnet_package_id>
   NEXT_PUBLIC_GAME_STATE_ID=<mainnet_game_state_id>
   \`\`\`

3. Test thoroughly before announcing!

## Support

- Sui Documentation: https://docs.sui.io
- Sui Discord: https://discord.gg/sui
- GitHub Issues: [Your Repo URL]

---

Built with ❤️ using Next.js, Sui, and TypeScript
