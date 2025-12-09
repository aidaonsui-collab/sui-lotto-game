# Vercel Deployment Debug Guide

## Issue: Statistics Page Shows "Contract Not Configured" on Vercel

If the statistics page works on localhost but shows "contract not configured" on Vercel, follow these debugging steps:

### Step 1: Verify Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Verify that `NEXT_PUBLIC_DEV_MODE` is set to exactly: `true` (no quotes, lowercase)
4. Make sure the variable is checked for **Production**, **Preview**, and **Development** environments

### Step 2: Check the Browser Console on Vercel

1. Open your deployed site on Vercel
2. Open browser DevTools (F12)
3. Go to the **Console** tab
4. Look for log messages starting with `[v0]`
5. You should see:
   \`\`\`
   [v0] Contract Config Check: { devMode: true, ... }
   [v0] Statistics - Contract configured: true
   [v0] Statistics - Dev mode: "true"
   \`\`\`

### Step 3: Common Issues and Solutions

#### Issue: Dev mode shows as "undefined" or "not set"
**Solution:**
- The environment variable name must be exactly `NEXT_PUBLIC_DEV_MODE` (case-sensitive)
- The value must be exactly `true` (lowercase, no quotes)
- Redeploy after adding the variable (just adding it doesn't trigger a rebuild)

#### Issue: Dev mode shows as "true" but still not working
**Solution:**
1. Clear Vercel's build cache:
   - Go to **Settings** → **General**
   - Scroll to **Build & Development Settings**
   - Click **Clear Build Cache**
2. Trigger a new deployment:
   \`\`\`bash
   git commit --allow-empty -m "Trigger Vercel rebuild"
   git push
   \`\`\`

#### Issue: Environment variable works in preview but not production
**Solution:**
- Make sure the variable is enabled for the **Production** environment
- Go to **Settings** → **Environment Variables**
- Check the checkboxes for all three: Production, Preview, Development

### Step 4: Force Redeploy

If none of the above work, try this sequence:

1. **Remove the environment variable** from Vercel
2. **Wait 1 minute**
3. **Add it back** with these exact settings:
   - Name: `NEXT_PUBLIC_DEV_MODE`
   - Value: `true`
   - Environments: All three checked (Production, Preview, Development)
4. **Clear build cache** (Settings → General → Clear Build Cache)
5. **Redeploy**:
   \`\`\`bash
   git commit --allow-empty -m "Force rebuild with env vars"
   git push
   \`\`\`

### Step 5: Verify the Fix

After redeploying:
1. Visit your Vercel site
2. Open browser console (F12)
3. Navigate to the Statistics page
4. Check console logs - you should see:
   \`\`\`
   [v0] Statistics - Contract configured: true
   [v0] Statistics - Dev mode: "true"
   [v0] Statistics - Using dev mode mock data
   \`\`\`
5. The statistics should display with mock data

### Alternative: Use Real Contract Addresses

Instead of using dev mode, you can deploy the actual smart contract and use real addresses:

1. Follow the deployment guide in `DEPLOY_TO_VERCEL.md`
2. Deploy the Sui smart contract
3. Set these environment variables on Vercel:
   - `NEXT_PUBLIC_PACKAGE_ID`: Your deployed package ID
   - `NEXT_PUBLIC_GAME_STATE_ID`: Your game state object ID
   - `NEXT_PUBLIC_NETWORK`: `testnet` or `mainnet`
4. Remove `NEXT_PUBLIC_DEV_MODE` or set it to `false`

### Need Help?

If you're still having issues:
1. Check the console logs on Vercel (they'll tell you exactly what's happening)
2. Screenshot the browser console and Vercel environment variables page
3. Make sure you're looking at the production deployment, not a preview
