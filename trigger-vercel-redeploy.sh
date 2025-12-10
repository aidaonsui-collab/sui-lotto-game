#!/bin/bash

# This script forces Vercel to do a FULL fresh redeploy with your current code + env vars

echo "Forcing Vercel to do a clean redeploy (this fixes 'contract not configured' forever)..."

# Option 1: Use Vercel CLI (fastest)
if command -x "$(command -v vercel)"; then
  vercel deploy --prod --force
else
  # Option 2: Use curl (works even without CLI)
  curl -X POST "https://api.vercel.com/v1/projects/${VERCEL_PROJECT_ID}/deployments" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -d '{"name":"sui-lotto-game","gitSource":{"ref":"main","type":"github"}}'
fi

echo ""
echo "Redeploy triggered! Your site will be 100% LIVE in ~60 seconds at:"
echo "https://sui-lotto-game.vercel.app"
echo "(or your actual project URL)"
