# Fix TypeScript Build Error on Vercel

## The Problem
Vercel build fails with:
\`\`\`
Type '{ ... selectedTiles: number; }' is not assignable to type 'IntrinsicAttributes & BetAmountProps'.
Property 'selectedTiles' does not exist on type 'IntrinsicAttributes & BetAmountProps'.
\`\`\`

But when you check `components/game/bet-amount.tsx`, the `selectedTiles` property IS defined in the `BetAmountProps` interface.

**Root Cause:** TypeScript build cache on Vercel has a stale type definition.

---

## Solution 1: Automated Script (Recommended)

\`\`\`bash
# Make the script executable
chmod +x fix-typescript-cache.sh

# Run it
./fix-typescript-cache.sh
\`\`\`

This script will:
1. Clean all TypeScript and build caches locally
2. Test the build locally to ensure it works
3. Push changes to GitHub (triggering Vercel rebuild)

---

## Solution 2: Manual Steps

### Step 1: Clean Local Caches
\`\`\`bash
# Remove all caches
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache
rm -rf tsconfig.tsbuildinfo

# Test build
npm run build
\`\`\`

### Step 2: Force Git Push
\`\`\`bash
# Touch the file to update timestamp
touch components/game/bet-amount.tsx

# Commit and push
git add components/game/bet-amount.tsx
git commit -m "fix: force TypeScript recompile for BetAmountProps"
git push origin main
\`\`\`

### Step 3: Clear Vercel Build Cache
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `sui-lotto-game` project
3. Click on Settings → General
4. Scroll to "Build & Development Settings"
5. Click **"Clear Build Cache"**
6. Go back to Deployments
7. Find your latest failed deployment
8. Click the three dots (⋮) → **"Redeploy"**

---

## Solution 3: Nuclear Option (If All Else Fails)

If the above doesn't work, force Vercel to do a completely fresh install:

\`\`\`bash
# Add a dummy file to force fresh build
echo "# Force rebuild" >> .vercel-rebuild-$(date +%s).txt

# Commit and push
git add .
git commit -m "force: trigger complete Vercel rebuild"
git push origin main
\`\`\`

Then on Vercel dashboard:
1. Settings → General → Clear Build Cache
2. Settings → Environment Variables → Re-save all variables (even without changes)
3. Redeploy

---

## Why This Happens

TypeScript caches compiled type information in:
- `.next/` folder
- `node_modules/.cache/`
- `tsconfig.tsbuildinfo`

When you update a type definition, sometimes the cache isn't invalidated properly, especially on remote build servers like Vercel.

**The fix:** Force a complete recompile by clearing caches and triggering a fresh build.

---

## Verify the Fix

After Vercel rebuilds successfully, check:
1. Build logs should show: ✓ Compiled successfully
2. Visit your production URL
3. UI should match localhost with all components visible:
   - Jackpot Display (with real SUI amounts)
   - Mystery Box card
   - Game Statistics panels
   - Live Game Stats sidebar

---

## Prevention

To avoid this in the future, when changing TypeScript interfaces:
1. Always clear `.next/` locally after type changes
2. Test `npm run build` before pushing
3. Use `npm run dev` in a fresh terminal to ensure clean cache
