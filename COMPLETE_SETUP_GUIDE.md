# The Playground - Complete Setup Guide for Beginners

Welcome! This guide will walk you through every step to launch your Sui blockchain lotto game, even if you've never coded before.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Frontend Configuration](#frontend-configuration)
5. [Local Testing](#local-testing)
6. [Deploy to Production](#deploy-to-production)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need to Install

1. **Node.js** (JavaScript runtime)
   - Go to https://nodejs.org
   - Download version 18 or higher
   - Run the installer
   - Verify installation:
     \`\`\`bash
     node --version
     # Should show v18.0.0 or higher
     \`\`\`

2. **Rust** (Required for Sui CLI)
   - Go to https://rustup.rs
   - Follow installation instructions for your system
   - Verify installation:
     \`\`\`bash
     rustc --version
     # Should show rustc 1.70.0 or higher
     \`\`\`

3. **Sui CLI** (Blockchain command tool)
   \`\`\`bash
   # Install Sui CLI
   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
   
   # Verify installation
   sui --version
   # Should show sui 1.0.0 or higher
   \`\`\`

4. **Git** (Version control)
   - Windows: https://git-scm.com/download/win
   - Mac: `brew install git` (or install from git-scm.com)
   - Linux: `sudo apt-get install git`

5. **Code Editor** (VS Code recommended)
   - Download from https://code.visualstudio.com

---

## Initial Setup

### Step 1: Get the Project Files

1. Open Terminal (Mac/Linux) or Command Prompt (Windows)
2. Navigate to where you want the project:
   \`\`\`bash
   cd Desktop  # or wherever you want
   \`\`\`

3. If you downloaded the project as ZIP:
   \`\`\`bash
   # Extract the ZIP file
   # Then navigate into the folder
   cd playground
   \`\`\`

### Step 2: Install Frontend Dependencies

\`\`\`bash
# Install all required packages
npm install

# This might take 2-5 minutes
# You'll see a progress bar
\`\`\`

---

## Smart Contract Deployment

### Step 1: Configure Sui CLI

\`\`\`bash
# Initialize Sui configuration
sui client

# When prompted:
# 1. Choose option 1 for Testnet
# 2. It will create a new wallet for you automatically
# 3. Write down the 12-word recovery phrase it shows you (IMPORTANT!)
\`\`\`

### Step 2: Get Your Wallet Address

\`\`\`bash
# Display your wallet address
sui client active-address

# Copy this address - you'll need it
# Example: 0x1234...5678
\`\`\`

### Step 3: Get Test SUI Tokens

\`\`\`bash
# Request free test tokens from the faucet
sui client faucet

# Wait 10-20 seconds for tokens to arrive

# Check your balance
sui client gas

# You should see several coins with SUI amounts
\`\`\`

### Step 4: Clean Build Environment

\`\`\`bash
# Navigate to contracts folder
cd contracts

# Remove any old build files (fixes the groth16 error)
rm -rf build/
rm -f Move.lock

# Clear Sui git cache (IMPORTANT FIX)
rm -rf ~/.cargo/git/checkouts/sui-*
\`\`\`

### Step 5: Build the Contract

\`\`\`bash
# Test build (this checks for errors)
sui move build

# If successful, you'll see:
# "BUILDING playground"
# "Build Successful"
\`\`\`

### Step 6: Deploy to Testnet

\`\`\`bash
# Publish the smart contract
sui client publish --gas-budget 100000000

# This will take 30-60 seconds
# If successful, you'll see a long output with transaction details
\`\`\`

### Step 7: Save Important Information

After successful deployment, you'll see output like this:

\`\`\`
╭─────────────────────────────────────────────────────────╮
│ Object Changes                                           │
├─────────────────────────────────────────────────────────┤
│ Created Objects:                                         │
│  ┌── PackageID: 0xabcd1234...                           │
│  └── ObjectID: 0xef567890... (GameState)               │
╰─────────────────────────────────────────────────────────╯
\`\`\`

**SAVE THESE VALUES:**
1. **PackageID** - This is your smart contract address
2. **GameState ObjectID** - This is the game state object

Create a file called `.env.local` in your project root and add:

\`\`\`bash
NEXT_PUBLIC_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
NEXT_PUBLIC_GAME_STATE_ID=0xYOUR_GAME_STATE_ID_HERE
NEXT_PUBLIC_NETWORK=testnet
\`\`\`

---

## Frontend Configuration

### Step 1: Update Environment Variables

Open `.env.local` and ensure it has:

\`\`\`bash
# Your deployed smart contract
NEXT_PUBLIC_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
NEXT_PUBLIC_GAME_STATE_ID=0xYOUR_GAME_STATE_ID_HERE

# Network configuration
NEXT_PUBLIC_NETWORK=testnet

# Optional: For analytics (after you deploy)
# NEXT_PUBLIC_VERCEL_URL=your-app.vercel.app
\`\`\`

### Step 2: Verify Wallet Support

The app automatically supports:
- Slush Wallet
- Phantom Wallet
- Sui Wallet
- Ethos Wallet
- And all other Sui-compatible wallets

No additional configuration needed!

---

## Local Testing

### Step 1: Start Development Server

\`\`\`bash
# Make sure you're in the project root (not contracts folder)
cd ..  # if you're still in contracts/

# Start the development server
npm run dev
\`\`\`

### Step 2: Open in Browser

1. Open your browser
2. Go to: http://localhost:3000
3. You should see "The Playground" interface

### Step 3: Install a Wallet

If you don't have a Sui wallet:
1. Go to Chrome Web Store
2. Search for "Sui Wallet" or "Phantom Wallet"
3. Install the extension
4. Create a new wallet
5. Switch to Testnet in wallet settings
6. Get test tokens from faucet

### Step 4: Test the Game

1. Click "Connect Wallet" in the top right
2. Select your wallet (Phantom, Slush, etc.)
3. Approve the connection
4. Select some tiles (click on numbers)
5. Set your bet amount (minimum 0.05 SUI)
6. Click "Start Game"
7. Wait for the 60-second round to complete

---

## Deploy to Production

### Option 1: Deploy with Vercel (Recommended - Free)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Install Vercel CLI**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

3. **Deploy**
   \`\`\`bash
   # Login to Vercel
   vercel login
   
   # Deploy your app
   vercel
   
   # Follow the prompts:
   # - Link to existing project? No
   # - What's your project name? the-playground
   # - Which directory? ./ (just press Enter)
   \`\`\`

4. **Add Environment Variables**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add your `.env.local` variables

5. **Redeploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

Your app will be live at: `https://your-project.vercel.app`

### Option 2: Deploy with Netlify

1. Go to https://netlify.com
2. Drag and drop your project folder
3. Add environment variables in Site Settings
4. Deploy

---

## Troubleshooting

### Issue: "Duplicate module found: groth16"

**Solution:**
\`\`\`bash
# Delete Sui git cache
rm -rf ~/.cargo/git/checkouts/sui-*

# Delete local build files
cd contracts
rm -rf build/ Move.lock

# Try again
sui move build
\`\`\`

### Issue: "Insufficient gas"

**Solution:**
\`\`\`bash
# Get more test SUI
sui client faucet

# Wait 10 seconds, then try again
\`\`\`

### Issue: "Wallet won't connect"

**Solutions:**
1. Make sure wallet extension is installed
2. Check that wallet is on Testnet (not Mainnet)
3. Try refreshing the page
4. Try a different wallet (Phantom, Sui Wallet, etc.)

### Issue: "Package ID not found"

**Solution:**
1. Make sure `.env.local` exists
2. Check that `NEXT_PUBLIC_PACKAGE_ID` is set
3. Restart dev server: `npm run dev`

### Issue: "Transaction failed"

**Solutions:**
1. Check you have enough SUI for gas
2. Verify your bet amount is >= 0.05 SUI
3. Make sure you selected at least one tile
4. Check network connection

---

## Moving to Mainnet

Once everything works on testnet:

### Step 1: Deploy Contract to Mainnet

\`\`\`bash
# Switch to mainnet
sui client new-env --alias mainnet --rpc https://fullnode.mainnet.sui.io:443

sui client switch --env mainnet

# Get real SUI tokens (buy from exchange)

# Deploy
cd contracts
sui client publish --gas-budget 100000000
\`\`\`

### Step 2: Update Frontend

Update `.env.local`:
\`\`\`bash
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_PACKAGE_ID=0xYOUR_NEW_MAINNET_PACKAGE_ID
NEXT_PUBLIC_GAME_STATE_ID=0xYOUR_NEW_MAINNET_STATE_ID
\`\`\`

### Step 3: Redeploy

\`\`\`bash
vercel --prod
\`\`\`

---

## Support

If you need help:
1. Check the [Sui Documentation](https://docs.sui.io)
2. Join [Sui Discord](https://discord.gg/sui)
3. Visit [Sui Forum](https://forums.sui.io)

---

## Game Features Summary

Your deployed game includes:
- 25-tile selection grid
- 60-second game rounds
- Automatic payout distribution (90% winners, 6% jackpot, 3% dev, 1% lucky box)
- Live jackpot display
- Lucky Box for 10 consecutive wins
- Leaderboard with player stats
- Top 5 player strategies (copyable)
- Light/dark mode
- Full wallet integration (Phantom, Slush, etc.)
- Responsive mobile design

Developer fee automatically goes to:
`0x92a32ac7fd525f8bd37ed359423b8d7d858cad26224854dfbff1914b75ee658b`

---

## Next Steps

1. Test thoroughly on testnet
2. Get feedback from friends
3. Make any desired changes
4. Deploy to mainnet
5. Share with the community!

Good luck with The Playground!
