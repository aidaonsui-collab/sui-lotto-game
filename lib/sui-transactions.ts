// NEW FILE - Force Vercel to rebuild by creating a new file path
// Version: 3.1.0 - Module name: lotto_game (NOT playground)
import { Transaction } from "@mysten/sui/transactions"
import { CONTRACT_CONFIG, suiToMist } from "./contract-config"

console.log("[v0] sui-transactions.ts loaded - Version 3.1.0")
console.log("[v0] Using MODULE NAME: lotto_game (not playground)")
console.log("[v0] Package ID:", CONTRACT_CONFIG.PACKAGE_ID)

const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME || "lotto_game"
console.log("[v0] MODULE_NAME from env or default:", MODULE_NAME)

/**
 * Create a transaction to start a new game round
 */
export function createStartRoundTransaction(gameStateId: string) {
  console.log("[v0] createStartRoundTransaction called")
  const tx = new Transaction()

  const target = `${CONTRACT_CONFIG.PACKAGE_ID}::${MODULE_NAME}::start_round`
  console.log("[v0] Transaction target:", target)

  tx.moveCall({
    target,
    arguments: [
      tx.object(gameStateId),
      tx.object("0x6"), // Clock object
    ],
  })

  return tx
}

/**
 * Create a transaction to end the current game round
 */
export function createEndRoundTransaction(gameStateId: string) {
  console.log("[v0] createEndRoundTransaction called")
  const tx = new Transaction()

  const target = `${CONTRACT_CONFIG.PACKAGE_ID}::${MODULE_NAME}::end_round`
  console.log("[v0] Transaction target:", target)

  tx.moveCall({
    target,
    arguments: [
      tx.object(gameStateId),
      tx.object("0x6"), // Clock object
      tx.object("0x8"), // Random object
    ],
  })

  return tx
}

/**
 * Create a transaction to play the game
 */
export function createPlayGameTransaction(gameStateId: string, betAmount: number, selectedTiles: number[]) {
  console.log("[v0] createPlayGameTransaction called")
  console.log("[v0] betAmount (ignored - calculated from tiles):", betAmount)
  console.log("[v0] selectedTiles:", selectedTiles, "count:", selectedTiles.length)

  const tx = new Transaction()

  const BET_PER_TILE = 0.05 // SUI
  const calculatedBet = BET_PER_TILE * selectedTiles.length
  console.log("[v0] Calculated bet (0.05 SUI x", selectedTiles.length, "tiles):", calculatedBet, "SUI")

  // Convert SUI to MIST
  const betInMist = suiToMist(calculatedBet)
  console.log("[v0] betInMist:", betInMist)

  // Split coin for the bet
  const [coin] = tx.splitCoins(tx.gas, [betInMist])

  const zeroIndexedTiles = selectedTiles.map((tile) => tile - 1)
  console.log("[v0] Converting tiles from 1-indexed to 0-indexed:", selectedTiles, "->", zeroIndexedTiles)

  const target = `${CONTRACT_CONFIG.PACKAGE_ID}::${MODULE_NAME}::play_game`
  console.log("[v0] Transaction target:", target)

  tx.moveCall({
    target,
    arguments: [
      tx.object(gameStateId),
      coin,
      tx.pure.vector("u8", zeroIndexedTiles),
      tx.object("0x6"), // Clock object
    ],
  })

  return tx
}

/**
 * Create a transaction to claim prize
 */
export function createClaimPrizeTransaction(gameStateId: string) {
  console.log("[v0] createClaimPrizeTransaction called")
  const tx = new Transaction()

  const target = `${CONTRACT_CONFIG.PACKAGE_ID}::${MODULE_NAME}::claim_prize`
  console.log("[v0] Transaction target:", target)

  tx.moveCall({
    target,
    arguments: [tx.object(gameStateId)],
  })

  return tx
}

/**
 * Create a transaction to add funds to the pool
 */
export function createAddFundsTransaction(poolId: string, amount: number) {
  console.log("[v0] createAddFundsTransaction called")
  console.log("[v0] amount:", amount)

  const tx = new Transaction()

  const amountInMist = suiToMist(amount)
  console.log("[v0] amountInMist:", amountInMist)

  const [coin] = tx.splitCoins(tx.gas, [amountInMist])

  const target = `${CONTRACT_CONFIG.PACKAGE_ID}::${MODULE_NAME}::add_funds`
  console.log("[v0] Transaction target:", target)

  tx.moveCall({
    target,
    arguments: [tx.object(poolId), coin],
  })

  return tx
}

/**
 * Create a transaction to withdraw funds from the pool
 */
export function createWithdrawFundsTransaction(poolId: string, amount: number) {
  console.log("[v0] createWithdrawFundsTransaction called")
  console.log("[v0] amount:", amount)

  const tx = new Transaction()

  const amountInMist = suiToMist(amount)
  console.log("[v0] amountInMist:", amountInMist)

  const target = `${CONTRACT_CONFIG.PACKAGE_ID}::${MODULE_NAME}::withdraw_funds`
  console.log("[v0] Transaction target:", target)

  tx.moveCall({
    target,
    arguments: [tx.object(poolId), tx.pure.u64(amountInMist)],
  })

  return tx
}
