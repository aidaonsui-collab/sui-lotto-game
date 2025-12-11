"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sparkles, Trophy } from "lucide-react"
import { useState } from "react"

interface TileGridProps {
  selectedTiles: number[]
  onTileSelect: (tileNumber: number) => void
  isPlaying: boolean
  winningTiles?: number[]
}

const TOTAL_TILES = 25

export function TileGrid({ selectedTiles, onTileSelect, isPlaying, winningTiles = [] }: TileGridProps) {
  const [animatingTile, setAnimatingTile] = useState<number | null>(null)

  const handleTileClick = (tileNumber: number) => {
    if (winningTiles.length > 0) return

    setAnimatingTile(tileNumber)
    setTimeout(() => setAnimatingTile(null), 600)

    onTileSelect(tileNumber)
  }

  return (
    <div className="tile-grid">
      {Array.from({ length: TOTAL_TILES }, (_, i) => i + 1).map((tileNumber) => {
        const isSelected = selectedTiles.includes(tileNumber)
        const isAnimating = animatingTile === tileNumber
        const isWinning = winningTiles.includes(tileNumber)
        const isWinningAndSelected = isWinning && isSelected

        return (
          <motion.button
            key={tileNumber}
            onClick={() => handleTileClick(tileNumber)}
            whileHover={winningTiles.length === 0 ? { scale: 1.08 } : {}}
            whileTap={winningTiles.length === 0 ? { scale: 0.95 } : {}}
            animate={
              isAnimating
                ? {
                    scale: [1, 1.15, 1],
                    rotate: [0, 8, -8, 0],
                  }
                : isWinning
                  ? {
                      scale: [1, 1.1, 1],
                      transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
                    }
                  : {}
            }
            transition={{ duration: 0.4 }}
            className={cn(
              "relative overflow-hidden",
              winningTiles.length === 0 ? "cursor-pointer" : "cursor-not-allowed",
              isSelected && "selected",
              isWinning && "border-4 border-yellow-400 shadow-lg shadow-yellow-400/50",
              isWinningAndSelected && "border-green-400 shadow-green-400/50",
            )}
          >
            <span className="relative z-10 font-black text-4xl">{tileNumber}</span>

            {isWinning && (
              <>
                <motion.div
                  className={cn(
                    "absolute inset-0",
                    isWinningAndSelected
                      ? "bg-gradient-to-br from-green-500/30 via-emerald-500/30 to-teal-500/30"
                      : "bg-gradient-to-br from-yellow-500/30 via-amber-500/30 to-orange-500/30",
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="absolute top-2 right-2 z-20"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <Trophy className={cn("h-6 w-6", isWinningAndSelected ? "text-green-400" : "text-yellow-400")} />
                </motion.div>
              </>
            )}

            {isSelected && !isWinning && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            <AnimatePresence>
              {isAnimating && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{
                        scale: 1.5,
                        opacity: 0,
                        x: Math.cos((i * Math.PI) / 3) * 50,
                        y: Math.sin((i * Math.PI) / 3) * 50,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <Sparkles className="w-4 h-4 text-accent" />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
}
