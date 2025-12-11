#!/bin/bash

# Force Clean Build Script - Fixes TypeScript cache issues
# This script completely clears all build caches and forces a fresh TypeScript compilation

echo "🧹 Forcing complete clean build..."

# Step 1: Remove all build artifacts
echo "Step 1: Removing .next directory..."
rm -rf .next

echo "Step 2: Removing TypeScript build info..."
rm -f tsconfig.tsbuildinfo

echo "Step 3: Removing node_modules/.cache..."
rm -rf node_modules/.cache

echo "Step 4: Clearing Next.js cache..."
rm -rf .next/cache

# Step 5: Test build locally
echo "Step 5: Testing build locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Now pushing to trigger Vercel rebuild..."
    
    # Step 6: Create empty commit to force Vercel rebuild
    git commit --allow-empty -m "Force rebuild: Clear TypeScript cache"
    
    # Step 7: Push to GitHub
    git push origin main
    
    echo "✅ Pushed to GitHub. Vercel will now rebuild with fresh TypeScript compilation."
    echo "🔄 Monitor your Vercel deployment at: https://vercel.com"
else
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi
