"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="pt-16 md:pt-20" // Add padding for fixed header
    >
      {children}
    </motion.div>
  )
}

