"use client"

import { useEffect, useState } from "react"
import { Header } from "./header"

export function HeaderClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8" />
          </div>
        </div>
      </header>
    )
  }

  return <Header />
}