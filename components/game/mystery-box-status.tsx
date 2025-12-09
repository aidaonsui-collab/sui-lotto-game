"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Gift, Clock, TrendingUp, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { CONTRACT_CONFIG, mistToSui, isContractConfigured, type ContractConfig } from "@/lib/contract-config"
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit"

interface MysteryBoxData {
  accumulated: number
  lastWinner: string | null
  lastWinTime: number | null
}

export function MysteryBoxStatus() {
  const [boxData, setBoxData] = useState<MysteryBoxData>({
    accumulated: 0,
    lastWinner: null,
    lastWinTime: null,
  })
  const client = useSuiClient()
  const account = useCurrentAccount()

  useEffect(() => {
    async function fetchMysteryBoxData() {
      if (!account || !isContractConfigured()) {
        return
      }

      try {
        const gameState = await client.getObject({
          id: (CONTRACT_CONFIG as ContractConfig).GAME_STATE_ID,
          options: { showContent: true },
        })

        if (gameState.data?.content && "fields" in gameState.data.content) {
          const fields = gameState.data.content.fields as any

          setBoxData({
            accumulated: mistToSui(BigInt(fields.lucky_box_pool || 0)),
            lastWinner: fields.last_lucky_box_winner || null,
            lastWinTime: fields.last_lucky_box_time ? Number(fields.last_lucky_box_time) : null,
          })
        }
      } catch (error) {
        console.error("Error fetching mystery box data:", error)
      }
    }

    fetchMysteryBoxData()
    const interval = setInterval(fetchMysteryBoxData, 10000)

    return () => clearInterval(interval)
  }, [client, account])

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

  if (!isContractConfigured()) {
    return (
      <Card className="border-2 border-secondary/30 bg-gradient-to-br from-card to-secondary/5 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            <h3 className="text-xl font-bold">Mystery Box</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Contract not configured. Please deploy your smart contract and update the configuration.
          </p>
        </div>
      </Card>
    )
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
                <p className="text-xs text-muted-foreground">~{(boxData.accumulated * 2.5).toFixed(2)} USD</p>
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
