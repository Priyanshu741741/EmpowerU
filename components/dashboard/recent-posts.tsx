"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function RecentPosts() {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Here you would add your Supabase fetch code
    // const fetchPosts = async () => {
    //   const { data, error } = await supabase
    //     .from('posts')
    //     .select('*')
    //     .order('created_at', { ascending: false })
    //     .limit(5)
    //
    //   if (error) {
    //     console.error('Error fetching posts:', error)
    //     return
    //   }
    //
    //   setPosts(data)
    //   setIsLoading(false)
    // }
    // fetchPosts()

    // Simulate fetch
    setTimeout(() => {
      setPosts([
        {
          id: "1",
          title: "Breaking the Glass Ceiling: Women Leaders in Tech",
          status: "published",
          author: "Jessica Chen",
          created_at: "2023-05-28T12:00:00Z",
          category: "leadership",
        },
        {
          id: "2",
          title: "Finding Your Voice: Public Speaking for Women",
          status: "published",
          author: "Maya Johnson",
          created_at: "2023-05-25T10:30:00Z",
          category: "career",
        },
        {
          id: "3",
          title: "Self-Care Isn't Selfish: Prioritizing Mental Health",
          status: "pending",
          author: "Dr. Sarah Williams",
          created_at: "2023-05-20T15:45:00Z",
          category: "wellness",
        },
        {
          id: "4",
          title: "My Journey from Refugee to CEO",
          status: "draft",
          author: "Amina Hassan",
          created_at: "2023-05-15T09:15:00Z",
          category: "stories",
        },
        {
          id: "5",
          title: "Advocating for Equal Pay: What You Need to Know",
          status: "published",
          author: "Elena Rodriguez",
          created_at: "2023-05-10T14:20:00Z",
          category: "advocacy",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Posts</CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-pink-600 dark:text-pink-400">
            <Link href="/dashboard/posts">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Link href={`/dashboard/posts/edit/${post.id}`} className="font-medium hover:underline">
                      {post.title}
                    </Link>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      post.status === "published"
                        ? "default"
                        : post.status === "pending"
                          ? "outline"
                          : post.status === "draft"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

