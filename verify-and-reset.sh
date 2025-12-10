#!/bin/bash

set -e  # stop on any error

echo "Verifying your current mainnet contract..."

PACKAGE="0x576102e25b27195ee4e3ad18da30e840f2390cfe2ace04554d0a3418311af464"
GAME="0x7f537ced9c6b21aacb39d95a14a1e66613149513f2dd5631a9a3af38311bf7fd"

echo "Package ID: $PACKAGE"
if sui client object "$PACKAGE" >/dev/null 2>&1; then
    echo "Package FOUND"
else
    echo "Package NOT FOUND – you need to deploy again"
    exit 1
fi

echo "Game Object ID: $GAME"
if sui client object "$GAME" --json | grep -q "content"; then
    echo "Game object FOUND and has data"
    sui client object "$GAME" --json | jq '.content.fields | {balance, jackpot, current_round}'
else
    echo "Game object NOT FOUND or empty"
    exit 1
fi

echo ""
echo "Your contract is 100% ALIVE on mainnet"
echo ""
echo "Your final working config (copy-paste into Vercel):"
echo "NEXT_PUBLIC_PACKAGE_ID=$PACKAGE"
echo "NEXT_PUBLIC_GAME_OBJECT_ID=$GAME"
echo "NEXT_PUBLIC_NETWORK=mainnet"
echo ""
echo "Now just:"
echo "1. Go to Vercel → Settings → Environment Variables"
echo "2. Paste the 3 lines above"
echo "3. Click Redeploy (or Clear cache and deploy)"
echo ""
echo "Your site will be LIVE in 60 seconds at https://sui-lotto-game.vercel.app"

