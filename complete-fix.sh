#!/bin/bash

echo "🔧 Complete Project Fix Script"
echo "================================"

# Step 1: Remove problematic Desktop lockfile
echo ""
echo "Step 1: Removing Desktop lockfile..."
if [ -f ~/Desktop/package-lock.json ]; then
  rm ~/Desktop/package-lock.json
  echo "✅ Removed Desktop lockfile"
else
  echo "✓ No Desktop lockfile found"
fi

# Step 2: Ensure we're in the right directory
cd "$(dirname "$0")"
echo ""
echo "Step 2: Working in: $(pwd)"

# Step 3: Add build directories to gitignore
echo ""
echo "Step 3: Updating .gitignore..."
cat >> .gitignore << 'EOF'

# Sui Move build artifacts
contracts/build/
contracts/Move.lock
**/build/
**/.move/

# OS files
.DS_Store
**/.DS_Store
EOF
echo "✅ Updated .gitignore"

# Step 4: Clean git state
echo ""
echo "Step 4: Cleaning git state..."
cd contracts
git clean -fd
cd ..
echo "✅ Cleaned build artifacts"

# Step 5: Clean Next.js cache
echo ""
echo "Step 5: Cleaning Next.js cache..."
rm -rf .next
rm -rf .turbo
echo "✅ Cleaned Next.js cache"

# Step 6: Reinstall dependencies
echo ""
echo "Step 6: Reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install
echo "✅ Dependencies reinstalled"

# Step 7: Fix git branch divergence
echo ""
echo "Step 8: Syncing with remote..."
git add .gitignore
git commit -m "fix: ignore build directories and clean project" || echo "Nothing to commit"
git fetch origin main
git rebase origin/main || {
  echo "⚠️  Rebase conflict detected. Resolving..."
  git rebase --abort
  git pull --no-rebase origin main
}

echo ""
echo "================================"
echo "✅ Fix complete!"
echo ""
echo "Now run: npm run dev"
