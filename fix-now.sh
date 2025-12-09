#!/bin/bash
echo "Stopping any running dev server..."
pkill -f "next dev" 2>/dev/null

echo "Removing node_modules..."
rm -rf node_modules

echo "Removing package-lock.json..."
rm -f package-lock.json

echo "Installing all packages..."
npm install

echo ""
echo "Done! Now run: npm run dev"
