#!/bin/bash

echo "Cleaning up problematic bet-amount-wrapper files..."
echo "========================================================"

# Find and remove any bet-amount-wrapper files
echo "1. Searching for bet-amount-wrapper files..."
find . -name "*bet-amount-wrapper*" -type f | grep -v ".git" | grep -v "node_modules"

echo ""
echo "2. Removing bet-amount-wrapper files..."
find . -name "*bet-amount-wrapper*" -type f | grep -v ".git" | grep -v "node_modules" | while read file; do
    echo "   Deleting: $file"
    rm -f "$file"
done

echo ""
echo "3. Checking for nested components/game/components directory..."
if [ -d "components/game/components" ]; then
    echo "   Found nested directory: components/game/components"
    echo "   Removing entire directory..."
    rm -rf components/game/components
    echo "   ✅ Removed"
else
    echo "   ✅ No nested components directory found"
fi

echo ""
echo "4. Current git status:"
git status --short

echo ""
echo "5. Committing cleanup..."
git add -A
git commit -m "Clean up: Remove bet-amount-wrapper and nested components directory"

echo ""
echo "6. Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Cleanup complete! Now redeploying to Vercel..."
echo ""
vercel --prod --force