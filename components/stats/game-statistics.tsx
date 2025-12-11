"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SuiClient } from "@mysten/sui/client"
import { CONTRACT_CONFIG, mistToSui, isContractConfigured } from "@/lib/contract-config"
import { TrendingUp, Trophy, Gift, Gamepad2, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface GameStats {
  totalVolumeSui: number
  totalVolumeUsd: number
  totalGamesPlayed: number
  totalJackpotWins: number
  totalMysteryBoxWins: number
  suiPrice: number
}

export function GameStatistics() {
  const [stats, setStats] = useState<GameStats>({
    totalVolumeSui: 0,
    totalVolumeUsd: 0,
    totalGamesPlayed: 0,
    totalJackpotWins: 0,
    totalMysteryBoxWins: 0,
    suiPrice: 0,
  })
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    const isConfigured = isContractConfigured()
    setConfigured(isConfigured)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      if (!configured) {
        setLoading(false)
        return
      }

      try {
        const client = new SuiClient({
          url:
            CONTRACT_CONFIG.NETWORK === "mainnet"
              ? "https://fullnode.mainnet.sui.io:443"
              : "https://fullnode.testnet.sui.io:443",
        })

        let suiPrice = 0
        try {
          const priceResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd")
          if (priceResponse.ok) {
            const priceData = await priceResponse.json()
            suiPrice = priceData.sui?.usd || 0
          }
        } catch (priceError) {
          console.log("[v0] Could not fetch SUI price, using 0")
        }

        console.log("[v0] Fetching game events to calculate statistics...")

        const gameEndedEvents = await client.queryEvents({
          query: {
            MoveEventType: `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::GameEnded`,
          },
          limit: 1000,
        })

        const jackpotEvents = await client.queryEvents({
          query: {
            MoveEventType: `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::JackpotWon`,
          },
          limit: 1000,
        })

        const luckyBoxEvents = await client.queryEvents({
          query: {
            MoveEventType: `${CONTRACT_CONFIG.PACKAGE_ID}::lotto_game::LuckyBoxWon`,
          },
          limit: 1000,
        })

        let totalVolumeMist = 0n
        const totalGamesPlayed = gameEndedEvents.data.length

        gameEndedEvents.data.forEach((event: any) => {
          const parsedData = event.parsedJson
          if (parsedData && parsedData.total_pool) {
            totalVolumeMist += BigInt(parsedData.total_pool)
          }
        })

        const totalVolumeSui = mistToSui(totalVolumeMist)
        const totalJackpotWins = jackpotEvents.data.length
        const totalMysteryBoxWins = luckyBoxEvents.data.length

        setStats({
          totalVolumeSui,
          totalVolumeUsd: totalVolumeSui * suiPrice,
          totalGamesPlayed,
          totalJackpotWins,
          totalMysteryBoxWins,
          suiPrice,
        })

        console.log("[v0] Updated stats from events:", {
          totalVolumeSui,
          totalGamesPlayed,
          totalJackpotWins,
          totalMysteryBoxWins,
        })
      } catch (error) {
        console.error("[v0] Error fetching game statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [configured])

  if (configured === null) {
    return (
      <Card className="border-2">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground">Checking configuration...</p>
        </CardContent>
      </Card>
    )
  }

  if (!configured) {
    return (
      <Card className="border-2 border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-yellow-800 dark:text-yellow-200">
            Contract not configured. Please deploy your smart contract and update the environment variables.
          </p>
        </CardContent>
      </Card>
    )
  }

  const statCards = [
    {
      title: "Total Volume",
      value: `${stats.totalVolumeSui.toLocaleString(undefined, { maximumFractionDigits: 2 })} SUI`,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      loading,
    },
    {
      title: "Volume (USD)",
      value: `$${stats.totalVolumeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      loading,
    },
    {
      title: "Games Played",
      value: stats.totalGamesPlayed.toLocaleString(),
      icon: Gamepad2,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      loading,
    },
    {
      title: "Jackpots Won",
      value: stats.totalJackpotWins.toLocaleString(),
      icon: Trophy,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      loading,
    },
    {
      title: "Mystery Boxes Won",
      value: stats.totalMysteryBoxWins.toLocaleString(),
      icon: Gift,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-50 dark:bg-pink-950/30",
      loading,
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Game Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className={cn("border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg", stat.bgColor)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ) : (
                <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {stats.suiPrice > 0 && (
        <p className="text-center text-sm text-muted-foreground mt-4">SUI Price: ${stats.suiPrice.toFixed(4)} USD</p>
      )}
    </div>
  )
}
