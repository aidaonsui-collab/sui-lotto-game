#!/bin/bash

# Navigate to project directory
cd ~/Desktop/sui-lotto-game

# Remove problematic Desktop lockfile
rm -f ~/Desktop/package-lock.json

# Clean all caches and build files
rm -rf .next node_modules contracts/build contracts/Move.lock

# Reinstall dependencies
npm install

# Start dev server
npm run dev
