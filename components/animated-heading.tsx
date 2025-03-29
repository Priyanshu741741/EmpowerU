"use client"

import { motion } from "framer-motion"

interface AnimatedHeadingProps {
  title: string
  subtitle?: string
}

export function AnimatedHeading({ title, subtitle }: AnimatedHeadingProps) {
  const words = title.split(" ")

  return (
    <div className="mb-8">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block mr-4 last:mr-0">
            {word.split("").map((letter, letterIndex) => (
              <motion.span
                key={`${wordIndex}-${letterIndex}`}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: wordIndex * 0.1 + letterIndex * 0.03,
                  type: "spring",
                  stiffness: 150,
                  damping: 25,
                }}
                className="inline-block text-transparent bg-clip-text 
                           bg-gradient-to-r from-pink-600 to-purple-600 
                           dark:from-pink-400 dark:to-purple-400"
              >
                {letter}
              </motion.span>
            ))}
          </span>
        ))}
      </h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-700 dark:text-gray-300"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

