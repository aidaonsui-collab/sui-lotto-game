#!/bin/bash
set -e

echo "🔧 Fixing TypeScript Cache Issue"
echo "=================================="
echo ""

# Stop any running dev server
echo "🛑 Stopping dev server..."
pkill -f "next dev" || true
pkill -f "next-server" || true
sleep 2

# Clean TypeScript and Next.js caches
echo "🧹 Cleaning TypeScript and build caches..."
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache
rm -rf tsconfig.tsbuildinfo
echo "✅ Caches cleared"
echo ""

# Test build locally
echo "🔨 Testing local build..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build successful locally!"
  echo ""
  echo "📤 Pushing to GitHub to trigger Vercel rebuild..."
  echo ""
  
  # Create a trivial change to force rebuild
  touch components/game/bet-amount.tsx
  
  # Stage all changes
  git add -A
  
  # Commit
  git commit -m "fix: force TypeScript recompile for BetAmountProps" || echo "No changes to commit"
  
  # Push
  git push origin main
  
  echo ""
  echo "✅ Done! Pushed to GitHub."
  echo ""
  echo "🔄 Vercel should now rebuild with fresh TypeScript cache."
  echo ""
  echo "If build still fails on Vercel:"
  echo "1. Go to: https://vercel.com/dashboard"
  echo "2. Select your project"
  echo "3. Go to Settings > General"
  echo "4. Click 'Clear Build Cache'"
  echo "5. Click 'Redeploy' on your latest deployment"
  echo ""
else
  echo ""
  echo "❌ Build failed locally!"
  echo ""
  echo "Please review the error above and fix it before pushing."
  echo ""
fi
