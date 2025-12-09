#!/bin/bash

echo "Step 1: Checking current status..."
git status

echo ""
echo "Step 2: Stashing all changes..."
git stash save "temp-stash-before-sync"

echo ""
echo "Step 3: Pulling latest changes..."
git pull origin main

echo ""
echo "Step 4: Applying your stashed changes..."
git stash pop

echo ""
echo "Step 5: Adding all changes..."
git add -A

echo ""
echo "Step 6: Committing changes..."
git commit -m "mainnet live - correct contract IDs + cleanup"

echo ""
echo "Step 7: Pushing to remote..."
git push origin main

echo ""
echo "Done! Your changes are now synced with GitHub."
