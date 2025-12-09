# Fix Environment Variables Not Loading

## Problem
Your `.env.local` file has the correct values, but the app is still showing placeholder values like `0xYOUR_GAME_STATE_OBJECT_ID_HERE`.

## Root Cause
Next.js caches environment variables when the dev server starts. Changes to `.env.local` require a full restart.

## Solution: Complete Server Restart

### Step 1: Stop the Dev Server
\`\`\`bash
# Press Ctrl+C in the terminal running npm run dev
# Or if it's stuck, find and kill the process:
pkill -f "next dev"
\`\`\`

### Step 2: Clear All Caches
\`\`\`bash
# Delete Next.js cache
rm -rf .next

# Optional: Clear node_modules cache (if issues persist)
rm -rf node_modules/.cache
\`\`\`

### Step 3: Verify .env.local File
\`\`\`bash
# Make sure your .env.local has these exact values:
cat .env.local
\`\`\`

Should show:
\`\`\`
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_DEV_MODE=false
NEXT_PUBLIC_PACKAGE_ID=0x41fa1afb9f46d2f76944799331348465fbb84d75a37841687105fc6693183ff6
NEXT_PUBLIC_GAME_STATE_ID=0x4b1597293e5724f4443959e1a8c709c519d615ae1912538e4a1ef00b64fa9997
\`\`\`

### Step 4: Restart Dev Server
\`\`\`bash
npm run dev
\`\`\`

### Step 5: Hard Refresh Browser
- Chrome/Edge: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
- Safari: `Cmd+Option+R`
- Firefox: `Ctrl+Shift+R`

## Verification

After restarting, check your browser console. You should see:
- ✅ No `[v0]` debug messages
- ✅ No "contract not configured" errors
- ✅ Statistics page showing data or loading state
- ✅ Mystery box showing 0 SUI accumulated (if no games played yet)

## For Vercel Deployment

If the issue persists on Vercel:

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Make sure these are set for **all environments** (Production, Preview, Development):
   - `NEXT_PUBLIC_NETWORK=mainnet`
   - `NEXT_PUBLIC_DEV_MODE=false`
   - `NEXT_PUBLIC_PACKAGE_ID=0x41fa1afb9f46d2f76944799331348465fbb84d75a37841687105fc6693183ff6`
   - `NEXT_PUBLIC_GAME_STATE_ID=0x4b1597293e5724f4443959e1a8c709c519d615ae1912538e4a1ef00b64fa9997`

4. Redeploy:
   - Go to Deployments tab
   - Click the "..." menu on the latest deployment
   - Select "Redeploy"

## Still Not Working?

If environment variables still aren't loading, create a test file to debug:

\`\`\`typescript
// app/test/page.tsx
export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variable Test</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify({
          NETWORK: process.env.NEXT_PUBLIC_NETWORK,
          DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE,
          PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID,
          GAME_STATE_ID: process.env.NEXT_PUBLIC_GAME_STATE_ID,
        }, null, 2)}
      </pre>
    </div>
  )
}
\`\`\`

Visit `http://localhost:3000/test` to see what values are actually being loaded.
