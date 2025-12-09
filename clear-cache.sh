#!/bin/bash

# Clear Next.js build cache and restart dev server

echo "🧹 Clearing Next.js cache..."

# Stop any running dev server
echo "Stopping any running dev servers..."
pkill -f "next dev" 2>/dev/null || true

# Remove Next.js cache
rm -rf .next

# Remove Turbopack cache
rm -rf .turbo

# Remove node_modules cache
rm -rf node_modules/.cache

echo "✅ Cache cleared!"
echo ""
echo "📝 Now restart your dev server with: npm run dev"
echo ""
echo "🔍 Your environment variables:"
echo "  NEXT_PUBLIC_PACKAGE_ID: $NEXT_PUBLIC_PACKAGE_ID"
echo "  NEXT_PUBLIC_GAME_STATE_ID: $NEXT_PUBLIC_GAME_STATE_ID"
echo "  NEXT_PUBLIC_DEV_MODE: $NEXT_PUBLIC_DEV_MODE"
echo "  NEXT_PUBLIC_NETWORK: $NEXT_PUBLIC_NETWORK"
