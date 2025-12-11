"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  endTime: string | number | undefined
}

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("--:--")

  useEffect(() => {
    if (!endTime) {
      setTimeLeft("--:--")
      return
    }

    const updateTimer = () => {
      const endTimestamp = typeof endTime === "string" ? Number.parseInt(endTime) : endTime
      const now = Date.now() // Already in milliseconds
      const remaining = Math.max(0, endTimestamp - now) / 1000 // Convert to seconds

      if (remaining <= 0) {
        setTimeLeft("00:00")
        return
      }

      const minutes = Math.floor(remaining / 60)
      const seconds = Math.floor(remaining % 60)
      setTimeLeft(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
      <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      <span className="font-mono font-bold text-purple-700 dark:text-purple-300">{timeLeft}</span>
    </div>
  )
}
