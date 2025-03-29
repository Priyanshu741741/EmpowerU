"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import FloatingBubblesBackground from "@/components/floating-bubbles"
import { useRouter } from "next/navigation"

export default function IntroPage() {
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)

  const handleNavigate = (path: string) => {
    setIsExiting(true)
    setTimeout(() => {
      router.push(path)
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className={`${isExiting ? "opacity-0" : "opacity-100"} transition-opacity duration-1000`}
    >
      <FloatingBubblesBackground title="EmpowerU">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300"
        >
          Stories, resources, and community to inspire and empower women around the world.
        </motion.p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => handleNavigate("/join")}
            size="lg"
            className="rounded-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
          >
            Publish
          </Button>
          <Button
            onClick={() => handleNavigate("/blog")}
            size="lg"
            variant="outline"
            className="rounded-full border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-950"
          >
            Explore
          </Button>
        </div>
      </FloatingBubblesBackground>
    </motion.div>
  )
}

