"use client"

import { useState, useEffect } from "react"
import { GameBoard } from "./game-board"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function GameBoardWrapper() {
  const [mounted, setMounted] = useState(false)

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

  return <GameBoard />
}
