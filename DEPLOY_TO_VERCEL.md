# Deploy Sui Lotto Game to Vercel

This guide will walk you through deploying your Sui Lotto Game to Vercel.

## Prerequisites

- [Vercel account](https://vercel.com/signup) (free)
- [GitHub account](https://github.com/signup) (free)
- Git installed on your computer
- Your Sui smart contract deployed to testnet or mainnet

## Step 1: Prepare Your Project

1. **Ensure all dependencies are installed:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Test your build locally:**
   \`\`\`bash
   npm run build
   \`\`\`
   This should complete without errors.

3. **Create a `.gitignore` file** (if not already present):
   \`\`\`
   node_modules/
   .next/
   .env.local
   .vercel
   \`\`\`

## Step 2: Push to GitHub

1. **Initialize Git repository** (if not already done):
   \`\`\`bash
   git init
   \`\`\`

2. **Add all files:**
   \`\`\`bash
   git add .
   \`\`\`

3. **Commit your changes:**
   \`\`\`bash
   git commit -m "Initial commit - Sui Lotto Game"
   \`\`\`

4. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `sui-lotto-game`
   - Do NOT initialize with README, .gitignore, or license
   - Click "Create repository"

5. **Push to GitHub:**
   \`\`\`bash
   git remote add origin https://github.com/YOUR_USERNAME/sui-lotto-game.git
   git branch -M main
   git push -u origin main
   \`\`\`

## Step 3: Deploy to Vercel (Option A - Dashboard)

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/new
   - Log in with your GitHub account

2. **Import your repository:**
   - Click "Add New" → "Project"
   - Find and select your `sui-lotto-game` repository
   - Click "Import"

3. **Configure your project:**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (should be default)
   - **Output Directory:** `.next` (should be default)
   - **Install Command:** `npm install` (should be default)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   
   | Name | Value | Description |
   |------|-------|-------------|
   | `NEXT_PUBLIC_NETWORK` | `testnet` or `mainnet` | Sui network to connect to |
   | `NEXT_PUBLIC_PACKAGE_ID` | `0x...` | Your deployed contract package ID |
   | `NEXT_PUBLIC_GAME_ID` | `0x...` | Your deployed game object ID |
   | `NEXT_PUBLIC_POOL_ID` | `0x...` | Your pool object ID |
   | `NEXT_PUBLIC_JACKPOT_ID` | `0x...` | Your jackpot object ID |
   | `NEXT_PUBLIC_LUCKY_BOX_ID` | `0x...` | Your lucky box object ID |

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment to complete
   - You'll get a URL like: `https://sui-lotto-game.vercel.app`

## Step 3: Deploy to Vercel (Option B - CLI)

1. **Install Vercel CLI:**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Login to Vercel:**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy:**
   \`\`\`bash
   vercel
   \`\`\`
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `sui-lotto-game`
   - In which directory is your code located? `./`
   - Want to override the settings? **N**

4. **Add environment variables:**
   \`\`\`bash
   vercel env add NEXT_PUBLIC_NETWORK
   # Enter value: testnet or mainnet
   
   vercel env add NEXT_PUBLIC_PACKAGE_ID
   # Enter value: 0x...
   
   vercel env add NEXT_PUBLIC_GAME_ID
   # Enter value: 0x...
   
   vercel env add NEXT_PUBLIC_POOL_ID
   # Enter value: 0x...
   
   vercel env add NEXT_PUBLIC_JACKPOT_ID
   # Enter value: 0x...
   
   vercel env add NEXT_PUBLIC_LUCKY_BOX_ID
   # Enter value: 0x...
   \`\`\`

5. **Deploy to production:**
   \`\`\`bash
   vercel --prod
   \`\`\`

## Step 4: Configure Smart Contract (If Not Already Done)

If you haven't deployed your Sui smart contract yet:

1. **Navigate to contracts folder:**
   \`\`\`bash
   cd contracts
   \`\`\`

2. **Build the contract:**
   \`\`\`bash
   sui move build
   \`\`\`

3. **Deploy to Sui testnet:**
   \`\`\`bash
   sui client publish --gas-budget 100000000
   \`\`\`

4. **Save the output:**
   - Copy the `packageId`
   - Copy the object IDs for: Game, Pool, Jackpot, LuckyBox
   - Update these in Vercel environment variables

## Step 5: Update Configuration

1. **Update `lib/contract-config.ts`** with your deployed contract details (already done if you followed local setup)

2. **Redeploy to Vercel** (if you made changes after initial deployment):
   \`\`\`bash
   git add .
   git commit -m "Update contract configuration"
   git push
   \`\`\`
   
   Vercel will automatically redeploy when you push to GitHub.

## Step 6: Verify Deployment

1. **Visit your deployed site:**
   - Open the URL provided by Vercel
   - Example: `https://sui-lotto-game.vercel.app`

2. **Test the following:**
   - ✅ Wallet connection works (Sui Wallet, Suiet, etc.)
   - ✅ Tile selection works
   - ✅ Bet amount can be adjusted
   - ✅ "Start Game" button responds
   - ✅ Transaction signing works
   - ✅ Statistics display correctly (if contract is configured)

## Step 7: Set Up Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update your domain's DNS:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or add A record pointing to Vercel's IP

## Troubleshooting

### Build Fails

**Error: Module not found**
\`\`\`bash
# Locally, clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
\`\`\`

**Error: Type errors in TypeScript**
- Check `tsconfig.json` is properly configured
- Ensure all `@radix-ui/*` packages are installed

### Wallet Connection Issues

**Problem:** Wallet doesn't connect on deployed site

**Solution:** 
- Ensure `NEXT_PUBLIC_NETWORK` is set correctly (testnet or mainnet)
- Check browser console for errors
- Verify wallet extension is installed and configured for the correct network

### Contract Not Configured Warning

**Problem:** "Contract not configured" message appears

**Solution:**
1. Verify all environment variables are set in Vercel
2. Check that `NEXT_PUBLIC_` prefix is used (required for client-side access)
3. Redeploy after adding environment variables

### Environment Variables Not Working

**Problem:** Environment variables are undefined

**Solution:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Ensure variables start with `NEXT_PUBLIC_` for client-side access
3. Click "Redeploy" button after adding/changing variables
4. Don't just push to GitHub - variables require manual redeploy

## Continuous Deployment

Your project is now set up for continuous deployment:

1. **Make changes locally**
2. **Commit and push to GitHub:**
   \`\`\`bash
   git add .
   git commit -m "Your changes description"
   git push
   \`\`\`
3. **Vercel automatically rebuilds and deploys** within 1-2 minutes

## Monitoring and Analytics

1. **View deployment logs:**
   - Vercel Dashboard → Your Project → Deployments
   - Click any deployment to see build logs

2. **Monitor performance:**
   - Vercel Dashboard → Your Project → Analytics
   - View page views, load times, and errors

3. **Set up alerts:**
   - Vercel Dashboard → Your Project → Settings → Notifications
   - Configure Slack, Discord, or email notifications

## Production Checklist

Before going live with real money:

- [ ] Smart contract audited by security professionals
- [ ] Deployed to Sui mainnet (not testnet)
- [ ] All environment variables point to mainnet contract
- [ ] Test all game functionality on production site
- [ ] Set up monitoring and error tracking
- [ ] Configure custom domain (optional)
- [ ] Add terms of service and privacy policy pages
- [ ] Test with small amounts first
- [ ] Have emergency pause mechanism in smart contract
- [ ] Set up proper admin controls

## Need Help?

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Sui Documentation:** https://docs.sui.io
- **GitHub Issues:** Create an issue in your repository

## Updating After Deployment

### Update Frontend Code:
\`\`\`bash
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys
\`\`\`

### Update Smart Contract:
\`\`\`bash
cd contracts
sui client publish --gas-budget 100000000
# Update environment variables in Vercel with new IDs
# Redeploy in Vercel Dashboard
\`\`\`

### Update Environment Variables:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Edit the variable
3. Click "Save"
4. Go to Deployments tab → Click "..." menu → "Redeploy"

---

**Your Sui Lotto Game is now live on Vercel! 🎉**

Share your deployment URL and start playing!
