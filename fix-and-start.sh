#!/bin/bash

echo "🛑 Stopping any running processes..."
pkill -f "next dev" 2>/dev/null || true

echo "🧹 Cleaning build cache..."
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache

echo "⏳ Waiting 2 seconds..."
sleep 2

echo "🚀 Starting dev server..."
npm run dev
