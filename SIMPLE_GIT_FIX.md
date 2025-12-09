# Simple Git Fix

Run these commands one by one in your terminal:

## Step 1: Clean up the mess
\`\`\`bash
cd contracts
git clean -fd
cd ..
\`\`\`

## Step 2: Discard build file deletions
\`\`\`bash
git checkout -- contracts/build/
\`\`\`

## Step 3: Add gitignore for build files
\`\`\`bash
echo "build/" >> contracts/.gitignore
echo "Move.lock" >> contracts/.gitignore
git add contracts/.gitignore
\`\`\`

## Step 4: Configure git to use rebase
\`\`\`bash
git config pull.rebase true
\`\`\`

## Step 5: Pull changes
\`\`\`bash
git pull origin main
\`\`\`

## Step 6: Commit and push your changes
\`\`\`bash
git add lib/contract-config.ts
git commit -m "mainnet live - contract config update"
git push origin main
\`\`\`

If Step 5 shows conflicts, run:
\`\`\`bash
git rebase --abort
git pull origin main --rebase=false
\`\`\`
Then continue with Step 6.
