// The Playground - Sui Smart Contract Configuration
// Update these values after deploying your contract to mainnet/testnet

export interface ContractConfig {
  NETWORK: "mainnet" | "testnet" | "devnet"
  PACKAGE_ID: string
  GAME_STATE_ID: string
  DEVELOPER_ADDRESS: string
  MIN_BET_AMOUNT: number
  MIST_PER_SUI: number
  ROUND_DURATION_MS: number
  MAX_TILES: number
  WINNER_PERCENTAGE: number
  JACKPOT_PERCENTAGE: number
  DEVELOPER_PERCENTAGE: number
  LUCKY_BOX_PERCENTAGE: number
}

export const CONTRACT_CONFIG = {
  // Network Configuration
  NETWORK: (process.env.NEXT_PUBLIC_SUI_NETWORK || process.env.NEXT_PUBLIC_NETWORK || "testnet") as
    | "mainnet"
    | "testnet"
    | "devnet",

  // Contract Addresses (Update these after deployment)
  PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID || "0xYOUR_PACKAGE_ID_HERE",
  GAME_STATE_ID:
    process.env.NEXT_PUBLIC_GAME_OBJECT_ID ||
    process.env.NEXT_PUBLIC_GAME_STATE_ID ||
    "0xYOUR_GAME_STATE_OBJECT_ID_HERE",

  // Developer wallet address (hardcoded in smart contract)
  DEVELOPER_ADDRESS: "0x92a32ac7fd525f8bd37ed359423b8d7d858cad26224854dfbff1914b75ee658b",

  // Game Constants
  MIN_BET_AMOUNT: 0.05, // 0.05 SUI minimum
  MIST_PER_SUI: 1_000_000_000, // 1 SUI = 1 billion MIST
  ROUND_DURATION_MS: 60_000, // 60 seconds per game
  MAX_TILES: 25,

  // Payout Distribution
  WINNER_PERCENTAGE: 90,
  JACKPOT_PERCENTAGE: 6,
  DEVELOPER_PERCENTAGE: 3,
  LUCKY_BOX_PERCENTAGE: 1,
} satisfies ContractConfig

// Helper function to convert SUI to MIST
export function suiToMist(sui: number): bigint {
  return BigInt(Math.floor(sui * CONTRACT_CONFIG.MIST_PER_SUI))
}

// Helper function to convert MIST to SUI
export function mistToSui(mist: bigint): number {
  return Number(mist) / CONTRACT_CONFIG.MIST_PER_SUI
}

export function isContractConfigured(): boolean {
  const validPackage = !!CONTRACT_CONFIG.PACKAGE_ID && !CONTRACT_CONFIG.PACKAGE_ID.includes("YOUR_PACKAGE_ID")
  const validGameState = !!CONTRACT_CONFIG.GAME_STATE_ID && !CONTRACT_CONFIG.GAME_STATE_ID.includes("YOUR_GAME_STATE")

  return validPackage && validGameState
}

// Validate contract configuration
export function validateContractConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!CONTRACT_CONFIG.PACKAGE_ID || CONTRACT_CONFIG.PACKAGE_ID.includes("YOUR_PACKAGE_ID")) {
    errors.push("NEXT_PUBLIC_PACKAGE_ID is not set. Please update your .env.local file.")
  }

  if (!CONTRACT_CONFIG.GAME_STATE_ID || CONTRACT_CONFIG.GAME_STATE_ID.includes("YOUR_GAME_STATE")) {
    errors.push(
      "NEXT_PUBLIC_GAME_STATE_ID or NEXT_PUBLIC_GAME_OBJECT_ID is not set. Please update your .env.local file.",
    )
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
