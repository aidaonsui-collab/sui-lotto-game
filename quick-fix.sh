#!/bin/bash

echo "=== Quick Fix Script ==="
echo ""

# Step 1: Remove problematic Desktop lockfile
echo "Step 1: Removing Desktop lockfile..."
if [ -f ~/Desktop/package-lock.json ]; then
    rm ~/Desktop/package-lock.json
    echo "✓ Removed Desktop lockfile"
else
    echo "✓ No Desktop lockfile found"
fi

# Step 2: Clean build caches
echo ""
echo "Step 2: Cleaning caches..."
rm -rf .next node_modules/.cache contracts/build contracts/Move.lock

# Step 3: Reinstall dependencies
echo ""
echo "Step 3: Reinstalling dependencies..."
npm install

# Step 4: Start dev server
echo ""
echo "Step 4: Starting dev server..."
npm run dev
