"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BetAmountProps {
  betAmount: number
  onBetChange: (amount: number) => void
  minBet: number
  disabled?: boolean
}

export function BetAmount({ betAmount, onBetChange, minBet, disabled }: BetAmountProps) {
  const handleIncrement = () => {
    onBetChange(betAmount + 0.05)
  }

  const handleDecrement = () => {
    if (betAmount > minBet) {
      onBetChange(Math.max(minBet, betAmount - 0.05))
    }
  }

  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <Label htmlFor="bet-amount" className="text-sm font-medium">
          Bet Amount (SUI)
        </Label>
        <div className="flex items-center gap-2 mt-2">
          <Button size="icon" variant="outline" onClick={handleDecrement} disabled={disabled || betAmount <= minBet}>
            <Minus className="h-4 w-4" />
          </Button>

          <Input
            id="bet-amount"
            type="number"
            value={betAmount.toFixed(2)}
            onChange={(e) => {
              const value = Number.parseFloat(e.target.value)
              if (!isNaN(value) && value >= minBet) {
                onBetChange(value)
              }
            }}
            step="0.05"
            min={minBet}
            disabled={disabled}
            className="text-center font-bold text-lg"
          />

          <Button size="icon" variant="outline" onClick={handleIncrement} disabled={disabled}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Minimum bet: {minBet} SUI</p>
      </CardContent>
    </Card>
  )
}
