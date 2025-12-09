#!/bin/bash

echo "🧹 Cleaning old build files..."
rm -rf .next .turbo node_modules/.cache

echo ""
echo "🚀 Starting Next.js dev server..."
echo "⏳ IMPORTANT: Wait for 'compiled successfully' message before opening browser!"
echo ""

npm run dev
