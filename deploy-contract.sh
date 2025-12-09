#!/bin/bash

echo "🎰 Sui Lotto Game - Contract Deployment Script"
echo "=============================================="
echo ""

# Check if sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "❌ Error: Sui CLI is not installed"
    echo "Please install it from: https://docs.sui.io/guides/developer/getting-started/sui-install"
    exit 1
fi

echo "✅ Sui CLI found: $(sui --version)"
echo ""

# Check active address
echo "📍 Active Sui Address:"
sui client active-address
echo ""

# Check balance
echo "💰 Checking wallet balance..."
sui client gas
echo ""

read -p "Do you have at least 0.5 SUI for gas fees? (yes/no): " has_gas
if [ "$has_gas" != "yes" ]; then
    echo "❌ Please fund your wallet with at least 0.5 SUI"
    echo "Then run this script again"
    exit 1
fi

# Navigate to contracts directory
if [ ! -d "contracts" ]; then
    echo "❌ Error: contracts directory not found"
    echo "Make sure you're in the project root directory"
    exit 1
fi

cd contracts
echo "📂 Navigated to contracts directory"
echo ""

# Build contract
echo "🔨 Building contract..."
sui move build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Confirm deployment
read -p "Ready to deploy to MAINNET? This will cost ~0.5 SUI (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🚀 Deploying to Sui Mainnet..."
echo "⏳ This may take 30-60 seconds..."
echo ""

# Deploy contract
sui client publish --gas-budget 100000000 > deployment-output.txt

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    cat deployment-output.txt
    exit 1
fi

echo "✅ Deployment successful!"
echo ""
echo "📋 Deployment output saved to: contracts/deployment-output.txt"
echo ""
echo "⚠️  IMPORTANT: Copy these values to your .env.local file:"
echo ""
cat deployment-output.txt | grep -A 5 "Published Objects\|Created Objects"
echo ""
echo "Next steps:"
echo "1. Copy the Package ID and GameState Object ID from above"
echo "2. Update your .env.local file with these values"
echo "3. Run: rm -rf .next && npm run dev"
echo "4. Deploy to Vercel with the new environment variables"
echo ""
echo "🎉 Deployment complete!"
