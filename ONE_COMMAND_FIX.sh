#!/bin/bash

echo "Removing problematic Desktop lockfile..."
rm -f ~/Desktop/package-lock.json

echo "Cleaning project caches..."
rm -rf .next node_modules

echo "Reinstalling dependencies..."
npm install

echo "Starting dev server..."
npm run dev
