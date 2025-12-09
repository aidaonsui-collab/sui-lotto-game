"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface GameTimerProps {
  timeRemaining: number
  isPlaying: boolean
}

export function GameTimer({ timeRemaining, isPlaying }: GameTimerProps) {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const isLowTime = timeRemaining <= 10

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-6 py-3 rounded-full font-bold text-2xl border-2 shadow-lg",
        isPlaying
          ? isLowTime
            ? "bg-destructive/30 text-destructive border-destructive animate-pulse"
            : "bg-primary/30 text-primary border-primary"
          : "bg-muted text-muted-foreground border-muted",
      )}
    >
      <Clock className="h-6 w-6" />
      <span className="tabular-nums">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  )
}
