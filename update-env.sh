#!/bin/bash

echo "🔧 Environment Variable Update Script"
echo "====================================="
echo ""

# Get user input
read -p "Enter your Package ID (0x...): " package_id
read -p "Enter your GameState Object ID (0x...): " game_state_id

# Validate input
if [[ ! $package_id =~ ^0x[a-fA-F0-9]{64}$ ]]; then
    echo "❌ Invalid Package ID format. Should be 0x followed by 64 hex characters"
    exit 1
fi

if [[ ! $game_state_id =~ ^0x[a-fA-F0-9]{64}$ ]]; then
    echo "❌ Invalid GameState ID format. Should be 0x followed by 64 hex characters"
    exit 1
fi

# Create or update .env.local
cat > .env.local << EOF
# Network: mainnet | testnet | devnet
NEXT_PUBLIC_NETWORK=mainnet

# Development Mode (set to 'false' for mainnet)
NEXT_PUBLIC_DEV_MODE=false

# Smart Contract Addresses
NEXT_PUBLIC_PACKAGE_ID=$package_id
NEXT_PUBLIC_GAME_STATE_ID=$game_state_id

# Developer wallet (hardcoded in contract)
# 0x92a32ac7fd525f8bd37ed359423b8d7d858cad26224854dfbff1914b75ee658b
EOF

echo "✅ .env.local file updated successfully!"
echo ""
echo "📋 Current configuration:"
cat .env.local
echo ""
echo "Next steps:"
echo "1. Clear cache: rm -rf .next .turbo node_modules/.cache"
echo "2. Start dev server: npm run dev"
echo "3. Do a hard refresh in browser (Cmd+Shift+R)"
echo "4. Update Vercel environment variables with these same values"
echo ""
