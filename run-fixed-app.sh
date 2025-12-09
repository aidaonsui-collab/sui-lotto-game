#!/bin/bash

echo "════════════════════════════════════════════════════"
echo "  FIXING SUI LOTTO GAME DISPLAY ISSUES"
echo "════════════════════════════════════════════════════"
echo ""

# Step 1: Install missing packages
echo "📦 Step 1: Installing missing Radix UI packages..."
npm install @radix-ui/react-avatar@1.1.2 \
  @radix-ui/react-label@2.1.1 \
  @radix-ui/react-tabs@1.1.2 \
  @radix-ui/react-tooltip@1.1.6 \
  @radix-ui/react-dialog@1.1.4 \
  @radix-ui/react-dropdown-menu@2.1.4 \
  @radix-ui/react-progress@1.1.1 \
  @radix-ui/react-select@2.1.4 \
  @radix-ui/react-slider@1.2.1 \
  @radix-ui/react-switch@1.1.2 --legacy-peer-deps

echo ""
echo "✅ Packages installed!"
echo ""

# Step 2: Clear Next.js cache
echo "🧹 Step 2: Clearing Next.js cache..."
rm -rf .next

echo ""
echo "✅ Cache cleared!"
echo ""

# Step 3: Start dev server
echo "🚀 Step 3: Starting development server..."
echo ""
echo "════════════════════════════════════════════════════"
echo "  FIXES APPLIED:"
echo "  ✓ Tile grid now displays as proper 5x5 grid"
echo "  ✓ Font size increased to 2rem (32px)"
echo "  ✓ Font weight set to 900 (black) for visibility"
echo "  ✓ Header title made larger and bolder"
echo "  ✓ All Radix UI dependencies installed"
echo "════════════════════════════════════════════════════"
echo ""
echo "Opening http://localhost:3000 in your browser..."
echo ""

npm run dev
