"use client"

import { useState, useEffect } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TileGrid } from "./tile-grid"
import { GameTimer } from "./game-timer"
import { BetAmount } from "./bet-amount"
import { LuckyBoxModal } from "./lucky-box-modal"
import { toast } from "sonner"
import { Coins, Play, RotateCcw } from "lucide-react"

const GAME_DURATION = 60
const MIN_BET = 0.05

export function GameBoard() {
  const currentAccount = useCurrentAccount()
  const [selectedTiles, setSelectedTiles] = useState<number[]>([])
  const [betAmount, setBetAmount] = useState(MIN_BET)
  const [isPlaying, setIsPlaying] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [showLuckyBox, setShowLuckyBox] = useState(false)
  const [balance, setBalance] = useState(10)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleGameEnd()
            return GAME_DURATION
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isPlaying, timeRemaining])

  const handleTileSelect = (tileNumber: number) => {
    setSelectedTiles((prev) => {
      if (prev.includes(tileNumber)) {
        return prev.filter((t) => t !== tileNumber)
      }
      return [...prev, tileNumber]
    })
  }

  const handleStartGame = () => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first!")
      return
    }

    if (betAmount < MIN_BET) {
      toast.error(`Minimum bet is ${MIN_BET} SUI`)
      return
    }

    if (selectedTiles.length === 0) {
      toast.error("Select at least one tile!")
      return
    }

    setIsPlaying(true)
    setTimeRemaining(GAME_DURATION)
    toast.success("Game started! Good luck!")
  }

  const handleGameEnd = () => {
    setIsPlaying(false)

    const isWinner = Math.random() > 0.5

    if (isWinner) {
      const winAmount = betAmount * 1.5
      toast.success(`You won ${winAmount.toFixed(2)} SUI!`, {
        description: "Winnings sent to your wallet",
      })

      if (Math.random() > 0.95) {
        setShowLuckyBox(true)
      }
    } else {
      toast.error("Better luck next time!")
    }

    setSelectedTiles([])
    setTimeRemaining(GAME_DURATION)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setSelectedTiles([])
    setTimeRemaining(GAME_DURATION)
    toast.info("Game reset. Select your tiles and start again!")
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">Select Your Numbers</CardTitle>
                <CardDescription>Choose your lucky tiles and place your bet</CardDescription>
              </div>
              <div className="flex-shrink-0">
                <GameTimer timeRemaining={timeRemaining} isPlaying={isPlaying} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <TileGrid selectedTiles={selectedTiles} onTileSelect={handleTileSelect} isPlaying={true} />

            <div className="grid md:grid-cols-2 gap-4">
              <BetAmount betAmount={betAmount} onBetChange={setBetAmount} minBet={MIN_BET} disabled={isPlaying} />

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Selected Tiles:</span>
                      <span className="font-bold">{selectedTiles.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Your Balance:</span>
                      <span className="font-bold flex items-center gap-1">
                        <Coins className="h-4 w-4 text-primary" />
                        {balance.toFixed(2)} SUI
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Potential Win:</span>
                      <span className="font-bold text-success">{(betAmount * 1.5).toFixed(2)} SUI</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              {!isPlaying ? (
                <Button
                  onClick={handleStartGame}
                  size="lg"
                  className="flex-1 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  disabled={!currentAccount || selectedTiles.length === 0}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Game
                </Button>
              ) : (
                <Button
                  onClick={handleReset}
                  size="lg"
                  variant="outline"
                  className="flex-1 text-lg font-bold bg-transparent"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              )}
            </div>

            {!currentAccount && (
              <p className="text-center text-sm text-muted-foreground">Connect your wallet to start playing</p>
            )}
          </CardContent>
        </Card>
      </div>

      <LuckyBoxModal
        open={showLuckyBox}
        onOpenChange={setShowLuckyBox}
        onCollect={() => {
          toast.success("Lucky Box collected! +5 SUI")
          setShowLuckyBox(false)
        }}
      />
    </>
  )
}
