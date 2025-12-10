"use client"

import { useState, useEffect } from "react"
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TileGrid } from "./tile-grid"
import { GameTimer } from "./game-timer"
import { BetAmount } from "./bet-amount"
import { LuckyBoxModal } from "./lucky-box-modal"
import { toast } from "sonner"
import { Coins, Play, RotateCcw, Zap } from "lucide-react"
import { createPlayGameTransaction, createStartRoundTransaction } from "@/lib/sui-transactions"
import { CONTRACT_CONFIG, mistToSui, isContractConfigured } from "@/lib/contract-config"

const GAME_DURATION = 60
const MIN_BET = 0.05
const APP_VERSION = "v3.1.0-start-round-fix"

export function GameBoard() {
  const currentAccount = useCurrentAccount()
  const client = useSuiClient()
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()

  const [selectedTiles, setSelectedTiles] = useState<number[]>([])
  const [betAmount, setBetAmount] = useState(MIN_BET)
  const [gameStarted, setGameStarted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [showLuckyBox, setShowLuckyBox] = useState(false)
  const [balance, setBalance] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRoundActive, setIsRoundActive] = useState(false)
  const [isCheckingRound, setIsCheckingRound] = useState(true)

  useEffect(() => {
    async function checkRoundStatus() {
      if (!isContractConfigured()) {
        setIsCheckingRound(false)
        return
      }

      try {
        console.log("[v0] Checking if game round is active...")
        const gameState = await client.getObject({
          id: CONTRACT_CONFIG.GAME_STATE_ID,
          options: { showContent: true },
        })

        if (gameState.data && gameState.data.content && gameState.data.content.dataType === "moveObject") {
          const fields = gameState.data.content.fields as any
          const isActive = fields.is_active || false
          console.log("[v0] Game round active:", isActive)
          setIsRoundActive(isActive)
        }
      } catch (error) {
        console.error("[v0] Error checking round status:", error)
        setIsRoundActive(false)
      } finally {
        setIsCheckingRound(false)
      }
    }

    checkRoundStatus()
    const interval = setInterval(checkRoundStatus, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [client])

  useEffect(() => {
    async function fetchBalance() {
      console.log("[v0] Starting balance fetch...")
      console.log("[v0] Current account:", currentAccount?.address)

      if (!currentAccount?.address) {
        console.log("[v0] No account connected, setting balance to 0")
        setBalance(0)
        return
      }

      try {
        console.log("[v0] Fetching balances from blockchain...")
        const balances = await client.getAllBalances({
          owner: currentAccount.address,
        })
        console.log("[v0] Balances received:", balances)

        const suiBalance = balances.find((b) => b.coinType === "0x2::sui::SUI")
        if (suiBalance) {
          const balanceInSui = mistToSui(BigInt(suiBalance.totalBalance))
          console.log("[v0] SUI balance:", balanceInSui)
          setBalance(balanceInSui)
        } else {
          console.log("[v0] No SUI balance found")
          setBalance(0)
        }
      } catch (error) {
        console.error("[v0] Error fetching balance:", error)
        setBalance(0)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 10000)
    return () => clearInterval(interval)
  }, [currentAccount, client])

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

  const handleStartRound = async () => {
    console.log("[v0] Start round clicked")

    if (!currentAccount) {
      toast.error("Please connect your wallet first!")
      return
    }

    if (!isContractConfigured()) {
      toast.error("Smart contract not configured.")
      return
    }

    setIsSubmitting(true)
    console.log("[v0] Creating start round transaction...")

    try {
      const tx = createStartRoundTransaction(CONTRACT_CONFIG.GAME_STATE_ID)
      console.log("[v0] Transaction created, signing...")

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log("[v0] Round started successfully:", result.digest)
            toast.success("Game round started!", {
              description: `TX: ${result.digest.slice(0, 8)}...`,
            })
            setIsRoundActive(true)
            setIsSubmitting(false)
          },
          onError: (error) => {
            console.error("Start round error:", error)
            toast.error("Failed to start round", {
              description: error.message || "Please try again",
            })
            setIsSubmitting(false)
          },
        },
      )
    } catch (error: any) {
      console.error("Error creating start round transaction:", error)
      toast.error("Failed to create transaction", {
        description: error.message || "Please try again",
      })
      setIsSubmitting(false)
    }
  }

  const handleStartGame = async () => {
    console.log("[v0] Start game clicked")
    console.log("[v0] Current account:", currentAccount)
    console.log("[v0] Contract configured:", isContractConfigured())
    console.log("[v0] Bet amount:", betAmount, "Min bet:", MIN_BET)
    console.log("[v0] Selected tiles:", selectedTiles)
    console.log("[v0] Balance:", balance)
    console.log("[v0] Round active:", isRoundActive)

    if (!currentAccount) {
      toast.error("Please connect your wallet first!")
      return
    }

    if (!isContractConfigured()) {
      toast.error("Smart contract not configured. Please update environment variables.")
      return
    }

    if (!isRoundActive) {
      toast.error("No active game round. Please start a round first!")
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

    if (balance < betAmount) {
      toast.error(`Insufficient balance. You have ${balance.toFixed(3)} SUI`)
      return
    }

    setIsSubmitting(true)
    console.log("[v0] Creating transaction...")

    try {
      const tx = createPlayGameTransaction(CONTRACT_CONFIG.GAME_STATE_ID, betAmount, selectedTiles)
      console.log("[v0] Transaction created, signing...")

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log("[v0] Transaction successful:", result.digest)
            toast.success("Game started! Transaction confirmed", {
              description: `TX: ${result.digest.slice(0, 8)}...`,
            })
            setGameStarted(true)
            setIsPlaying(true)
            setTimeRemaining(GAME_DURATION)
            setIsSubmitting(false)

            setTimeout(() => {
              client.getAllBalances({ owner: currentAccount.address }).then((balances) => {
                const suiBalance = balances.find((b) => b.coinType === "0x2::sui::SUI")
                if (suiBalance) setBalance(mistToSui(BigInt(suiBalance.totalBalance)))
              })
            }, 2000)
          },
          onError: (error) => {
            console.error("Transaction error:", error)
            toast.error("Transaction failed", {
              description: error.message || "Please try again",
            })
            setIsSubmitting(false)
          },
        },
      )
    } catch (error: any) {
      console.error("Error creating transaction:", error)
      toast.error("Failed to create transaction", {
        description: error.message || "Please try again",
      })
      setIsSubmitting(false)
    }
  }

  const handleGameEnd = () => {
    setIsPlaying(false)
    setGameStarted(false)

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
    if (gameStarted) {
      toast.warning("Cannot reset during an active game!")
      return
    }

    setIsPlaying(false)
    setSelectedTiles([])
    setTimeRemaining(GAME_DURATION)
    toast.info("Game reset. Select your tiles and start again!")
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {!isCheckingRound && !isRoundActive && currentAccount && (
          <Card className="border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-yellow-700 dark:text-yellow-300">No Active Game Round</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Start a new round to begin playing</p>
                </div>
                <Button
                  onClick={handleStartRound}
                  disabled={isSubmitting}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white flex-shrink-0"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Starting..." : "Start Round"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Round Status:</span>
                      <span className={`font-bold ${isRoundActive ? "text-green-600" : "text-yellow-600"}`}>
                        {isCheckingRound ? "Checking..." : isRoundActive ? "Active" : "Not Started"}
                      </span>
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
                  disabled={
                    !currentAccount ||
                    selectedTiles.length === 0 ||
                    isSubmitting ||
                    !isContractConfigured() ||
                    !isRoundActive
                  }
                >
                  <Play className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Processing..." : "Start Game"}
                </Button>
              ) : (
                <Button
                  onClick={handleReset}
                  size="lg"
                  variant="outline"
                  className="flex-1 text-lg font-bold bg-transparent"
                  disabled={gameStarted}
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              )}
            </div>

            {!currentAccount && (
              <p className="text-center text-sm text-muted-foreground">Connect your wallet to start playing</p>
            )}
            {currentAccount && !isContractConfigured() && (
              <p className="text-center text-sm text-yellow-600 dark:text-yellow-400">
                Contract not configured. Please deploy and update environment variables.
              </p>
            )}
            {currentAccount && isContractConfigured() && !isRoundActive && !isCheckingRound && (
              <p className="text-center text-sm text-yellow-600 dark:text-yellow-400">
                Please start a round first using the button above
              </p>
            )}

            <p className="text-center text-xs text-muted-foreground/50">{APP_VERSION}</p>
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
