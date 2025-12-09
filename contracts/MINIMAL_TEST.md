# Minimal Test Contract - Debugging Guide

## The groth16 error persists even after reinstalling Sui CLI

This means the issue is environmental. Let's test with a minimal contract first.

## Step 1: Test with Minimal Contract

\`\`\`bash
cd contracts
chmod +x test_publish.sh
./test_publish.sh
\`\`\`

This script will:
1. Clean all caches
2. Try building with NO dependencies (auto-add)
3. If that fails, try with explicit v1.34.1 (pre-groth16)
4. Attempt to publish

## Step 2: If Minimal Contract WORKS

Rename the files back:
\`\`\`bash
mv sources/playground.move sources/playground_full.move
mv sources/test_minimal.move sources/playground.move
\`\`\`

Then gradually add features from playground_full.move.

## Step 3: If Minimal Contract STILL FAILS

The problem is your Sui CLI installation or Mac environment. Try Docker:

\`\`\`bash
# Install Docker if you don't have it
# Then run Sui in a container:

docker run -it --rm \
  -v $(pwd):/workspace \
  -w /workspace \
  mysten/sui-tools:mainnet \
  bash -c "sui client publish --gas-budget 100000000"
\`\`\`

## Step 4: Check Your Sui Version

\`\`\`bash
sui --version
\`\`\`

If you're on a version with known groth16 issues (v1.46.x), downgrade:

\`\`\`bash
cargo install --locked \
  --git https://github.com/MystenLabs/sui.git \
  --tag testnet-v1.34.1 \
  sui
\`\`\`

## Alternative: Use Sui Move Analyzer VS Code Extension

Install the official Sui Move extension in VS Code, which may have better dependency resolution.
