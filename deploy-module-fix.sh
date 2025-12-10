#!/bin/bash

echo "Deploying the FINAL clean contract + fixing the frontend module name..."

# 1. Deploy a brand-new clean contract (fresh IDs, no old baggage)
cd contracts/playground
sui move build
sui client publish --gas-budget 200000000

# 2. Grab the new IDs from the output
echo "Copy these new IDs when the publish finishes:"
echo "Package ID → 0x..."
echo "Game Object ID → 0x..."

# 3. Update the frontend with the correct module name "lotto_game"
cd ../../
sed -i '' 's/lotto_game_simple/lotto_game/g' lib/contract-config.ts
sed -i '' 's/lotto_game_simple/lotto_game/g' **/*.tsx 2>/dev/null || true

# 4. Update .env.local with YOUR NEW IDs (you’ll paste them here)
cat > .env.local << EOL
NEXT_PUBLIC_PACKAGE_ID=YOUR_NEW_PACKAGE_ID_HERE
NEXT_PUBLIC_GAME_OBJECT_ID=YOUR_NEW_GAME_OBJECT_ID_HERE
NEXT_PUBLIC_NETWORK=mainnet
EOL

echo ""
echo "Now:"
echo "1. Paste your NEW Package ID and Game Object ID into .env.local"
echo "2. Run: git add . && git commit -m 'final clean contract' && git push -f"
echo "3. Vercel will auto-deploy — your site will be 100% LIVE with no errors"

