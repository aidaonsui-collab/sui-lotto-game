# Git Commands to Fix Your Branch Issue

Follow these commands **one at a time** in your terminal:

## Step 1: Navigate to project root
\`\`\`bash
cd ~/sui-blockchain-lotto
# (or wherever your project root is - NOT the contracts folder)
\`\`\`

## Step 2: Stage only the contract config file
\`\`\`bash
git add lib/contract-config.ts
\`\`\`

## Step 3: Commit just the contract config
\`\`\`bash
git commit -m "mainnet live - correct contract IDs + cleanup"
\`\`\`

## Step 4: Stash other unrelated changes
\`\`\`bash
git stash push -m "temporary stash of unrelated changes"
\`\`\`

## Step 5: Pull and rebase with remote
\`\`\`bash
git pull --rebase origin main
\`\`\`

## Step 6: Push your changes
\`\`\`bash
git push origin main
\`\`\`

## Step 7 (Optional): Restore stashed changes
\`\`\`bash
git stash pop
\`\`\`

---

## What Each Command Does:

- **Step 2**: Adds only your contract configuration file to git staging
- **Step 3**: Commits just that file with your message
- **Step 4**: Temporarily saves all your other changes (DS_Store deletions, etc.)
- **Step 5**: Downloads changes from GitHub and replays your commit on top
- **Step 6**: Uploads your commit to GitHub
- **Step 7**: Brings back the changes you stashed if you want them

---

## If You Get Conflicts During Step 5:

\`\`\`bash
# Edit the conflicting files in your code editor
# Then run:
git add <filename-that-had-conflict>
git rebase --continue
git push origin main
\`\`\`

---

## Alternative: Commit Everything Together

If you want to commit ALL changes (including deletions):

\`\`\`bash
git add -A
git commit -m "mainnet live - correct contract IDs + cleanup"
git pull --rebase origin main
git push origin main
