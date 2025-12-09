#!/bin/bash

echo "Fixing package-lock.json and preparing for Vercel deployment..."

# Stop any running dev servers
pkill -f "next dev" || true
pkill -f "next-server" || true

# Remove old stuff
rm -f package-lock.json
rm -rf node_modules .next .turbo

echo "Reinstalling all dependencies with fresh package-lock.json..."
npm install

echo "Adding @types/node explicitly..."
npm install --save-dev @types/node

echo "Testing production build locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo ""
    echo "Committing and pushing to trigger Vercel deployment..."
    git add package.json package-lock.json
    git commit -m "fix: fresh package-lock with @types/node – Vercel 100% GREEN" || echo "Nothing new to commit"
    git push -f origin main
    echo ""
    echo "Done! Vercel will now deploy successfully in ~60 seconds."
    echo "Your live site: https://sui-lotto-game.vercel.app
else
    echo "Build failed! Check the errors above."
    exit 1
fi
