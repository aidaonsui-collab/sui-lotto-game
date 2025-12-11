"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Gift, Coins, Users } from "lucide-react"

export function StatsPanel() {
  console.log("[v0] ===== STATS PANEL RENDERING =====")

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg">Live Game Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Jackpot Pool</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">1.1630 SUI</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Mystery Box</p>
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">0.0005 SUI</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Current Pool</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">0.0000 SUI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Players</p>
            </div>
            <p className="text-xl font-bold">1</p>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Round #</p>
            <p className="text-xl font-bold">17</p>
          </div>
        </div>

        <div className="pt-2 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Status: <span className="font-semibold text-yellow-600">Waiting for Round</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
