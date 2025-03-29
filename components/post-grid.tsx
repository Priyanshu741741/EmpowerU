"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { motion } from "framer-motion"
import type { Post } from "@/lib/types"

export function PostGrid({ posts }: { posts: Post[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {posts.map((post) => (
        <motion.div
          key={post.id}
          variants={item}
          onMouseEnter={() => setHoveredId(post.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="group"
        >
          <Link href={`/blog/${post.slug}`}>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className={`object-cover transition-transform duration-500 ${
                  hoveredId === post.id ? "scale-105" : "scale-100"
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{format(new Date(post.date), "MMM d, yyyy")}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
              {post.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

