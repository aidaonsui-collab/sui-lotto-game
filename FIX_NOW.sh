#!/bin/bash

echo "Step 1: Ignoring build files..."
cd ..
echo "build/" >> contracts/.gitignore
echo "*.DS_Store" >> .gitignore

echo "Step 2: Removing tracked build files from git..."
git rm -r --cached contracts/build/ 2>/dev/null || echo "Build files already removed"
git rm --cached .DS_Store ../.DS_Store 2>/dev/null || echo "DS_Store already removed"

echo "Step 3: Committing gitignore changes..."
git add .gitignore contracts/.gitignore
git commit -m "Add gitignore for build files and DS_Store"

echo "Step 4: Setting pull strategy..."
git config pull.rebase false

echo "Step 5: Pulling remote changes..."
git pull origin main

echo "Step 6: Pushing changes..."
git push origin main

echo "✅ Done! Your git is now synced."
