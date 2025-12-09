# Restart Dev Server - Step by Step Commands

## Step 1: Stop the Current Server
Press `Ctrl+C` in your terminal to stop the running dev server.

## Step 2: Clean Everything
Run these commands one by one:

\`\`\`bash
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache
\`\`\`

Or use the npm script:
\`\`\`bash
npm run clean
\`\`\`

## Step 3: Start Dev Server
\`\`\`bash
npm run dev
\`\`\`

## Step 4: Hard Refresh Browser
This is THE MOST IMPORTANT STEP - your browser is caching old JavaScript!

**On Mac:**
- Press `Cmd + Shift + R`

**On Windows/Linux:**
- Press `Ctrl + Shift + R`

**Alternative method:**
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

## Step 5: Verify Environment Variables
Open browser console and check the logs. You should see:
- `gameStateId: '0x4b1597293e5724f4443959e1a8c709c519d615ae1912538e4a1ef00b64fa9997'`
- NOT: `gameStateId: '0xYOUR_GAME_STATE_OBJECT_ID_HERE'`

If you still see the placeholder, repeat Step 4 (hard refresh).

## For Vercel Deployment
1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Add these variables for ALL environments (Production, Preview, Development):
   - `NEXT_PUBLIC_NETWORK=mainnet`
   - `NEXT_PUBLIC_DEV_MODE=false`
   - `NEXT_PUBLIC_PACKAGE_ID=0x41fa1afb9f46d2f76944799331348465fbb84d75a37841687105fc6693183ff6`
   - `NEXT_PUBLIC_GAME_STATE_ID=0x4b1597293e5724f4443959e1a8c709c519d615ae1912538e4a1ef00b64fa9997`
4. Deployments → Three dots menu → Redeploy
5. Check "Clear Build Cache"
6. Click "Redeploy"
