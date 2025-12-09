# Fix Git Sync Issue

Run these commands in your terminal:

\`\`\`bash
chmod +x fix-git-sync.sh
./fix-git-sync.sh
\`\`\`

This will:
1. Stash your changes temporarily
2. Pull the latest code from GitHub
3. Restore your changes
4. Commit everything
5. Push to GitHub

If you get conflicts, the script will pause and you'll need to manually resolve them in your code editor, then run:
\`\`\`bash
git add -A
git commit -m "mainnet live - correct contract IDs + cleanup"
git push origin main
