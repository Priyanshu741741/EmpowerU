"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"

type Comment = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  date: string
}

// Mock data
const mockComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "This article really resonated with me. Thank you for sharing these insights!",
    date: "2 days ago",
  },
  {
    id: "2",
    author: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "I've been struggling with this exact issue. The tips you provided are practical and helpful.",
    date: "1 week ago",
  },
]

export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        author: {
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: newComment,
        date: "Just now",
      }

      setComments([comment, ...comments])
      setNewComment("")
      setIsSubmitting(false)

      toast({
        title: "Comment posted!",
        description: "Your comment has been added to the discussion.",
      })
    }, 1000)
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Discussion ({comments.length})</h3>

      <div className="mb-8">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-4 min-h-[100px]"
        />
        <Button
          onClick={handleSubmitComment}
          disabled={isSubmitting}
          className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

