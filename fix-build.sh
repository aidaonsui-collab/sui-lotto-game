#!/bin/bash

echo "🧹 Fixing build issues..."

# Remove the problematic Desktop lockfile
if [ -f "../package-lock.json" ]; then
  echo "Removing Desktop lockfile..."
  rm ../package-lock.json
fi

# Clean all Next.js caches
echo "Cleaning Next.js caches..."
rm -rf .next
rm -rf node_modules/.cache

# Reinstall node_modules to ensure clean state
echo "Reinstalling dependencies..."
rm -rf node_modules
npm install

echo "✅ Build configuration fixed!"
echo ""
echo "Now run: npm run dev"
