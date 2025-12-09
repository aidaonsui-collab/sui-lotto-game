#!/bin/bash

echo "🔄 Full project reset starting..."

# Stop any running dev servers
echo "🛑 Stopping any running processes..."
pkill -f "next dev" || true

# Clean all caches and builds
echo "🧹 Cleaning all caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Build fresh
echo "🔨 Building fresh..."
npm run build

echo "✅ Reset complete! Now run: npm run dev"
