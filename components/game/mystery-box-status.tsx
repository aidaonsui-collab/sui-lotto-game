"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Gift, Clock, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { CONTRACT_CONFIG, mistToSui, isContractConfigured } from "@/lib/contract-config"
import { useSuiClient } from "@mysten/dapp-kit"

interface MysteryBoxData {
  accumulated: number
  lastWinner: string | null
  lastWinTime: number | null
}

export function MysteryBoxStatus() {
  const client = useSuiClient()
  const [boxData, setBoxData] = useState<MysteryBoxData>({
    accumulated: 0,
    lastWinner: null,
    lastWinTime: null,
  })

  console.log("[v0] MysteryBoxStatus rendering - client exists:", !!client)

  useEffect(() => {
    console.log("[v0] MysteryBoxStatus useEffect - isConfigured:", isContractConfigured())

    if (!client || !isContractConfigured()) {
      console.log("[v0] MysteryBoxStatus - No client or not configured")
      return
    }

    async function fetchMysteryBoxData() {
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

          const luckyBoxValue = parseBalance(fields.lucky_box_pool)
          const luckyBox = mistToSui(BigInt(luckyBoxValue.trim()))

          setBoxData({
            accumulated: luckyBox,
            lastWinner: fields.last_lucky_box_winner || null,
            lastWinTime: fields.last_lucky_box_time ? Number(fields.last_lucky_box_time) : null,
          })

          console.log("[v0] MysteryBoxStatus - Fetched:", luckyBox)
        }
      } catch (error) {
        console.error("[v0] MysteryBoxStatus - Error fetching:", error)
      }
    }

    fetchMysteryBoxData()
    const interval = setInterval(fetchMysteryBoxData, 3000)
    return () => clearInterval(interval)
  }, [client])

  const formatTimeSince = (timestamp: number | null) => {
    if (!timestamp) return "Never"
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days} day${days > 1 ? "s" : ""} ago`
    }
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    }
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  }

  return (
    <Card className="border-2 border-secondary/30 bg-gradient-to-br from-card to-secondary/5 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Gift className="h-6 w-6 text-secondary" />
            </motion.div>
            <h3 className="text-xl font-bold">Mystery Box</h3>
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            className="bg-gradient-to-r from-secondary/20 to-accent/20 rounded-lg p-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Accumulated</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-secondary">{boxData.accumulated.toFixed(4)} SUI</p>
                <p className="text-xs text-muted-foreground">1% of each round pool</p>
              </div>
            </div>
          </motion.div>

          <div className="bg-secondary/10 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last Winner</span>
            </div>
            {boxData.lastWinner ? (
              <>
                <p className="text-xs font-mono text-foreground/80 truncate">{boxData.lastWinner}</p>
                <p className="text-xs text-muted-foreground">{formatTimeSince(boxData.lastWinTime)}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No winners yet</p>
            )}
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            Win 10 consecutive games to claim the Mystery Box!
          </div>
        </div>
      </div>
    </Card>
  )
}
