#!/bin/bash
echo "Checking your mainnet contract..."

PACKAGE="0x576102e25b27195ee4e3ad18da30e840f2390cfe2ace04554d0a3418311af464"
GAME="0x7f537ced9c6b21aacb39d95a14a1e66613149513f2dd5631a9a3af38311bf7fd"

echo "Package ID: $PACKAGE"
sui client object $PACKAGE > /dev/null 2>&1 && echo "Package OK" || echo "Package NOT FOUND"

echo "Game Object ID: $GAME"
sui client object $GAME --json | jq '{owner: .data.owner, balance: .data.content.fields.balance // .data.content.fields.value}' || echo "Game object NOT FOUND"

echo ""
echo "If both say OK → your contract is live and IDs are correct"
