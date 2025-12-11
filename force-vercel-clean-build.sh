#!/bin/bash

echo "🔧 Forcing Vercel to do a completely clean build..."
echo ""

# Add a timestamp comment to bet-amount.tsx to force recompilation
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "// Force rebuild: $TIMESTAMP" >> components/game/bet-amount.tsx

echo "📝 Added timestamp to force recompilation..."
echo ""

# Stage all changes
git add vercel.json components/game/bet-amount.tsx

# Commit
git commit -m "Force clean Vercel build: disable cache and force TypeScript recompilation"

# Push
echo "🚀 Pushing to GitHub to trigger clean Vercel build..."
git push origin main

echo ""
echo "✅ Done! Vercel will now build without any caching."
echo "Monitor your deployment at: https://vercel.com"

