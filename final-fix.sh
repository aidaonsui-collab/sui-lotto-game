#!/bin/bash

echo "🛑 Stopping all Next.js processes..."
pkill -f "next dev" || true
pkill -f "next-server" || true
sleep 2

echo "🧹 Removing build cache..."
rm -rf .next
rm -rf .turbo
rm -rf node_modules/.cache

echo "⏳ Waiting for file system to sync..."
sleep 3

echo "✅ Ready! Now run: npm run dev"
