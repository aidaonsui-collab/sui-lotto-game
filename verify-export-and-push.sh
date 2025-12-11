#!/bin/bash

echo "🔍 Verifying bet-amount.tsx has correct export statement..."
echo ""

# Check current file content
echo "Current line 6 of bet-amount.tsx:"
sed -n '6p' components/game/bet-amount.tsx
echo ""

# Check if it has export
if grep -q "^export interface BetAmountProps" components/game/bet-amount.tsx; then
    echo "✅ File already has 'export interface BetAmountProps'"
else
    echo "❌ File is missing 'export' keyword - fixing now..."
    # Add export to the interface line
    sed -i.bak 's/^interface BetAmountProps/export interface BetAmountProps/' components/game/bet-amount.tsx
    echo "✅ Added 'export' keyword to BetAmountProps interface"
fi

echo ""
echo "📝 Checking git status..."
git status --short

echo ""
echo "📦 Committing changes..."
git add components/game/bet-amount.tsx
git commit -m "Fix: Export BetAmountProps interface to resolve Vercel TypeScript error"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Done! Vercel will now rebuild with the correct TypeScript definition."
echo "Monitor your deployment at: https://vercel.com"
