#!/bin/bash

echo "🧹 Cleaning all caches..."
rm -rf build/ Move.lock
rm -rf ~/.cargo/git/db/*sui*
rm -rf ~/.cargo/git/checkouts/sui-*

echo ""
echo "📦 Building contract..."
sui move build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Publishing to testnet..."
    sui client publish --gas-budget 100000000
else
    echo ""
    echo "❌ Build failed. Trying with explicit dependency..."
    
    # Add explicit dependency as fallback
    cat > Move.toml << 'EOF'
[package]
name = "playground"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "testnet-v1.34.1" }

[addresses]
playground = "0x0"
EOF
    
    rm -rf build/ Move.lock
    sui move build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build successful with explicit dependency!"
        sui client publish --gas-budget 100000000
    fi
fi
