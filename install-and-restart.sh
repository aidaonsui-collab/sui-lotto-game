#!/bin/bash

echo "🔧 Fixing Tailwind CSS configuration..."

# Stop any running dev servers
pkill -f next || true

# Remove all caches and old dependencies
echo "🧹 Cleaning caches..."
rm -rf .next .turbo node_modules/.cache node_modules package-lock.json

# Reinstall dependencies with Tailwind v3
echo "📦 Installing dependencies with Tailwind v3..."
npm install

# Clear again just in case
rm -rf .next .turbo

echo "✅ Setup complete!"
echo ""
echo "Now run: npm run dev"
echo "Then in your browser, do a HARD REFRESH: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)"
