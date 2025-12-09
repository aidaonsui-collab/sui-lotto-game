# Troubleshooting Guide - Fix groth16 Duplicate Module Error

## The Problem
You're seeing: `Duplicate module found: 0x0000000000000000000000000000000000000000000000000000000000000002::groth16`

This happens when Sui's automatic dependency management conflicts with cached dependencies.

## Solutions (Try in Order)

### Solution 1: Clean All Caches (RECOMMENDED)
\`\`\`bash
cd contracts

# Step 1: Remove all build artifacts
rm -rf build/

# Step 2: Remove Move.lock file
rm -f Move.lock

# Step 3: Clear Sui's git dependency cache
rm -rf ~/.cargo/git/checkouts/sui-*

# Step 4: Try building again
sui move build

# Step 5: If build succeeds, publish
sui client publish --gas-budget 100000000
\`\`\`

### Solution 2: Update Sui CLI
Your Sui CLI might be outdated or have a bug:

\`\`\`bash
# Update to latest mainnet version
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

# Verify version
sui --version

# Clean and rebuild
cd contracts
rm -rf build/ Move.lock
sui move build
\`\`\`

### Solution 3: Recreate Project from Scratch
If the above doesn't work, start fresh:

\`\`\`bash
# Navigate to parent directory
cd ..

# Backup your contract code
cp contracts/sources/playground.move ~/playground_backup.move

# Delete contracts folder
rm -rf contracts/

# Create new Sui project
sui move new playground

# Replace the Move.toml
cd playground
cat > Move.toml << 'EOF'
[package]
name = "playground"
version = "0.0.1"
edition = "2024.beta"

[addresses]
playground = "0x0"
EOF

# Copy your contract back
cp ~/playground_backup.move sources/playground.move

# Build and publish
sui move build
sui client publish --gas-budget 100000000
\`\`\`

### Solution 4: Use Different Network
The issue might be specific to your network configuration:

\`\`\`bash
# Check current network
sui client active-env

# Switch to testnet
sui client switch --env testnet

# Try publishing
sui client publish --gas-budget 100000000

# If successful, switch to mainnet
sui client switch --env mainnet
sui client publish --gas-budget 100000000
\`\`\`

### Solution 5: Specify Edition 2024.beta More Explicitly
Some Sui CLI versions require specific edition formats:

\`\`\`bash
cd contracts

# Edit Move.toml to use this exact format:
cat > Move.toml << 'EOF'
[package]
name = "playground"
edition = "2024.beta"

[addresses]
playground = "0x0"
EOF

# Clean and rebuild
rm -rf build/ Move.lock
sui move build
\`\`\`

### Verify Your Move.toml Has NO Dependencies Section
Open `Move.toml` and make sure it looks EXACTLY like this:

\`\`\`toml
[package]
name = "playground"
version = "0.0.1"
edition = "2024.beta"

[addresses]
playground = "0x0"
\`\`\`

**Important**: There should be NO `[dependencies]` section at all. Sui adds these automatically.

## Still Having Issues?

If none of the above work, the issue might be with your Sui CLI installation. Try:

1. **Complete reinstall of Sui CLI:**
\`\`\`bash
# Remove Sui CLI
cargo uninstall sui

# Clear all caches
rm -rf ~/.sui/
rm -rf ~/.cargo/git/checkouts/sui-*

# Reinstall latest version
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

# Restart your terminal
\`\`\`

2. **Check for conflicting installations:**
\`\`\`bash
# Find all sui binaries
which -a sui

# Make sure you're only using one version
sui --version
\`\`\`

3. **Use Docker (if all else fails):**
\`\`\`bash
# Pull Sui CLI Docker image
docker pull mysten/sui-tools:mainnet

# Publish from Docker
docker run -v $(pwd)/contracts:/app mysten/sui-tools:mainnet \
  sui client publish --path /app --gas-budget 100000000
\`\`\`

## Need More Help?

Join the Sui Discord: https://discord.gg/sui
Post in #developer-questions with your error and Sui CLI version.
