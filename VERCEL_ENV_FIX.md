# Vercel Environment Variables Fix

If your contract is configured locally but shows "Contract not configured" on Vercel, follow these steps:

## 1. Verify Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Make sure these variables are set for **Production**, **Preview**, and **Development**:

\`\`\`
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_PACKAGE_ID=0x41fa1afb9f46d2f76944799331348465fbb84d75a37841687105fc6693183ff6
NEXT_PUBLIC_GAME_STATE_ID=0x4b1597293e5724f4443959e1a8c709c519d615ae1912538e4a1ef00b64fa9997
\`\`\`

## 2. Clear Build Cache and Redeploy

After updating environment variables:

1. Go to **Settings** → **General**
2. Scroll to **Build & Development Settings**
3. Clear the build cache
4. Go to **Deployments**
5. Find the latest deployment
6. Click the three dots (**...**) → **Redeploy**
7. Check **Use existing Build Cache** should be **OFF**
8. Click **Redeploy**

## 3. Check Build Logs

After redeployment:

1. Go to the deployment
2. Click on **Build Logs**
3. Search for "NEXT_PUBLIC" to verify your environment variables are being loaded
4. You should see your contract addresses in the build output

## 4. Test in Production

1. Visit your deployed site
2. Open browser console (F12)
3. Check for any error messages
4. The statistics page should now load properly

## Common Issues

### Issue: Still showing "Contract not configured"

**Solution**: Make sure the environment variable names are EXACTLY:
- `NEXT_PUBLIC_PACKAGE_ID` (not NEXT_PUBLIC_PACKAGE or PACKAGE_ID)
- `NEXT_PUBLIC_GAME_STATE_ID` (not NEXT_PUBLIC_GAME_STATE or GAME_STATE_ID)

### Issue: Build succeeds but runtime error

**Solution**: Environment variables must start with `NEXT_PUBLIC_` to be available in the browser. Server-only variables won't work for client components.

### Issue: Works on preview but not production

**Solution**: Environment variables are separated by environment. Set them for all environments (Production, Preview, Development) in Vercel settings.
