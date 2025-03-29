"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { motion } from "framer-motion"
import type { Post } from "@/lib/types"
import { getRelatedPosts } from "@/lib/posts"

export function RelatedPosts({ currentPostId, category }: { currentPostId: string; category: string }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const relatedPosts = await getRelatedPosts(currentPostId, category)
        setPosts(relatedPosts)
      } catch (error) {
        console.error("Error fetching related posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedPosts()
  }, [currentPostId, category])

  if (isLoading) {
    return <div className="text-center">Loading related posts...</div>
  }

  if (posts.length === 0) {
    return <div className="text-center">No related posts found.</div>
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link href={`/blog/${post.slug}`} className="group block">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{format(new Date(post.date), "MMM d, yyyy")}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>

            <h3 className="text-lg font-bold mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
              {post.title}
            </h3>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

