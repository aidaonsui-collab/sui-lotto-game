#!/bin/bash

echo "🧹 Cleaning up old installation..."
rm -rf node_modules
rm -f package-lock.json

echo "🧼 Clearing npm cache..."
npm cache clean --force

echo "📦 Installing all dependencies..."
npm install

echo "✅ Installation complete! Now run: npm run dev"
