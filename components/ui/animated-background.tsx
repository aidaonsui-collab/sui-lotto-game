"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    setMounted(true)
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!mounted) return null

  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    initialX: Math.random() * dimensions.width,
    initialY: Math.random() * dimensions.height,
    x1: Math.random() * dimensions.width,
    x2: Math.random() * dimensions.width,
    x3: Math.random() * dimensions.width,
    y1: Math.random() * dimensions.height,
    y2: Math.random() * dimensions.height,
    y3: Math.random() * dimensions.height,
    size: 50 + Math.random() * 100,
    duration: 20 + Math.random() * 10,
  }))

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
      {/* Floating fish/bubbles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{
            x: particle.initialX,
            y: particle.initialY,
          }}
          animate={{
            x: [particle.x1, particle.x2, particle.x3],
            y: [particle.y1, particle.y2, particle.y3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div
            className="rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 blur-xl"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        </motion.div>
      ))}

      {/* Gradient orbs */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-secondary/20 via-transparent to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
