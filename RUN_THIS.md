# How to Fix Your Project

## Step 1: Navigate to your project directory

Open a NEW terminal and run:

\`\`\`bash
cd ~/Desktop/sui-lotto-game
\`\`\`

## Step 2: Run the quick fix script

\`\`\`bash
chmod +x quick-fix.sh
./quick-fix.sh
\`\`\`

That's it! The script will clean everything and start your dev server.

If the script doesn't work, manually run these commands one by one:

\`\`\`bash
cd ~/Desktop/sui-lotto-game
rm -f ~/Desktop/package-lock.json
rm -rf .next node_modules/.cache contracts/build contracts/Move.lock
npm install
npm run dev
