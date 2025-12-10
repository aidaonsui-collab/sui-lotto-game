// Sui blockchain utility functions for The Playground
// v2.0.3 - Cache-busted module name fix

import { Transaction } from "@mysten/sui/transactions"
import { CONTRACT_CONFIG, suiToMist, APP_VERSION } from "./contract-config"

console.log("[v0] sui-utils.ts loaded - version:", APP_VERSION)
console.log("[v0] Using module: lotto_game (NOT playground)")
console.log("[v0] Package ID:", CONTRACT_CONFIG.PACKAGE_ID)

/**
 * Create a transaction to start a new game round
 */
export function createStartRoundTransaction(gameStateId: string) {
  const tx = new Transaction()

  const target = `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::start_round`
  console.log("[v0] Creating start_round transaction with target:", target)

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
 * Create a transaction to play the game
 */
export function createPlayGameTransaction(gameStateId: string, betAmount: number, selectedTiles: number[]) {
  const tx = new Transaction()

  // Convert SUI to MIST
  const betInMist = suiToMist(betAmount)

  const target = `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::play_game`
  console.log("[v0] Creating play_game transaction with target:", target)
  console.log("[v0] Bet amount:", betAmount, "SUI (", betInMist.toString(), "MIST)")
  console.log("[v0] Selected tiles:", selectedTiles)

  // Split coin for the bet
  const [coin] = tx.splitCoins(tx.gas, [betInMist])

  tx.moveCall({
    target,
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

  const target = `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::end_round`
  console.log("[v0] Creating end_round transaction with target:", target)

  tx.moveCall({
    target,
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

  const target = `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::claim_jackpot`
  console.log("[v0] Creating claim_jackpot transaction with target:", target)

  tx.moveCall({
    target,
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

  const target = `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::claim_lucky_box`
  console.log("[v0] Creating claim_lucky_box transaction with target:", target)

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
