#!/bin/bash

echo "🔧 Fixing PostCSS/Tailwind CSS Issue"
echo "===================================="

# Step 1: Stop any running dev servers
echo ""
echo "Step 1: Stopping any running processes..."
pkill -f "next dev" || echo "✓ No running Next.js processes"

# Step 2: Remove all build caches
echo ""
echo "Step 2: Removing all caches..."
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache
echo "✅ Caches removed"

# Step 3: Remove and reinstall node_modules
echo ""
echo "Step 3: Reinstalling dependencies..."
rm -rf node_modules
rm -f package-lock.json
npm install
echo "✅ Dependencies reinstalled"

# Step 4: Verify Tailwind setup
echo ""
echo "Step 4: Verifying Tailwind CSS setup..."
if grep -q "@tailwindcss/postcss" package.json; then
  echo "✅ @tailwindcss/postcss is installed"
else
  echo "⚠️  Installing @tailwindcss/postcss..."
  npm install -D @tailwindcss/postcss@latest
fi

echo ""
echo "===================================="
echo "✅ Fix complete!"
echo ""
echo "Now run: npm run dev"
echo "Then do a hard refresh in browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)"
