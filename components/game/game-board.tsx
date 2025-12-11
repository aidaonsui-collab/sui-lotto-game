"use client"

import { useState, useEffect, useRef } from "react"
import { useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TileGrid } from "./tile-grid"
import { BetAmount } from "./bet-amount"
import { LuckyBoxModal } from "./lucky-box-modal"
import { WinningTilesReveal } from "./winning-tiles-reveal"
import { toast } from "sonner"
import { Coins, Play, Zap, Trophy, Clock, Loader2 } from "lucide-react"
import {
  createPlayGameTransaction,
  createStartRoundTransaction,
  createEndRoundTransaction,
} from "@/lib/sui-transactions"
import { CONTRACT_CONFIG, mistToSui, isContractConfigured } from "@/lib/contract-config"
import { CountdownTimer } from "./countdown-timer"

const GAME_DURATION = 60
const MIN_BET = 0.05
const BET_PER_TILE = 0.05
const APP_VERSION = "v3.4.0-winning-tiles-reveal"
const REVEAL_DURATION = 5000 // 5 seconds

type BetAmountComponentProps = {
  betAmount: number
  onBetChange: (amount: number) => void
  minBet: number
  disabled?: boolean
  selectedTiles: number
}

export function GameBoard() {
  const currentAccount = useCurrentAccount()
  const client = useSuiClient()
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const [mounted, setMounted] = useState(false)
  const [selectedTiles, setSelectedTiles] = useState<number[]>([])
  const [submittedTiles, setSubmittedTiles] = useState<number[]>([])
  const [betAmount, setBetAmount] = useState(MIN_BET)
  const [gameStarted, setGameStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [showLuckyBox, setShowLuckyBox] = useState(false)
  const [balance, setBalance] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRoundActive, setIsRoundActive] = useState(false)
  const [isCheckingRound, setIsCheckingRound] = useState(true)
  const [roundEndTime, setRoundEndTime] = useState<number>(0)
  const [gameState, setGameState] = useState<any>(null)

  const [winningTiles, setWinningTiles] = useState<number[]>([])
  const [showWinningTiles, setShowWinningTiles] = useState(false)
  const [playerResult, setPlayerResult] = useState<{ won: boolean; matches: number; winAmount?: number } | null>(null)
  const [canEndRoundAfterReveal, setCanEndRoundAfterReveal] = useState(false)
  const userDismissedModalRef = useRef(false)
  const lastRevealedRoundRef = useRef<number>(0)
  const [autoRestart, setAutoRestart] = useState(false)

  const checkRoundStatus = async () => {
    if (!isContractConfigured()) {
      setIsCheckingRound(false)
      return
    }

    try {
      const gameStateObj = await client.getObject({
        id: CONTRACT_CONFIG.GAME_STATE_ID,
        options: { showContent: true },
      })

      if (gameStateObj.data && gameStateObj.data.content && gameStateObj.data.content.dataType === "moveObject") {
        const fields = gameStateObj.data.content as any
        const isActive = fields.fields?.is_active || false
        const endTime = fields.fields?.round_end_time ? Number.parseInt(fields.fields.round_end_time) : 0
        const currentRound = fields.fields?.current_round ? Number.parseInt(fields.fields.current_round) : 0

        console.log("[v0] Round status check:", { isActive, endTime, currentRound, hasStartTime: endTime > 0 })

        const isRoundProperlyStarted = isActive && endTime > 0
        setIsRoundActive(isRoundProperlyStarted)
        setRoundEndTime(endTime)
        setGameState(fields)

        const currentTime = Date.now()
        if (endTime > 0 && currentTime >= endTime) {
          const winningTilesData = fields.fields?.winning_tiles || []
          if (
            winningTilesData.length > 0 &&
            currentRound !== lastRevealedRoundRef.current &&
            !userDismissedModalRef.current
          ) {
            console.log("[v0] Winning tiles found:", winningTilesData)
            const winningNumbers = winningTilesData.map((t: string) => Number.parseInt(t) + 1)
            setWinningTiles(winningNumbers)

            if (submittedTiles.length > 0) {
              const matches = submittedTiles.filter((tile) => winningNumbers.includes(tile)).length
              const requiredMatches = Math.ceil(winningNumbers.length / 2)
              const won = matches >= requiredMatches

              setPlayerResult({
                won,
                matches,
                winAmount: won ? betAmount * 1.5 : undefined,
              })
              console.log("[v0] Player result:", { won, matches, requiredMatches, submittedTiles, winningNumbers })
            }

            setShowWinningTiles(true)
            setCanEndRoundAfterReveal(false)
            lastRevealedRoundRef.current = currentRound

            setTimeout(() => {
              setCanEndRoundAfterReveal(true)
            }, REVEAL_DURATION)
          }
        }

        if (!isActive && endTime > 0 && currentTime >= endTime && autoRestart && currentAccount) {
          console.log("[v0] Auto-restart: Round ended, starting new round...")
          setTimeout(() => handleStartRound(), 2000)
        }

        if (isActive && currentRound !== lastRevealedRoundRef.current) {
          userDismissedModalRef.current = false
          setPlayerResult(null)
        }
      }
    } catch (error) {
      console.error("[v0] Error checking round status:", error)
      setIsRoundActive(false)
      setRoundEndTime(0)
      setGameState(null)
    } finally {
      setIsCheckingRound(false)
    }
  }

  useEffect(() => {
    checkRoundStatus()
    const interval = setInterval(checkRoundStatus, 5000)
    return () => clearInterval(interval)
  }, [client])

  useEffect(() => {
    async function fetchBalance() {
      if (!currentAccount?.address) {
        setBalance(0)
        return
      }

      try {
        const balances = await client.getAllBalances({
          owner: currentAccount.address,
        })

        const suiBalance = balances.find((b) => b.coinType === "0x2::sui::SUI")
        if (suiBalance) {
          const balanceInSui = mistToSui(BigInt(suiBalance.totalBalance))
          setBalance(balanceInSui)
        } else {
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
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleTileSelect = (tileNumber: number) => {
    setSelectedTiles((prev) => {
      if (prev.includes(tileNumber)) {
        return prev.filter((t) => t !== tileNumber)
      }
      return [...prev, tileNumber]
    })
  }

  const handleStartRound = async () => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!isContractConfigured()) {
      toast.error("Smart contract not configured. Please update environment variables.")
      return
    }

    setIsSubmitting(true)

    try {
      const tx = createStartRoundTransaction(CONTRACT_CONFIG.GAME_STATE_ID)

      await new Promise((resolve, reject) => {
        signAndExecuteTransaction(
          {
            transaction: tx,
          },
          {
            onSuccess: async () => {
              toast.success("Round started successfully!")
              await checkRoundStatus()
              resolve(undefined)
            },
            onError: (error) => {
              console.error("[v0] Failed to start round:", error)
              toast.error(`Failed to start round: ${error.message || "Unknown error"}`)
              reject(error)
            },
          },
        )
      })
    } catch (error: any) {
      console.error("[v0] Error starting round:", error)
      toast.error(`Error: ${error.message || "Failed to start round"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartGame = async () => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first")
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

    if (roundEndTime > 0 && Date.now() >= roundEndTime) {
      toast.error("Round time has expired", {
        description: "Please wait for the round to end and a new one to start",
      })
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

    try {
      const tx = createPlayGameTransaction(CONTRACT_CONFIG.GAME_STATE_ID, betAmount, selectedTiles)

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            toast.success("Game started! Transaction confirmed", {
              description: "Your tiles have been submitted. Good luck!",
            })
            setSubmittedTiles([...selectedTiles])
            setSelectedTiles([])
            setIsSubmitting(false)
          },
          onError: (error) => {
            console.error("[v0] Play game error:", error)
            toast.error("Failed to start game. Please try again.")
            setIsSubmitting(false)
          },
        },
      )
    } catch (error) {
      console.error("[v0] Play game error:", error)
      toast.error("An error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleGameEnd = () => {
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

    setGameStarted(false)
    setTimeRemaining(GAME_DURATION)
    setSelectedTiles([])
    setBetAmount(MIN_BET)
  }

  const canShowEndRoundButton = () => {
    if (!gameState || !isRoundActive) return false

    const endTime = gameState.fields?.round_end_time ? Number.parseInt(gameState.fields.round_end_time) : 0
    if (endTime === 0) return false // Round was never started

    const currentTime = Date.now()
    const hasExpired = endTime > 0 && currentTime >= endTime

    console.log("[v0] canShowEndRoundButton check:", {
      isRoundActive,
      endTime,
      currentTime,
      hasExpired,
      result: hasExpired,
    })

    return hasExpired
  }

  const shouldShowStartButton = () => {
    if (!gameState || !currentAccount) return false

    const endTime = gameState.fields?.round_end_time ? Number.parseInt(gameState.fields.round_end_time) : 0
    const hasEndTime = endTime > 0

    const result = !isRoundActive && (!hasEndTime || !canShowEndRoundButton())
    console.log("[v0] shouldShowStartButton check:", {
      isRoundActive,
      hasEndTime,
      canShowEndRound: canShowEndRoundButton(),
      result,
    })

    return result
  }

  const handleWinningTilesComplete = () => {
    console.log("[v0] Winning tiles reveal complete - hiding modal")
    userDismissedModalRef.current = true
    setShowWinningTiles(false)
    setCanEndRoundAfterReveal(true)

    if (playerResult) {
      if (playerResult.won) {
        toast.success(`You Won! ${playerResult.matches} Matches`, {
          description: `+${playerResult.winAmount?.toFixed(4)} SUI will be sent to your wallet`,
          duration: 6000,
        })
      } else {
        toast.error(`No Win - ${playerResult.matches} Matches`, {
          description: `You needed ${Math.ceil(winningTiles.length / 2)} matches to win`,
          duration: 5000,
        })
      }
    }
  }

  const handleEndRound = async () => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!isContractConfigured()) {
      toast.error("Smart contract not configured.")
      return
    }

    setIsSubmitting(true)

    try {
      const tx = createEndRoundTransaction(CONTRACT_CONFIG.GAME_STATE_ID)

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            toast.success("Round ended successfully!")
            setIsSubmitting(false)
            setSubmittedTiles([])
            checkRoundStatus()

            if (autoRestart) {
              setTimeout(() => handleStartRound(), 2000)
            }
          },
          onError: (error) => {
            console.error("[v0] End round error:", error)
            toast.error("Failed to end round", {
              description: error.message || "Please try again",
            })
            setIsSubmitting(false)
          },
        },
      )
    } catch (error) {
      console.error("[v0] End round error:", error)
      toast.error("An error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {showWinningTiles && (
            <WinningTilesReveal
              winningTiles={winningTiles}
              selectedTiles={submittedTiles}
              onComplete={handleWinningTilesComplete}
            />
          )}

          {!isCheckingRound && canShowEndRoundButton() && currentAccount && (
            <Card className="border-orange-500/50 bg-orange-500/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div>
                    <p className="font-bold text-xl text-orange-700 dark:text-orange-300">Round Time Expired</p>
                    <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                      This round needs to be ended before anyone can play again. Click below to end the round and reveal
                      winning tiles.
                    </p>
                  </div>
                  <Button
                    onClick={handleEndRound}
                    disabled={isSubmitting}
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Trophy className="mr-2 h-5 w-5" />
                    {isSubmitting ? "Ending Round..." : "End Round & Reveal Winners"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!isCheckingRound && !canShowEndRoundButton() && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                  <span>Select Your Numbers</span>
                  {isRoundActive && roundEndTime > 0 && (
                    <div className="flex items-center gap-2 text-sm font-normal">
                      <Clock className="h-4 w-4" />
                      <CountdownTimer endTime={roundEndTime} />
                    </div>
                  )}
                </CardTitle>
                <CardDescription>Choose your lucky tiles and place your bet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <TileGrid
                  selectedTiles={selectedTiles}
                  onTileSelect={handleTileSelect}
                  isPlaying={isRoundActive}
                  winningTiles={showWinningTiles ? winningTiles : []}
                />

                {submittedTiles.length > 0 && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      Your Tiles: {submittedTiles.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Bet: {betAmount.toFixed(2)} SUI | Waiting for round to end...
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <BetAmount
                    betAmount={betAmount}
                    onBetChange={setBetAmount}
                    minBet={MIN_BET}
                    disabled={true}
                    selectedTiles={selectedTiles.length}
                  />

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
                  <Button
                    onClick={handleStartGame}
                    size="lg"
                    className="flex-1 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={
                      !isRoundActive ||
                      selectedTiles.length === 0 ||
                      betAmount < MIN_BET ||
                      isSubmitting ||
                      submittedTiles.length > 0
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Game
                      </>
                    )}
                  </Button>
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
                    No active round. Please start a round first using the admin panel above.
                  </p>
                )}

                <p className="text-center text-xs text-muted-foreground/50">{APP_VERSION}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {!isCheckingRound && !isRoundActive && !canShowEndRoundButton() && shouldShowStartButton() && (
          <Card className="border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="pt-6">
              <div className="space-y-4">
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

                <div className="flex items-center justify-between pt-4 border-t border-yellow-500/30">
                  <label htmlFor="auto-restart" className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    Auto-Restart Rounds
                  </label>
                  <input
                    id="auto-restart"
                    type="checkbox"
                    checked={autoRestart}
                    onChange={(e) => setAutoRestart(e.target.checked)}
                    className="h-4 w-4 rounded border-yellow-500/50"
                  />
                </div>
                {autoRestart && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    New rounds will start automatically after the previous round ends
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <LuckyBoxModal
        open={showLuckyBox}
        onOpenChange={setShowLuckyBox}
        onCollect={() => {
          toast.success("Lucky Box collected! +5 SUI")
          setShowLuckyBox(false)
        }}
      />
    </div>
  )
}
