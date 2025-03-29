"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Edit, Trash, Eye, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function PostsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Here you would add your Supabase auth check
    // const checkUser = async () => {
    //   const { data: { session } } = await supabase.auth.getSession()
    //   if (!session) {
    //     router.push('/auth/login')
    //     return
    //   }
    //   setUser(session.user)
    //
    //   // Fetch posts
    //   const { data, error } = await supabase
    //     .from('posts')
    //     .select('*')
    //     .order('created_at', { ascending: false })
    //
    //   if (error) {
    //     toast({
    //       title: "Error",
    //       description: "Failed to load posts.",
    //       variant: "destructive",
    //     })
    //     return
    //   }
    //
    //   setPosts(data)
    //   setIsLoading(false)
    // }
    // checkUser()

    // Simulate auth check and data fetch
    setTimeout(() => {
      // Mock user data
      setUser({
        id: "123",
        email: "admin@example.com",
        user_metadata: {
          role: "admin",
          name: "Sarah Johnson",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      })

      // Mock posts data
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
  }, [router])

  const handleDeletePost = (id: string) => {
    // Here you would add your Supabase delete code
    // const deletePost = async () => {
    //   const { error } = await supabase
    //     .from('posts')
    //     .delete()
    //     .eq('id', id)
    //
    //   if (error) {
    //     toast({
    //       title: "Error",
    //       description: "Failed to delete post.",
    //       variant: "destructive",
    //     })
    //     return
    //   }
    //
    //   setPosts(posts.filter(post => post.id !== id))
    //   toast({
    //     title: "Success",
    //     description: "Post deleted successfully.",
    //   })
    // }
    // deletePost()

    // Simulate delete
    setPosts(posts.filter((post) => post.id !== id))
    toast({
      title: "Success",
      description: "Post deleted successfully.",
    })
  }

  const handleApprovePost = (id: string) => {
    // Here you would add your Supabase update code
    // const approvePost = async () => {
    //   const { error } = await supabase
    //     .from('posts')
    //     .update({ status: 'published' })
    //     .eq('id', id)
    //
    //   if (error) {
    //     toast({
    //       title: "Error",
    //       description: "Failed to approve post.",
    //       variant: "destructive",
    //     })
    //     return
    //   }
    //
    //   setPosts(posts.map(post => post.id === id ? { ...post, status: 'published' } : post))
    //   toast({
    //     title: "Success",
    //     description: "Post approved and published.",
    //   })
    // }
    // approvePost()

    // Simulate approve
    setPosts(posts.map((post) => (post.id === id ? { ...post, status: "published" } : post)))
    toast({
      title: "Success",
      description: "Post approved and published.",
    })
  }

  const handleRejectPost = (id: string) => {
    // Here you would add your Supabase update code
    // const rejectPost = async () => {
    //   const { error } = await supabase
    //     .from('posts')
    //     .update({ status: 'rejected' })
    //     .eq('id', id)
    //
    //   if (error) {
    //     toast({
    //       title: "Error",
    //       description: "Failed to reject post.",
    //       variant: "destructive",
    //     })
    //     return
    //   }
    //
    //   setPosts(posts.map(post => post.id === id ? { ...post, status: 'rejected' } : post))
    //   toast({
    //     title: "Success",
    //     description: "Post rejected.",
    //   })
    // }
    // rejectPost()

    // Simulate reject
    setPosts(posts.map((post) => (post.id === id ? { ...post, status: "rejected" } : post)))
    toast({
      title: "Success",
      description: "Post rejected.",
    })
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <PageTransition>
      <DashboardShell>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Posts</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search posts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button asChild className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600">
              <Link href="/dashboard/posts/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No posts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${post.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/posts/edit/${post.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePost(post.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          {post.status === "pending" && user?.user_metadata?.role === "admin" && (
                            <>
                              <DropdownMenuItem onClick={() => handleApprovePost(post.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRejectPost(post.id)}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DashboardShell>
    </PageTransition>
  )
}

