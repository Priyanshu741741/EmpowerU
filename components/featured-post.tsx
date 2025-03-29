"use client"

import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Post } from "@/lib/types"

export function FeaturedPost({ post }: { post: Post }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-[4/3] rounded-xl overflow-hidden"
      >
        <Image
          src={post.coverImage || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
            {post.category}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(post.date), "MMMM d, yyyy")}
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold mb-4">{post.title}</h3>

        <p className="text-gray-600 dark:text-gray-400 mb-6">{post.excerpt}</p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex -space-x-2">
            {post.authors.map((author, index) => (
              <div
                key={index}
                className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-900"
              >
                <Image
                  src={author.avatar || "/placeholder.svg"}
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
            ))}
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">By </span>
            <span className="font-medium">
              {post.authors.map((author, index) => (
                <span key={index}>
                  {author.name}
                  {index < post.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </span>
          </div>
        </div>

        <Button asChild className="group">
          <Link href={`/blog/${post.slug}`}>
            Read Full Story
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}

