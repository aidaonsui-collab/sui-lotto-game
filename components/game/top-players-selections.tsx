"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, TrendingUp, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface PlayerSelection {
  address: string
  selectedTiles: number[]
  betAmount: number
  timestamp: number
}

const MOCK_TOP_PLAYERS: PlayerSelection[] = [
  {
    address: "0x1234...5678",
    selectedTiles: [3, 7, 12, 18, 21],
    betAmount: 100,
    timestamp: Date.now() - 60000,
  },
  {
    address: "0xabcd...efgh",
    selectedTiles: [2, 9, 14, 19, 23],
    betAmount: 250,
    timestamp: Date.now() - 120000,
  },
  {
    address: "0x9876...5432",
    selectedTiles: [5, 11, 15, 20, 25],
    betAmount: 150,
    timestamp: Date.now() - 180000,
  },
  {
    address: "0xfedc...ba98",
    selectedTiles: [1, 8, 13, 17, 24],
    betAmount: 200,
    timestamp: Date.now() - 240000,
  },
  {
    address: "0x5678...1234",
    selectedTiles: [4, 10, 16, 22, 6],
    betAmount: 175,
    timestamp: Date.now() - 300000,
  },
]

export function TopPlayersSelections() {
  const [topPlayers, setTopPlayers] = useState<PlayerSelection[]>([])
  const { toast } = useToast()

  useEffect(() => {
    setTopPlayers(MOCK_TOP_PLAYERS)

    const interval = setInterval(() => {
      // In production, fetch latest top players from contract
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const copySelection = (tiles: number[]) => {
    const tilesText = tiles.join(", ")
    navigator.clipboard.writeText(tilesText)
    toast({
      title: "Selection Copied!",
      description: `Copied tiles: ${tilesText}`,
    })
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Top Players' Selections</h2>
        <Badge variant="secondary" className="ml-auto">
          <TrendingUp className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </div>

      <p className="text-muted-foreground mb-6">
        See what tiles the top 5 players are betting on and copy their winning strategies!
      </p>

      <div className="grid gap-4">
        {topPlayers.map((player, index) => (
          <motion.div
            key={player.address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge
                        variant={index === 0 ? "default" : "secondary"}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center p-0",
                          index === 0 && "bg-gradient-to-br from-warning to-warning/70",
                        )}
                      >
                        #{index + 1}
                      </Badge>
                      <span className="font-mono">{player.address}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-3">
                      <span className="text-success font-semibold">{player.betAmount} SUI</span>
                      <span className="text-muted-foreground text-xs">{formatTimeAgo(player.timestamp)}</span>
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copySelection(player.selectedTiles)}
                    className="shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {player.selectedTiles.map((tile, tileIndex) => (
                    <motion.div
                      key={tile}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + tileIndex * 0.05 }}
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center font-bold text-white shadow-md hover:shadow-lg transition-shadow"
                    >
                      {tile}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-muted/50 border-dashed">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Data updates every 30 seconds. Top players are ranked by bet amount and recent wins.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
