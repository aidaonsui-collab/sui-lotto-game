"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Sparkles, PartyPopper, X } from "lucide-react"

interface WinningTilesRevealProps {
  winningTiles: number[]
  selectedTiles: number[]
  onComplete: () => void
}

export function WinningTilesReveal({ winningTiles, selectedTiles, onComplete }: WinningTilesRevealProps) {
  const [revealedTiles, setRevealedTiles] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const matchingTiles = winningTiles.filter((tile) => selectedTiles.includes(tile))
  const isWinner = matchingTiles.length >= Math.ceil(winningTiles.length / 2)

  useEffect(() => {
    console.log("[v0] WinningTilesReveal mounted - will reveal", winningTiles.length, "tiles")

    // Reveal tiles one by one
    const revealTimers: NodeJS.Timeout[] = []
    winningTiles.forEach((tile, index) => {
      const timer = setTimeout(() => {
        setRevealedTiles((prev) => [...prev, tile])
      }, index * 800)
      revealTimers.push(timer)
    })

    // Show result after all tiles revealed
    const resultTimer = setTimeout(
      () => {
        setShowResult(true)
        if (isWinner) {
          setShowCelebration(true)
        }
      },
      winningTiles.length * 800 + 500,
    )

    const closeTimer = setTimeout(
      () => {
        console.log("[v0] Auto-closing winning tiles reveal")
        onComplete()
      },
      winningTiles.length * 800 + 5500,
    )

    return () => {
      revealTimers.forEach(clearTimeout)
      clearTimeout(resultTimer)
      clearTimeout(closeTimer)
    }
  }, [winningTiles, isWinner, onComplete])

  const handleClose = () => {
    console.log("[v0] Manual close clicked")
    onComplete()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      >
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ["#fbbf24", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: "-10%",
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: typeof window !== "undefined" ? window.innerHeight + 100 : 1000,
                  opacity: 0,
                  rotate: 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "easeIn",
                }}
              />
            ))}
          </div>
        )}

        <Card
          className="w-full max-w-2xl border-4 border-primary shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>

          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, stiffness: 200, damping: 15 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">Winning Tiles Revealed!</CardTitle>
            <p className="text-muted-foreground">Match at least half to win</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-5 gap-4 justify-items-center">
              {winningTiles.map((tile, index) => {
                const isRevealed = revealedTiles.includes(tile)
                const isMatched = matchingTiles.includes(tile)

                return (
                  <motion.div
                    key={tile}
                    initial={{ opacity: 0, y: -20 }}
                    animate={
                      isRevealed
                        ? {
                            opacity: 1,
                            y: 0,
                          }
                        : { opacity: 0, y: -20 }
                    }
                    transition={{
                      delay: index * 0.8,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className={`
                      relative w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl
                      ${
                        isMatched
                          ? "bg-gradient-to-br from-green-400 to-emerald-600 border-4 border-green-300"
                          : "bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-yellow-300"
                      }
                      shadow-lg
                    `}
                  >
                    {isRevealed && (
                      <>
                        <span className="relative z-10 text-white drop-shadow-md">{tile}</span>
                        {isMatched && (
                          <motion.div
                            className="absolute -top-1 -right-1 bg-green-600 rounded-full p-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                          >
                            <Sparkles className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </>
                    )}
                  </motion.div>
                )
              })}
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-3"
                >
                  <div
                    className={`
                    flex items-center justify-center gap-3 text-2xl font-bold p-4 rounded-lg
                    ${
                      isWinner
                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400"
                        : "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-600 dark:text-red-400"
                    }
                  `}
                  >
                    {isWinner ? (
                      <>
                        <PartyPopper className="w-8 h-8" />
                        You Won!
                        <PartyPopper className="w-8 h-8" />
                      </>
                    ) : (
                      <>Better Luck Next Time</>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You matched {matchingTiles.length} out of {winningTiles.length} winning tiles
                  </p>
                  <Button onClick={handleClose} className="w-full" variant="default">
                    Close & Continue
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
