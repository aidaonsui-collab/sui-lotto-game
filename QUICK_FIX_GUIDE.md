# Quick Fix Guide - Contract Not Configured

## Problem
You're seeing "Contract not configured" messages on your deployed Vercel site.

## Cause
Your `.env.local` file (and Vercel environment variables) contain placeholder values:
- `NEXT_PUBLIC_PACKAGE_ID=0xYOUR_DEPLOYED_PACKAGE_ID`
- `NEXT_PUBLIC_GAME_STATE_ID=0xYOUR_GAME_STATE_OBJECT_ID`

## Solutions

### Option 1: Deploy Your Smart Contract (Recommended for Production)

1. **Deploy the contract to Sui mainnet:**
   \`\`\`bash
   cd contracts
   sui client publish --gas-budget 100000000
   \`\`\`

2. **Copy the output values:**
   - Look for "Published Objects" - copy the Package ID
   - Look for "Created Objects" - copy the Game State Object ID

3. **Update your environment variables:**
   
   **Locally (.env.local):**
   \`\`\`bash
   NEXT_PUBLIC_NETWORK=mainnet
   NEXT_PUBLIC_PACKAGE_ID=0x<your-actual-package-id>
   NEXT_PUBLIC_GAME_STATE_ID=0x<your-actual-game-state-id>
   \`\`\`

   **On Vercel:**
   - Go to your project settings
   - Navigate to Environment Variables
   - Update both variables with real values
   - Redeploy your site

### Option 2: Temporary Bypass (Development Only)

If you want to see the UI without deploying the contract yet, you can temporarily bypass the configuration check.

**Note:** This will show the UI with zero/empty data. No actual blockchain interaction will work.

Update your Vercel environment variables:
\`\`\`
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_PACKAGE_ID=0x1
NEXT_PUBLIC_GAME_STATE_ID=0x2
\`\`\`

These minimal valid addresses will pass the configuration check and allow you to see the UI.

## Vercel Deployment Checklist

After updating environment variables on Vercel:

1. ✅ Go to your Vercel project dashboard
2. ✅ Settings → Environment Variables
3. ✅ Update both `NEXT_PUBLIC_PACKAGE_ID` and `NEXT_PUBLIC_GAME_STATE_ID`
4. ✅ Click "Save"
5. ✅ Go to Deployments tab
6. ✅ Click the three dots on the latest deployment
7. ✅ Select "Redeploy"
8. ✅ Wait for deployment to complete
9. ✅ Visit your site - the "contract not configured" message should be gone

## Dialog Warning (Already Fixed)

The Dialog warning you see in the console is already suppressed in your code. It's a harmless warning from the `@mysten/dapp-kit` wallet connection component and doesn't affect functionality.

## Need Help?

If you're stuck:
1. Check that environment variables are saved in Vercel
2. Verify you redeployed after changing variables
3. Clear browser cache and reload
4. Check browser console for other errors
