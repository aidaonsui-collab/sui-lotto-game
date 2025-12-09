# How to Restart Dev Server with Fresh Cache

Your browser is showing old cached JavaScript with placeholder environment variables. Follow these steps to fix it:

## Step 1: Stop the Dev Server

Press `Ctrl + C` in the terminal where `npm run dev` is running.

## Step 2: Clear All Caches

Run one of these commands:

\`\`\`bash
# Option A: Use the npm script (easiest)
npm run clean

# Option B: Use the shell script
chmod +x clear-cache.sh
./clear-cache.sh

# Option C: Manual cleanup
rm -rf .next .turbo node_modules/.cache
\`\`\`

## Step 3: Hard Refresh Your Browser

**IMPORTANT:** After clearing server cache, you must also clear browser cache:

- **Chrome/Edge:** Press `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
- **Firefox:** Press `Cmd + Shift + R` (Mac) or `Ctrl + F5` (Windows)
- **Safari:** Press `Cmd + Option + R`

Or manually:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

## Step 4: Restart Dev Server

\`\`\`bash
npm run dev
\`\`\`

## Step 5: Verify Environment Variables

After the server starts, open your browser and check the console. You should see your real contract addresses, not placeholders:

**Expected (CORRECT):**
\`\`\`
packageId: '0x41fa1afb9f46d2f76944799331348465fbb84d75a37841687105fc6693183ff6'
gameStateId: '0x4b1597293e5724f4443959e1a8c709c519d615ae1912538e4a1ef00b64fa9997'
devMode: false
\`\`\`

**Wrong (OLD CACHE):**
\`\`\`
gameStateId: '0xYOUR_GAME_STATE_OBJECT_ID_HERE'  ← This means cache is still present
devMode: true
\`\`\`

## Quick Command (One-Line Solution)

Run everything at once:

\`\`\`bash
npm run clean && npm run dev
\`\`\`

Then do a hard refresh in your browser!

## Still Not Working?

If you still see placeholder values after following all steps:

1. Check that `.env.local` exists and has the correct values
2. Completely close and reopen your browser
3. Try incognito/private browsing mode
4. Clear browser data (Settings → Privacy → Clear browsing data)

## For Vercel Deployment

If the issue is on Vercel:

1. Go to your project settings
2. Navigate to Environment Variables
3. Add all variables for Production, Preview, and Development:
   - `NEXT_PUBLIC_PACKAGE_ID`
   - `NEXT_PUBLIC_GAME_STATE_ID`
   - `NEXT_PUBLIC_NETWORK`
   - `NEXT_PUBLIC_DEV_MODE`
4. Redeploy from Deployments tab
5. In browser, do a hard refresh after deployment completes
