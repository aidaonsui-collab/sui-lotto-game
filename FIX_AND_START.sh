#!/bin/bash

echo "==================================="
echo "FIXING SUI LOTTO GAME"
echo "==================================="
echo ""

# Step 1: Remove Desktop lockfile
echo "Step 1: Removing Desktop lockfile..."
rm -f ~/Desktop/package-lock.json
echo "✓ Done"
echo ""

# Step 2: Clean project
echo "Step 2: Cleaning caches and build files..."
rm -rf .next
rm -rf node_modules
rm -rf contracts/build
rm -rf contracts/Move.lock
echo "✓ Done"
echo ""

# Step 3: Install dependencies
echo "Step 3: Installing dependencies..."
npm install
echo "✓ Done"
echo ""

# Step 4: Start dev server
echo "Step 4: Starting development server..."
echo ""
echo "==================================="
echo "Your app will start at:"
echo "http://localhost:3000"
echo "==================================="
echo ""

npm run dev
