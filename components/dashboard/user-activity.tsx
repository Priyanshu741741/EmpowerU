"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Activity {
  id: string
  user: {
    name: string
    avatar: string
  }
  action: string
  time: string
}

export function UserActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Here you would add your Supabase fetch code
    // const fetchActivities = async () => {
    //   const { data, error } = await supabase
    //     .from('activities')
    //     .select('*')
    //     .order('created_at', { ascending: false })
    //     .limit(5)
    //
    //   if (error) {
    //     console.error('Error fetching activities:', error)
    //     return
    //   }
    //
    //   setActivities(data)
    //   setIsLoading(false)
    // }
    // fetchActivities()

    // Simulate fetch
    setTimeout(() => {
      setActivities([
        {
          id: "1",
          user: {
            name: "Jessica Chen",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          action: "published a new post",
          time: "2 hours ago",
        },
        {
          id: "2",
          user: {
            name: "Maya Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          action: "commented on a post",
          time: "4 hours ago",
        },
        {
          id: "3",
          user: {
            name: "Dr. Sarah Williams",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          action: "submitted a post for review",
          time: "1 day ago",
        },
        {
          id: "4",
          user: {
            name: "Amina Hassan",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          action: "joined the community",
          time: "2 days ago",
        },
        {
          id: "5",
          user: {
            name: "Elena Rodriguez",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          action: "updated their profile",
          time: "3 days ago",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>{" "}
                      <span className="text-gray-500 dark:text-gray-400">{activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

