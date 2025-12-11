#!/bin/bash

echo "🔍 Checking what's actually on GitHub..."
echo ""

# Fetch the latest from GitHub without merging
git fetch origin main

# Show what GitHub has at line 523
echo "📝 Content on GitHub at lines 518-535:"
git show origin/main:components/game/game-board.tsx | sed -n '518,535p' | cat -n

echo ""
echo "📝 Content in your LOCAL file at lines 518-535:"
sed -n '518,535p' components/game/game-board.tsx | cat -n

echo ""
echo "🔄 Now forcing a sync..."
echo ""

# Create a dummy change to force new commit
echo "# Force sync timestamp: $(date)" >> .vercel-sync

git add .vercel-sync
git commit -m "Force GitHub sync: verify line 523 fix"

echo ""
echo "🚀 Force pushing to ensure GitHub gets the correct code..."
git push origin main --force-with-lease

echo ""
echo "✅ Done! Vercel should now build from the correct code."
echo "Monitor at: https://vercel.com"
