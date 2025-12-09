# Mainnet Deployment Checklist for The Playground

Congratulations on deploying to mainnet! Follow this checklist to ensure everything is configured correctly.

## Step 1: Update Environment Variables

After deploying your contract, you should have received output like this:

\`\`\`bash
Published Objects:
- PackageID: 0xabcd1234...
- GameState Object: 0xefgh5678...
\`\`\`

Update your `.env.local` file with these values:

\`\`\`bash
# Create .env.local if it doesn't exist
cp .env.example .env.local

# Edit .env.local and add:
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_PACKAGE_ID=0xYOUR_ACTUAL_PACKAGE_ID
NEXT_PUBLIC_GAME_STATE_ID=0xYOUR_ACTUAL_GAME_STATE_ID
\`\`\`

## Step 2: Verify Contract Configuration

Run this command to check your configuration:

\`\`\`bash
npm run dev
\`\`\`

Open the browser console (F12) and check for any configuration errors. The app will display warnings if contract IDs are not set properly.

## Step 3: Test Game Functions

Before going live, test all game functions:

1. **Connect Wallet** - Test with both Slush Wallet and Phantom Wallet
2. **Place Bet** - Try minimum bet (0.05 SUI) and higher amounts
3. **Select Tiles** - Test selecting different tile combinations
4. **Wait for Round** - Ensure 60-second timer works correctly
5. **Check Payouts** - Verify winners receive correct amounts
6. **View Leaderboard** - Check that stats are tracking correctly

## Step 4: Monitor Initial Transactions

After launch, monitor the first few transactions:

\`\`\`bash
# Check game state
sui client object $NEXT_PUBLIC_GAME_STATE_ID

# View recent transactions
sui client call --package $NEXT_PUBLIC_PACKAGE_ID --module playground --function get_game_stats
\`\`\`

## Step 5: Verify Developer Payouts

Check that the 3% developer fee is being sent to your wallet:

\`\`\`bash
# Check your wallet balance
sui client balance 0x92a32ac7fd525f8bd37ed359423b8d7d858cad26224854dfbff1914b75ee658b
\`\`\`

## Step 6: Deploy Frontend to Vercel

Once everything is tested locally:

\`\`\`bash
# Commit your changes
git add .env.local lib/contract-config.ts
git commit -m "Add mainnet contract configuration"
git push origin main

# Deploy to Vercel (if not already set up)
vercel deploy --prod
\`\`\`

## Step 7: Set Environment Variables in Vercel

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `NEXT_PUBLIC_NETWORK` = `mainnet`
   - `NEXT_PUBLIC_PACKAGE_ID` = `your_package_id`
   - `NEXT_PUBLIC_GAME_STATE_ID` = `your_game_state_id`
4. Redeploy

## Step 8: Final Checks

- [ ] Contract IDs are correctly set in `.env.local`
- [ ] All game functions work in local testing
- [ ] Wallet connections work with Slush and Phantom
- [ ] Payouts are distributed correctly (90/6/3/1 split)
- [ ] Developer wallet receives 3% fee
- [ ] Leaderboard updates properly
- [ ] Jackpot accumulates and can be claimed
- [ ] Lucky Box appears after 10 consecutive wins
- [ ] Light/dark mode toggle works
- [ ] Environment variables are set in Vercel
- [ ] Production deployment is live and tested

## Troubleshooting

**Issue: "Contract not found" error**
- Solution: Verify `NEXT_PUBLIC_PACKAGE_ID` is correct

**Issue: "Game state not found" error**
- Solution: Verify `NEXT_PUBLIC_GAME_STATE_ID` is correct

**Issue: Transactions failing**
- Solution: Ensure you're on the correct network (mainnet)
- Check that you have enough SUI for gas fees

**Issue: Developer payouts not received**
- Solution: Verify the developer address in the contract matches your wallet

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure you're using the latest version of the Sui CLI
4. Test on testnet first before mainnet if issues persist

## Next Steps

Once deployed and tested:
1. Share your game link
2. Monitor player activity and jackpot growth
3. Track leaderboard for top players
4. Collect developer fees regularly
5. Consider adding more features based on player feedback

Your game is live! Good luck with The Playground!
