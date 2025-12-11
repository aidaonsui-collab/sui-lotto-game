#!/bin/bash

echo "Pushing BetAmount wrapper fix to resolve Vercel build..."

git add components/game/bet-amount-wrapper.tsx
git add components/game/game-board.tsx
git commit -m "Fix: Add BetAmount wrapper to resolve Vercel TypeScript issue"
git push origin main

echo "Done! Monitor deployment at https://vercel.com"
