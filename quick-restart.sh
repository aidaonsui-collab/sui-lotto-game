#!/bin/bash

echo "🛑 Stopping Next.js..."
pkill -f next || true

echo "🧹 Clearing cache..."
rm -rf .next .turbo

echo "✅ Starting dev server without Turbopack..."
npm run dev
