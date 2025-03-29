"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

export function AnimatedBackground() {
  const [bubbles, setBubbles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      color: string
      duration: number
    }>
  >([])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const { width, height } = containerRef.current.getBoundingClientRect()

    const generateBubbles = () => {
      const newBubbles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 100 + 50,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 255)}, 0.1)`,
        duration: Math.random() * 20 + 10,
      }))
      setBubbles(newBubbles)
    }

    generateBubbles()

    const handleResize = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      setBubbles((prev) =>
        prev.map((bubble) => ({
          ...bubble,
          x: Math.random() * width,
          y: Math.random() * height,
        })),
      )
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950"
    >
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            backgroundColor: bubble.color,
            x: bubble.x,
            y: bubble.y,
          }}
          animate={{
            x: [bubble.x, bubble.x + Math.random() * 100 - 50],
            y: [bubble.y, bubble.y + Math.random() * 100 - 50],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-950" />
    </div>
  )
}

