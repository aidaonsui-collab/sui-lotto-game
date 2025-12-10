// Sui blockchain utility functions for The Playground

import { Transaction } from "@mysten/sui/transactions"
import { CONTRACT_CONFIG, suiToMist } from "./contract-config"

/**
 * Create a transaction to start a new game round
 */
export function createStartRoundTransaction(gameStateId: string) {
  const tx = new Transaction()

  tx.moveCall({
    target: `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::start_round`,
    arguments: [
      tx.object(gameStateId),
      tx.object("0x6"), // Clock object
    ],
  })

  return tx
}

/**
 * Create a transaction to play the game
 */
export function createPlayGameTransaction(gameStateId: string, betAmount: number, selectedTiles: number[]) {
  const tx = new Transaction()

  // Convert SUI to MIST
  const betInMist = suiToMist(betAmount)

  // Split coin for the bet
  const [coin] = tx.splitCoins(tx.gas, [betInMist])

  tx.moveCall({
    target: `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::play_game`,
    arguments: [
      tx.object(gameStateId),
      coin,
      tx.pure.vector("u8", selectedTiles),
      tx.object("0x6"), // Clock object
    ],
  })

  return tx
}

/**
 * Create a transaction to end the current round
 */
export function createEndRoundTransaction(gameStateId: string, randomObjectId: string) {
  const tx = new Transaction()

  tx.moveCall({
    target: `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::end_round`,
    arguments: [
      tx.object(gameStateId),
      tx.object(randomObjectId), // Random object
      tx.object("0x6"), // Clock object
    ],
  })

  return tx
}

/**
 * Create a transaction to claim jackpot
 */
export function createClaimJackpotTransaction(gameStateId: string, randomObjectId: string) {
  const tx = new Transaction()

  tx.moveCall({
    target: `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::claim_jackpot`,
    arguments: [
      tx.object(gameStateId),
      tx.object(randomObjectId), // Random object
      tx.object("0x6"), // Clock object
    ],
  })

  return tx
}

/**
 * Create a transaction to claim lucky box
 */
export function createClaimLuckyBoxTransaction(gameStateId: string) {
  const tx = new Transaction()

  tx.moveCall({
    target: `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::claim_lucky_box`,
    arguments: [
      tx.object(gameStateId),
      tx.object("0x6"), // Clock object
    ],
  })

  return tx
}

/**
 * Format wallet address for display
 */
export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Format SUI amount for display
 */
export function formatSuiAmount(amount: number | bigint): string {
  const sui = typeof amount === "bigint" ? Number(amount) / CONTRACT_CONFIG.MIST_PER_SUI : amount
  return sui.toFixed(3)
}
