"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Zap } from "lucide-react"
import { motion } from "framer-motion"

export function JackpotDisplay() {
  const [jackpotAmount, setJackpotAmount] = useState(0)

  // Removed the growing jackpot simulation for mainnet
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setJackpotAmount((prev) => prev + Math.random() * 0.1)
  //   }, 5000)
  //   return () => clearInterval(interval)
  // }, [])

  return (
    <Card className="border-2 border-warning bg-gradient-to-r from-warning/10 via-warning/5 to-warning/10 overflow-hidden">
      <CardContent className="py-6 relative">
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Trophy className="h-12 w-12 text-warning" />
          </motion.div>

          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-warning animate-pulse" />
              JACKPOT
              <Zap className="h-4 w-4 text-warning animate-pulse" />
            </p>
            <div className="relative">
              <p className="text-4xl md:text-5xl font-black text-warning drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]">
                {jackpotAmount.toFixed(2)} SUI
              </p>
            </div>
          </div>

          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          >
            <Trophy className="h-12 w-12 text-warning" />
          </motion.div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-3">Random winners selected 1-2 times per day</p>
      </CardContent>
    </Card>
  )
}
