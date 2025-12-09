# Quick Start Guide

## 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

## 2. Set Up Environment Variables
Create a `.env.local` file in the root directory:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Then edit `.env.local` and add your deployed contract addresses:
- `NEXT_PUBLIC_PACKAGE_ID` - Your deployed smart contract package ID
- `NEXT_PUBLIC_GAME_STATE_ID` - Your game state object ID

## 3. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`

## 4. Open Your Browser
Visit [http://localhost:3000](http://localhost:3000) to see The Playground!

## What You Should See

You should see:
- **Header** with "The Playground" title and Connect Wallet button
- **Jackpot Display** showing the current jackpot amount
- **Tabs** for "Play Game" and "Leaderboard"
- **Game Board** with 25 numbered tiles to select
- **Bet Amount** selector
- **Start Game** button (requires wallet connection)

## Connecting Your Wallet

1. Click "Connect Wallet" button in the header
2. Choose either Slush Wallet or Phantom Wallet
3. Approve the connection in your wallet extension
4. Your wallet address will appear in the header

## Playing the Game

1. Connect your wallet
2. Select your lucky tiles (click to select/deselect)
3. Set your bet amount (minimum 0.05 SUI)
4. Click "Start Game"
5. Wait for the 60-second round to complete
6. If you win, funds are automatically sent to your wallet!

## Troubleshooting

### "Cannot see the game interface"
- Make sure `npm run dev` is running
- Check your browser console for errors (F12)
- Verify `.env.local` has been created

### "Connect Wallet button doesn't work"
- Install Slush or Phantom wallet extension
- Make sure the extension is unlocked
- Try refreshing the page

### "Game won't start"
- Verify your wallet is connected (address shown in header)
- Ensure you have selected at least one tile
- Check you have sufficient SUI balance (minimum 0.05 SUI)

## Need Help?

Check the full deployment guide in `COMPLETE_SETUP_GUIDE.md` for detailed instructions.
