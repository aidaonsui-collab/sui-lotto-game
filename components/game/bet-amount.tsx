"use client"

import { Coins } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface BetAmountProps {
  betAmount: number
  onBetChange: (amount: number) => void
  minBet: number
  disabled?: boolean
  selectedTiles: number // Added selectedTiles prop to show tile count
}

export function BetAmount({ betAmount, onBetChange, minBet, disabled, selectedTiles }: BetAmountProps) {
  const costPerTile = 0.05
  const totalCost = selectedTiles * costPerTile

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Coins className="h-4 w-4 text-primary" />
            Total Bet Amount
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{totalCost.toFixed(2)} SUI</div>
          </div>

          <div className="space-y-2 pt-4 border-t border-primary/10">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cost per tile:</span>
              <span className="font-semibold">{costPerTile.toFixed(2)} SUI</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tiles selected:</span>
              <span className="font-semibold">{selectedTiles}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t">
              <span className="text-foreground">Total cost:</span>
              <span className="text-primary">{totalCost.toFixed(2)} SUI</span>
            </div>
          </div>

          {selectedTiles === 0 && (
            <p className="text-xs text-center text-amber-600 dark:text-amber-400 font-medium">
              Select tiles to see total cost
            </p>
          )}
          {selectedTiles > 0 && (
            <p className="text-xs text-center text-muted-foreground">
              {costPerTile.toFixed(2)} SUI × {selectedTiles} tile{selectedTiles > 1 ? "s" : ""} = {totalCost.toFixed(2)}{" "}
              SUI
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
// Force rebuild: 2025-12-11 03:30:47
