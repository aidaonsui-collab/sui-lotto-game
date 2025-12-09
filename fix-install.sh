#!/bin/bash

# Fix npm installation issues
# Run this script with: bash fix-install.sh

echo "Stopping any running dev servers..."
echo "Press Ctrl+C if dev server is running"
sleep 2

echo "Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "Cleaning npm cache..."
npm cache clean --force

echo "Installing dependencies..."
npm install

echo "Installation complete! Starting dev server..."
npm run dev
