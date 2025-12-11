#!/bin/bash

echo "🔍 Diagnostic: Checking git synchronization and selectedTiles prop status"
echo "============================================================"
echo ""

echo "1️⃣ Checking if 'selectedTiles' exists in local game-board.tsx:"
echo "-----------------------------------------------------------"
if grep -n "selectedTiles" components/game/game-board.tsx; then
    echo "❌ FOUND: selectedTiles still exists in the file"
else
    echo "✅ GOOD: selectedTiles is completely removed from local file"
fi
echo ""

echo "2️⃣ Recent commit history:"
echo "-----------------------------------------------------------"
git log --oneline -5
echo ""

echo "3️⃣ Checking if local is ahead/behind origin/main:"
echo "-----------------------------------------------------------"
git fetch origin
git status
echo ""

echo "4️⃣ Checking diff between local and GitHub main:"
echo "-----------------------------------------------------------"
git diff origin/main components/game/game-board.tsx
echo ""

echo "5️⃣ Showing line 523 area of local file:"
echo "-----------------------------------------------------------"
sed -n '518,530p' components/game/game-board.tsx | cat -n
echo ""

echo "6️⃣ Checking current commit hash:"
echo "-----------------------------------------------------------"
echo "Local HEAD: $(git rev-parse HEAD)"
echo "Remote main: $(git rev-parse origin/main)"
echo ""

if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
    echo "⚠️  WARNING: Local and remote are NOT in sync!"
    echo "Run: git push origin main"
else
    echo "✅ Local and remote are in sync"
fi
