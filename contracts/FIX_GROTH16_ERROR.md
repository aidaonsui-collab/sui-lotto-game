# Fix for groth16 Duplicate Module Error

This is a known bug in certain Sui CLI versions where the git dependency cache gets corrupted.

## Quick Fix (Try this first)

\`\`\`bash
# 1. Clear ALL Sui git caches
rm -rf ~/.cargo/git/checkouts/sui-*

# 2. Clear project build cache
cd contracts
rm -rf build/ Move.lock

# 3. Try building again
sui move build
\`\`\`

## If that doesn't work, update your Sui CLI

\`\`\`bash
# Install latest Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Or use a specific version known to work
cargo install --locked --git https://github.com/MystenLabs/sui.git --tag testnet-v1.40.0 sui
\`\`\`

## Check your environment

\`\`\`bash
# Check current Sui version
sui --version

# Should show something like: sui 1.40.0-xxx
\`\`\`

## Last Resort: Use Docker

If the error persists, use Docker to ensure a clean environment:

\`\`\`bash
# Pull official Sui image
docker pull mysten/sui-tools:testnet

# Run from contracts directory
docker run -v $(pwd):/app -w /app mysten/sui-tools:testnet sui move build
\`\`\`

## Why this happens

The groth16 module exists in two places in some Sui versions:
- In the main Sui framework
- In the Bridge package

When git dependencies are cached incorrectly, both get loaded causing the duplicate error.
