#!/bin/bash

echo "Step 1: Adding .gitignore for build files..."
cd contracts
git checkout .gitignore 2>/dev/null || echo "Creating new .gitignore"

echo "Step 2: Cleaning up build files from git..."
git rm -r --cached build/ 2>/dev/null || true
git add .gitignore

echo "Step 3: Removing all unstaged deletions..."
git checkout -- .

echo "Step 4: Going back to root directory..."
cd ..

echo "Step 5: Configuring git to use rebase..."
git config pull.rebase true

echo "Step 6: Pulling with rebase..."
git pull origin main

echo "Step 7: Adding contract config changes..."
git add lib/contract-config.ts 2>/dev/null || echo "No contract-config.ts changes"
git add contracts/.gitignore

echo "Step 8: Committing changes..."
git commit -m "mainnet live - correct contract IDs + cleanup" || echo "Nothing to commit"

echo "Step 9: Pushing to remote..."
git push origin main

echo "Done! Your changes are now synced."
