#!/bin/bash

echo "=========================================="
echo "Fixing Next.js Module Resolution Issue"
echo "=========================================="
echo ""

# Remove the problematic Desktop lockfile
echo "Step 1: Removing Desktop lockfile..."
rm -f ~/Desktop/package-lock.json
echo "✓ Desktop lockfile removed"
echo ""

# Clean Next.js cache
echo "Step 2: Cleaning Next.js cache..."
rm -rf .next
echo "✓ Cache cleaned"
echo ""

# Reinstall dependencies
echo "Step 3: Reinstalling dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

echo "=========================================="
echo "Fix complete! Now run: npm run dev"
echo "=========================================="
