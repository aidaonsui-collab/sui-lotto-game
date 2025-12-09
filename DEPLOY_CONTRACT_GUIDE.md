# Complete Deployment Guide - Sui Lotto Game

## Part 1: Deploy Smart Contract to Sui Mainnet

### Prerequisites
1. Install Sui CLI: https://docs.sui.io/guides/developer/getting-started/sui-install
2. Create a Sui wallet and fund it with at least 1 SUI for gas fees
3. Switch to mainnet: `sui client switch --env mainnet`

### Step 1: Set Up Sui Wallet
\`\`\`bash
# Check if you have Sui CLI installed
sui --version

# Create a new wallet (or use existing)
sui client new-address ed25519

# Check your active address
sui client active-address

# Get some SUI from an exchange and send to your address
# You need at least 0.5 SUI for deployment gas fees
\`\`\`

### Step 2: Verify Wallet Balance
\`\`\`bash
# Check your balance
sui client gas

# Make sure you have at least 0.5 SUI
\`\`\`

### Step 3: Navigate to Contract Directory
\`\`\`bash
# Go to your project root
cd /path/to/sui-lotto-game

# Go to contracts folder
cd contracts
\`\`\`

### Step 4: Build the Contract
\`\`\`bash
# Build the contract first to check for errors
sui move build

# You should see: "Build Successful"
\`\`\`

### Step 5: Deploy to Mainnet
\`\`\`bash
# Deploy the contract
sui client publish --gas-budget 100000000

# IMPORTANT: Save the output! You'll see something like:
# ╭─────────────────────────────────────────────────────────╮
# │ Object Changes                                           │
# ├─────────────────────────────────────────────────────────┤
# │ Created Objects:                                         │
# │  ┌──                                                     │
# │  │ ObjectID: 0xABC123...                                │
# │  │ Sender: 0x...                                        │
# │  │ Owner: Shared                                        │
# │  │ ObjectType: 0xPACKAGE_ID::lotto_game::GameState    │
# │  └──                                                     │
# │ Published Objects:                                       │
# │  ┌──                                                     │
# │  │ PackageID: 0xDEF456...                               │
# │  └──                                                     │
# ╰─────────────────────────────────────────────────────────╯
\`\`\`

### Step 6: Copy Important Values
From the deployment output, copy these values:

1. **Package ID** (under "Published Objects") - This is your contract address
   - Example: `0x41fa1afb9f46d2f76944799331348465fbb84d75a37841687105fc6693183ff6`

2. **GameState Object ID** (under "Created Objects" where ObjectType ends with `::GameState`)
   - Example: `0x4b1597293e5724f4443959e1a8c709c519d615ae1912538e4a1ef00b64fa9997`

### Step 7: Verify Deployment
\`\`\`bash
# View the package on Sui Explorer
# Go to: https://suiscan.xyz/mainnet/object/YOUR_PACKAGE_ID

# Test a read function
sui client call \
  --package YOUR_PACKAGE_ID \
  --module lotto_game \
  --function get_current_round \
  --args YOUR_GAME_STATE_ID \
  --gas-budget 10000000
\`\`\`

---

## Part 2: Update Frontend Environment Variables

### Step 1: Update .env.local
\`\`\`bash
# Navigate back to project root
cd ..

# Edit .env.local file
nano .env.local
\`\`\`

### Step 2: Set Environment Variables
Copy and paste this into `.env.local`:

\`\`\`bash
# Network: mainnet | testnet | devnet
NEXT_PUBLIC_NETWORK=mainnet

# Development Mode (set to 'false' for mainnet)
NEXT_PUBLIC_DEV_MODE=false

# Smart Contract Addresses (replace with YOUR values from Step 6)
NEXT_PUBLIC_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
NEXT_PUBLIC_GAME_STATE_ID=0xYOUR_GAME_STATE_ID_HERE

# Developer wallet (from contract)
# 0x92a32ac7fd525f8bd37ed359423b8d7d858cad26224854dfbff1914b75ee658b
\`\`\`

**Replace:**
- `0xYOUR_PACKAGE_ID_HERE` with your actual Package ID from Step 6
- `0xYOUR_GAME_STATE_ID_HERE` with your actual GameState Object ID from Step 6

### Step 3: Save and Test Locally
\`\`\`bash
# Save the file (Ctrl+X, then Y, then Enter in nano)

# Clear cache and restart
rm -rf .next .turbo node_modules/.cache
npm run dev

# Open http://localhost:3000 and do a HARD REFRESH (Cmd+Shift+R)
# Check browser console - environment variables should now show your real contract IDs
\`\`\`

---

## Part 3: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

#### Step 1: Commit and Push Changes
\`\`\`bash
# Add all changes
git add .

# Commit with message
git commit -m "Deploy to mainnet with contract addresses"

# Push to GitHub
git push origin main
\`\`\`

#### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"

#### Step 3: Configure Environment Variables in Vercel
1. In Vercel project settings, go to "Settings" → "Environment Variables"
2. Add these variables for **Production, Preview, and Development**:

\`\`\`
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_DEV_MODE=false
NEXT_PUBLIC_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
NEXT_PUBLIC_GAME_STATE_ID=0xYOUR_GAME_STATE_ID_HERE
\`\`\`

3. Click "Save" for each variable

#### Step 4: Redeploy
1. Go to "Deployments" tab
2. Click the three dots on the latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

#### Step 5: Test Production Site
1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Do a hard refresh (Cmd+Shift+R)
3. Open browser console and verify contract IDs are correct
4. Try connecting wallet and playing a game

---

### Option B: Deploy via Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# When prompted:
# - Set up and deploy: Y
# - Which scope: Select your account
# - Link to existing project: N (first time) or Y (updating)
# - Project name: sui-lotto-game
# - Directory: ./
# - Override settings: N

# Add environment variables
vercel env add NEXT_PUBLIC_NETWORK production
# Enter: mainnet

vercel env add NEXT_PUBLIC_DEV_MODE production
# Enter: false

vercel env add NEXT_PUBLIC_PACKAGE_ID production
# Enter: YOUR_PACKAGE_ID

vercel env add NEXT_PUBLIC_GAME_STATE_ID production
# Enter: YOUR_GAME_STATE_ID

# Redeploy with new env vars
vercel --prod
\`\`\`

---

## Part 4: Start Your First Game

### Step 1: Connect Admin Wallet
1. Visit your deployed site
2. Click "Connect Wallet"
3. Connect with the wallet address you used to deploy the contract

### Step 2: Start a Round
\`\`\`bash
# Using Sui CLI (from any machine)
sui client call \
  --package YOUR_PACKAGE_ID \
  --module lotto_game \
  --function start_round \
  --args YOUR_GAME_STATE_ID 0x6 \
  --gas-budget 10000000

# Note: 0x6 is the Clock object ID (constant on Sui mainnet)
\`\`\`

### Step 3: Players Can Now Join
- Players can now select tiles and place bets
- Minimum bet: 0.05 SUI
- Game duration: 60 seconds

### Step 4: End the Round
After 60 seconds, anyone can call:

\`\`\`bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module lotto_game \
  --function end_round \
  --args YOUR_GAME_STATE_ID 0x6 0x8 \
  --gas-budget 10000000

# Note: 
# - 0x6 is the Clock object
# - 0x8 is the Random object (constant on Sui mainnet)
\`\`\`

---

## Troubleshooting

### Issue: "Contract not configured" error
**Solution:**
1. Verify environment variables are set correctly in both `.env.local` and Vercel
2. Clear browser cache (Cmd+Shift+R)
3. Clear Next.js cache: `rm -rf .next`
4. Restart dev server

### Issue: Funds not transferring
**Solution:**
1. Check the contract was deployed from `lotto_game_fixed.move`, not the old version
2. Verify developer wallet address matches the one in the contract
3. Check Sui Explorer for transaction details

### Issue: Vercel deployment fails
**Solution:**
1. Check build logs in Vercel dashboard
2. Make sure all dependencies are in `package.json`
3. Clear Vercel cache: Go to Settings → Clear Build Cache → Redeploy

### Issue: TypeScript errors during build
**Solution:**
\`\`\`bash
# Fix TypeScript errors
npm run build

# If successful, push to GitHub
git add .
git commit -m "Fix build errors"
git push origin main
\`\`\`

---

## Important Notes

1. **Gas Costs:**
   - Publishing contract: ~0.5 SUI
   - Starting a round: ~0.01 SUI
   - Playing a game: ~0.01 SUI + bet amount
   - Ending a round: ~0.02 SUI

2. **Developer Earnings:**
   - You receive 3% of every game's total pool
   - Automatically sent to: `0x92a32ac7fd525f8bd37ed359423b8d7d858cad26224854dfbff1914b75ee658b`

3. **Security:**
   - Never commit private keys to Git
   - Keep your deployment wallet address secure
   - The contract is immutable once deployed

4. **Contract Updates:**
   - To update the contract, you must deploy a new version
   - Players will need to start using the new contract address
   - Old contract funds can be migrated manually

---

## Quick Reference Commands

\`\`\`bash
# Check Sui CLI version
sui --version

# Check active address
sui client active-address

# Check balance
sui client gas

# Build contract
cd contracts && sui move build

# Deploy contract
sui client publish --gas-budget 100000000

# Clear Next.js cache
rm -rf .next .turbo node_modules/.cache

# Start dev server
npm run dev

# Deploy to Vercel
vercel --prod
\`\`\`

---

## Support

If you encounter issues:
1. Check Sui Explorer: https://suiscan.xyz/mainnet
2. View transaction details with transaction hash
3. Check browser console for errors
4. Verify all environment variables are set correctly

Good luck with your deployment! 🎰
