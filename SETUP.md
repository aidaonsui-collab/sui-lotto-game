# Setup Instructions

## Fix Missing Dependencies

If you're getting "Module not found" errors for @radix-ui packages, follow these steps:

### Quick Fix (Option 1)
Run the provided script:
\`\`\`bash
bash fix-install.sh
\`\`\`

### Manual Steps (Option 2)
Run these commands one by one:

1. Stop the dev server (press `Ctrl+C` if running)

2. Remove node_modules and lock file:
\`\`\`bash
rm -rf node_modules package-lock.json
\`\`\`

3. Clear npm cache:
\`\`\`bash
npm cache clean --force
\`\`\`

4. Reinstall everything:
\`\`\`bash
npm install
\`\`\`

5. Start the dev server:
\`\`\`bash
npm run dev
\`\`\`

### What This Does
- Removes corrupted node_modules folder
- Clears npm's cache
- Reinstalls all packages fresh from package.json
- Ensures all @radix-ui packages are properly installed

### Expected Result
After running these commands, you should see:
- No "Module not found" errors
- Dev server running at http://localhost:3000
- All components loading correctly

### Environment Setup
Make sure to create a `.env.local` file with your Sui contract details:

\`\`\`env
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_PACKAGE_ID=your_package_id_here
