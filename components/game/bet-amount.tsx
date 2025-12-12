"use client"

import { Coins } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function BetAmount({
  betAmount,
  minBet,
  tileCount,
  costPerTile,
}: {
  betAmount: number
  minBet: number
  tileCount: number
  costPerTile: number
}) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Coins className="h-4 w-4 text-primary" />
            Total Bet Amount
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{betAmount.toFixed(2)} SUI</div>
          </div>

          <div className="space-y-2 pt-4 border-t border-primary/10">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cost per tile:</span>
              <span className="font-semibold">{costPerTile.toFixed(2)} SUI</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tiles selected:</span>
              <span className="font-semibold">{tileCount}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t">
              <span className="text-foreground">Your bet:</span>
              <span className="text-primary">{betAmount.toFixed(2)} SUI</span>
            </div>
          </div>

          {/* Show helpful message about how betting works */}
          <p className="text-xs text-center text-muted-foreground pt-2 border-t">
            {tileCount === 0
              ? `Select tiles to place bet (${costPerTile.toFixed(2)} SUI each)`
              : `${costPerTile.toFixed(2)} SUI × ${tileCount} tile${tileCount > 1 ? "s" : ""} = ${betAmount.toFixed(2)} SUI`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
