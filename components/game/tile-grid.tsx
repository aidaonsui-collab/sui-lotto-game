"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"
import { useState } from "react"

interface TileGridProps {
  selectedTiles: number[]
  onTileSelect: (tileNumber: number) => void
  isPlaying: boolean
}

const TOTAL_TILES = 25

export function TileGrid({ selectedTiles, onTileSelect, isPlaying }: TileGridProps) {
  const [animatingTile, setAnimatingTile] = useState<number | null>(null)

  const handleTileClick = (tileNumber: number) => {
    setAnimatingTile(tileNumber)
    setTimeout(() => setAnimatingTile(null), 600)

    onTileSelect(tileNumber)
  }

  return (
    <div className="tile-grid">
      {Array.from({ length: TOTAL_TILES }, (_, i) => i + 1).map((tileNumber) => {
        const isSelected = selectedTiles.includes(tileNumber)
        const isAnimating = animatingTile === tileNumber

        return (
          <motion.button
            key={tileNumber}
            onClick={() => handleTileClick(tileNumber)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            animate={
              isAnimating
                ? {
                    scale: [1, 1.15, 1],
                    rotate: [0, 8, -8, 0],
                  }
                : {}
            }
            transition={{ duration: 0.4 }}
            className={cn("relative overflow-hidden cursor-pointer", isSelected && "selected")}
          >
            <span className="relative z-10 font-black text-4xl">{tileNumber}</span>

            {isSelected && (
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
