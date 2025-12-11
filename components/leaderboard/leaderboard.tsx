"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Info } from "lucide-react"

export function Leaderboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Top Players
          </CardTitle>
          <CardDescription>Rankings based on profit and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Leaderboard tracking is coming soon. Player statistics will be calculated from on-chain events to show top
              performers by wins, profit, and win rate.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
