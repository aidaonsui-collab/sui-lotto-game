# PostCSS/Tailwind CSS Error Fix

Your Next.js build is failing because of a corrupted cache trying to use the old Tailwind CSS PostCSS plugin. Follow these steps exactly:

## Quick Fix (Recommended)

Run the automated fix script:

\`\`\`bash
chmod +x fix-postcss.sh
./fix-postcss.sh
\`\`\`

Then start the dev server:

\`\`\`bash
npm run dev
\`\`\`

## Manual Fix (If script doesn't work)

1. Stop the dev server (press Ctrl+C)

2. Remove all caches and node_modules:
\`\`\`bash
rm -rf .next .turbo node_modules/.cache node_modules package-lock.json
\`\`\`

3. Reinstall dependencies:
\`\`\`bash
npm install
\`\`\`

4. Start fresh:
\`\`\`bash
npm run dev
\`\`\`

## After the server starts

1. Open http://localhost:3000 in your browser
2. Do a **hard refresh**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
3. Check the console - you should see your actual contract addresses instead of placeholders

## Expected Console Output

After the hard refresh, you should see:
\`\`\`
gameStateId: '0x4b1597293e5724f4443959e1a8c709c519d615ae1912538e4a1ef00b64fa9997'
devMode: false
\`\`\`

Instead of:
\`\`\`
gameStateId: '0xYOUR_GAME_STATE_OBJECT_ID_HERE'
devMode: true
\`\`\`

## If you still see "Contract not configured"

Make sure your `.env.local` file has these values:
\`\`\`
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_DEV_MODE=false
NEXT_PUBLIC_PACKAGE_ID=0x41fa1afb9f46d2f76944799331348465fbb84d75a37841687105fc6693183ff6
NEXT_PUBLIC_GAME_STATE_ID=0x4b1597293e5724f4443959e1a8c709c519d615ae1912538e4a1ef00b64fa9997
\`\`\`

The hard refresh is critical because your browser cached the old JavaScript files with placeholder values.
