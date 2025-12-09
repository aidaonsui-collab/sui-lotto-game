# The Playground - Deployment Guide

This guide will walk you through deploying "The Playground" lotto game step-by-step, even if you've never coded before.

## Prerequisites

Before you begin, you'll need:

1. **Node.js** (v18 or higher) - Download from [nodejs.org](https://nodejs.org/)
2. **Sui CLI** - For deploying smart contracts
3. **A code editor** - VS Code is recommended ([code.visualstudio.com](https://code.visualstudio.com/))
4. **Sui Wallet** - Install Slush Wallet or Phantom Wallet browser extension

## Part 1: Setting Up Your Development Environment

### Step 1: Install Sui CLI

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

\`\`\`bash
# For macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# For Windows
# Download and install Rust from: https://rustup.rs/
# Then run:
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
\`\`\`

Verify installation:
\`\`\`bash
sui --version
\`\`\`

### Step 2: Create a Sui Wallet

\`\`\`bash
# Create new wallet
sui client new-address ed25519

# This will generate a wallet address and recovery phrase
# IMPORTANT: Save your recovery phrase securely!
\`\`\`

### Step 3: Get Testnet SUI Tokens

Visit the [Sui Testnet Faucet](https://discord.gg/sui) and request testnet tokens:

\`\`\`bash
# Join Sui Discord and use #testnet-faucet channel
# Type: !faucet <your-wallet-address>
\`\`\`

## Part 2: Deploying the Smart Contract

### Step 1: Navigate to Contracts Directory

\`\`\`bash
cd contracts
\`\`\`

### Step 2: Build the Contract

\`\`\`bash
sui move build
\`\`\`

You should see "Build Successful" message.

### Step 3: Deploy to Testnet

\`\`\`bash
sui client publish --gas-budget 100000000
\`\`\`

**IMPORTANT**: Save these values from the deployment output:
- `Package ID`: This is your deployed contract address
- `GamePool Object ID`: The shared game pool object

Example output:
\`\`\`
Published Objects:
  - PackageID: 0xabcd1234...
  - GamePool: 0x5678efgh...
\`\`\`

### Step 4: Update Your Frontend Configuration

Copy the Package ID and create a config file:

\`\`\`bash
cd ..
\`\`\`

Create `lib/contract-config.ts`:

\`\`\`typescript
export const CONTRACT_CONFIG = {
  PACKAGE_ID: 'YOUR_PACKAGE_ID_HERE', // From deployment
  GAME_POOL_ID: 'YOUR_GAME_POOL_ID_HERE', // From deployment
  NETWORK: 'testnet',
}
\`\`\`

## Part 3: Setting Up the Web Application

### Step 1: Install Dependencies

\`\`\`bash
# Make sure you're in the root directory
npm install
\`\`\`

### Step 2: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

The app will start at `http://localhost:3000`

### Step 3: Test Wallet Connection

1. Open `http://localhost:3000` in your browser
2. Click "Connect Wallet"
3. Select Slush Wallet or Phantom Wallet
4. Approve the connection

## Part 4: Deploying to Production

### Option A: Deploy to Vercel (Recommended)

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   \`\`\`

3. **Import to Vercel**
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

4. **Configure Environment**
   - No environment variables needed for basic setup
   - Contract addresses are in the code

Your site will be live at: `https://your-project.vercel.app`

### Option B: Deploy to Other Platforms

#### Netlify
\`\`\`bash
npm run build
# Upload the .next folder to Netlify
\`\`\`

#### Custom Server
\`\`\`bash
npm run build
npm start
\`\`\`

## Part 5: Updating Contract Address in Frontend

After deployment, you need to connect the frontend to your deployed contract:

1. Open `lib/contract-config.ts`
2. Replace placeholder values:
   \`\`\`typescript
   export const CONTRACT_CONFIG = {
     PACKAGE_ID: '0xYOUR_ACTUAL_PACKAGE_ID',
     GAME_POOL_ID: '0xYOUR_ACTUAL_GAME_POOL_ID',
     NETWORK: 'testnet', // or 'mainnet' for production
   }
   \`\`\`

3. Update the code to use these values in API calls

## Part 6: Going Live on Mainnet

### Step 1: Switch to Mainnet

\`\`\`bash
sui client switch --env mainnet
\`\`\`

### Step 2: Get Mainnet SUI

You'll need real SUI tokens. Purchase from:
- Binance
- Coinbase
- OKX
- Or other exchanges

### Step 3: Deploy to Mainnet

\`\`\`bash
cd contracts
sui client publish --gas-budget 100000000
\`\`\`

### Step 4: Update Configuration

Update `lib/contract-config.ts`:
\`\`\`typescript
export const CONTRACT_CONFIG = {
  PACKAGE_ID: 'YOUR_MAINNET_PACKAGE_ID',
  GAME_POOL_ID: 'YOUR_MAINNET_GAME_POOL_ID',
  NETWORK: 'mainnet',
}
\`\`\`

### Step 5: Redeploy Frontend

Push changes to GitHub, and Vercel will automatically redeploy.

## Part 7: Testing Your Game

### Test Checklist:

- [ ] Wallet connects successfully
- [ ] Can select tiles
- [ ] Can place bets (minimum 0.05 SUI)
- [ ] Game timer counts down (60 seconds)
- [ ] Winners receive payouts
- [ ] Jackpot display updates
- [ ] Leaderboard shows player stats
- [ ] Light/Dark mode toggle works
- [ ] Mobile responsive

### Test a Complete Game Flow:

1. Connect wallet
2. Select 3-5 tiles
3. Set bet amount (try 0.05 SUI)
4. Click "Start Game"
5. Wait for countdown
6. Check if payout received (if won)
7. Verify developer wallet received 3%

## Common Issues & Solutions

### Issue: "Insufficient funds"
**Solution**: Make sure your wallet has enough SUI tokens plus gas fees

### Issue: "Transaction failed"
**Solution**: Increase gas budget in the contract call

### Issue: "Wallet won't connect"
**Solution**: 
- Refresh the page
- Make sure wallet extension is installed and unlocked
- Try switching networks in wallet

### Issue: "Contract call failed"
**Solution**: 
- Verify Package ID is correct
- Check you're on the right network (testnet/mainnet)
- Ensure contract is deployed successfully

## Monitoring & Maintenance

### View Contract Activity

\`\`\`bash
sui client object <GAME_POOL_ID>
\`\`\`

### Check Balances

\`\`\`bash
# Check your wallet balance
sui client gas

# View objects you own
sui client objects
\`\`\`

### Update Contract

If you need to update the contract:
\`\`\`bash
cd contracts
sui move build
sui client publish --gas-budget 100000000
# Update frontend with new Package ID
\`\`\`

## Security Considerations

1. **Never commit private keys** to GitHub
2. **Use environment variables** for sensitive data in production
3. **Test thoroughly** on testnet before mainnet
4. **Monitor the developer wallet** for fee collection
5. **Set up alerts** for unusual activity
6. **Regular audits** of smart contracts recommended

## Getting Help

- **Sui Documentation**: [docs.sui.io](https://docs.sui.io)
- **Sui Discord**: [discord.gg/sui](https://discord.gg/sui)
- **GitHub Issues**: Create issues in your repo
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## Next Steps

1. **Add Analytics**: Track user behavior with Vercel Analytics
2. **Implement Real RNG**: Use Sui's randomness beacon for provably fair games
3. **Add More Features**: 
   - Player achievements
   - Referral system
   - Tournament mode
4. **Mobile App**: Consider building native mobile apps
5. **Marketing**: Promote your game on crypto communities

Congratulations! You've successfully deployed "The Playground" lotto game!
