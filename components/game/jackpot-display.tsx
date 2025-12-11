"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useSuiClient } from "@mysten/dapp-kit"
import { CONTRACT_CONFIG, mistToSui, isContractConfigured } from "@/lib/contract-config"

export function JackpotDisplay() {
  const client = useSuiClient()
  const [jackpotAmount, setJackpotAmount] = useState(0)

  console.log("[v0] JackpotDisplay rendering - client exists:", !!client)

  useEffect(() => {
    console.log("[v0] JackpotDisplay useEffect - isConfigured:", isContractConfigured())

    if (!client || !isContractConfigured()) {
      console.log("[v0] JackpotDisplay - No client or not configured")
      return
    }

    async function fetchJackpot() {
      try {
        const gameState = await client.getObject({
          id: CONTRACT_CONFIG.GAME_STATE_ID,
          options: { showContent: true },
        })

        if (gameState.data?.content && gameState.data.content.dataType === "moveObject") {
          const fields = gameState.data.content.fields as any

          const parseBalance = (balanceField: any): string => {
            if (!balanceField) return "0"
            if (typeof balanceField === "number" || typeof balanceField === "string") {
              return String(balanceField)
            }
            if (balanceField.fields?.value) return String(balanceField.fields.value)
            if (balanceField.value) return String(balanceField.value)
            return "0"
          }

          const jackpotValue = parseBalance(fields.jackpot_pool)
          const jackpot = mistToSui(BigInt(jackpotValue.trim()))
          setJackpotAmount(jackpot)
          console.log("[v0] JackpotDisplay - Fetched:", jackpot)
        }
      } catch (error) {
        console.error("[v0] JackpotDisplay - Error fetching:", error)
      }
    }

    fetchJackpot()
    const interval = setInterval(fetchJackpot, 3000)
    return () => clearInterval(interval)
  }, [client])

  return (
    <Card className="border-2 border-warning bg-gradient-to-r from-warning/10 via-warning/5 to-warning/10 overflow-hidden">
      <CardContent className="py-6 relative">
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Trophy className="h-12 w-12 text-warning" />
          </motion.div>

          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-warning animate-pulse" />
              JACKPOT
              <Zap className="h-4 w-4 text-warning animate-pulse" />
            </p>
            <div className="relative">
              <p className="text-4xl md:text-5xl font-black text-warning drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]">
                {jackpotAmount.toFixed(4)} SUI
              </p>
            </div>
          </div>

          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          >
            <Trophy className="h-12 w-12 text-warning" />
          </motion.div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-3">6% of each round pool</p>
      </CardContent>
    </Card>
  )
}
