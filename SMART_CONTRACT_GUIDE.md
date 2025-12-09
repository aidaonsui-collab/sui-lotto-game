# Smart Contract Development Guide

## Understanding the Contract Structure

The Playground smart contract is written in Move language for the Sui blockchain. Here's what each part does:

### Key Components

#### 1. GamePool (Shared Object)
Stores all game funds and state:
- `balance`: Prize pool for winners
- `jackpot_balance`: Accumulates 6% from each game
- `lucky_box_balance`: Accumulates 1% from each game
- `total_games`: Game counter
- `total_players`: Player counter

#### 2. PlayerStats (Owned Object)
Tracks individual player statistics:
- `total_plays`: Games played
- `total_wins`: Games won
- `total_losses`: Games lost
- `consecutive_wins`: Current win streak
- `total_pnl`: Profit and loss

#### 3. Game Functions

**play_game()**
- Main game entry point
- Validates bet amount (min 0.05 SUI)
- Distributes funds:
  - 90% to prize pool
  - 6% to jackpot
  - 3% to developer
  - 1% to lucky box
- Determines winner using random number
- Pays out 1.5x bet amount to winners

**claim_jackpot()**
- Transfers entire jackpot balance to winner
- Called by system 1-2 times per day
- Emits JackpotWon event

**claim_lucky_box()**
- Rewards players with 10 consecutive wins
- Transfers lucky box balance
- Emits LuckyBoxClaimed event

### Distribution Breakdown

For every 1 SUI bet:
\`\`\`
Player Bet: 1.00 SUI
├─ Prize Pool (90%): 0.90 SUI → Winner gets 1.35 SUI (1.5x multiplier)
├─ Jackpot (6%): 0.06 SUI → Accumulates for random drawing
├─ Developer (3%): 0.03 SUI → Sent to developer wallet
└─ Lucky Box (1%): 0.01 SUI → Accumulates for 10-win streaks
\`\`\`

## Modifying the Contract

### Change Payout Percentages

Edit the percentages in `play_game()` function:

```move
// Current: 90% to prize pool
let prize_amount = (bet_amount * 90) / 100;

// To change to 85%:
let prize_amount = (bet_amount * 85) / 100;

// Adjust other percentages accordingly
// Total must equal 100%
