# How to Fix Your Development Environment

Your terminal lost its working directory. Follow these steps:

## Step 1: Open a NEW terminal window/tab

Close your current terminal and open a fresh one.

## Step 2: Navigate to your project

\`\`\`bash
cd ~/sui-lotto-game
\`\`\`

If that doesn't work, find your project:
\`\`\`bash
cd ~
find . -name "sui-lotto-game" -type d 2>/dev/null | head -1
\`\`\`

## Step 3: Run the reset script

\`\`\`bash
chmod +x FULL_RESET.sh
./FULL_RESET.sh
\`\`\`

## Step 4: Start the dev server

\`\`\`bash
npm run dev
\`\`\`

## Alternative: Manual Reset

If the script doesn't work, run these commands one by one:

\`\`\`bash
# 1. Clean everything
rm -rf .next node_modules/.cache .turbo

# 2. Reinstall
npm install

# 3. Start dev server
npm run dev
\`\`\`

Your app should now load at http://localhost:3000
