# How to Start the Dev Server Correctly

## The Problem
Next.js needs time to build the manifest files. Accessing the site too early causes errors.

## The Solution

### Step 1: Stop Any Running Servers
\`\`\`bash
# Press Ctrl+C to stop the current server
# Or run this to kill all Next.js processes:
pkill -f next
\`\`\`

### Step 2: Start Fresh
\`\`\`bash
chmod +x start-dev.sh
./start-dev.sh
\`\`\`

### Step 3: WAIT for Build to Complete
**DO NOT open your browser until you see:**
\`\`\`
✓ Compiled /page in XXXms
\`\`\`
or
\`\`\`
○ Compiling / ...
✓ Compiled / in XXXs
\`\`\`

This usually takes 10-30 seconds on first load.

### Step 4: Open Browser
Only after seeing the compilation success message:
1. Open http://localhost:3000
2. Do a hard refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)

### Step 5: Check Console
You should see your actual contract addresses:
\`\`\`
packageId: '0x41fa1afb9f46d2f76944799331348465fbb84d75a37841687105fc6693183ff6'
gameStateId: '0x4b1597293e5724f4443959e1a8c709c519d615ae1912538e4a1ef00b64fa9997'
\`\`\`

## If It Still Doesn't Work

The browser cache might still have old JavaScript. Try:
1. Open DevTools (F12 or Cmd+Option+I)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

Or use incognito/private mode to bypass all caching.
