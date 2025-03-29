"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { BarChart, Users, FileText, MessageSquare, ArrowUpRight, LogOut, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { isAdminAuthenticated, clearAdminToken } from "@/lib/admin-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Database response types
interface PostUsers {
  full_name: string | null;
  avatar_url: string | null;
}

interface DBPost {
  id: string;
  title: string;
  status: string;
  created_at: string;
  users: PostUsers;
}

// Application state types
interface Post {
  id: string;
  title: string;
  status: string;
  author: string;
  authorAvatar: string | null;
  created_at: string;
}

interface User {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    pendingPosts: 0,
    totalUsers: 0,
    writers: 0
  })
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Check if we're running on the client
    if (typeof window === 'undefined') {
      return;
    }
    
    console.log("Admin dashboard - Client side mount");
    
    // Check authentication
    const checkAuth = async () => {
      try {
        console.log("Checking auth status...");
        const isAuth = isAdminAuthenticated();
        console.log("Auth status:", isAuth);
        
        if (!isAuth) {
          console.log("Not authenticated, redirecting to /admin/login");
          router.push('/admin/login');
          return;
        }
        
        setIsAuthenticated(true);
        // Continue with dashboard data loading
        console.log("Loading dashboard data...");
        await fetchDashboardData();
      } catch (error) {
        console.error("Authentication check error:", error);
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Check Supabase connection
      console.log("Testing Supabase connection...")
      const connectionTest = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
      
      if (connectionTest.error) {
        console.error("Supabase connection failed:", connectionTest.error)
        toast({
          title: "Connection Error",
          description: "Could not connect to the database.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      
      // Fetch total posts count
      const { count: totalPosts, error: totalError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
      
      // Fetch published posts count
      const { count: publishedPosts, error: publishedError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
      
      // Fetch pending posts count
      const { count: pendingPosts, error: pendingError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
      
      // Fetch total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
      
      // Fetch writers count
      const { count: writers, error: writersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'writer')
      
      // Fetch 5 most recent posts
      const { data: recentPostsData, error: recentError } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          status,
          created_at,
          users (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)
      
      // Fetch 5 most recent users
      const { data: recentUsersData, error: recentUsersError } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          role,
          avatar_url,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (totalError || publishedError || pendingError || usersError || writersError || recentError || recentUsersError) {
        console.error("Error fetching dashboard data:", {
          totalError, publishedError, pendingError, usersError, writersError, recentError, recentUsersError
        })
        toast({
          title: "Data Loading Error",
          description: "Could not load all dashboard data.",
          variant: "destructive",
        })
      } else {
        setStats({
          totalPosts: totalPosts || 0,
          publishedPosts: publishedPosts || 0,
          pendingPosts: pendingPosts || 0,
          totalUsers: totalUsers || 0,
          writers: writers || 0
        })
        
        if (recentPostsData) {
          const formattedPosts = recentPostsData.map((post: any) => ({
            id: post.id,
            title: post.title,
            status: post.status,
            author: post.users?.full_name || "Unknown Author",
            authorAvatar: post.users?.avatar_url,
            created_at: post.created_at
          })) as Post[]
          
          setRecentPosts(formattedPosts)
        }
        
        if (recentUsersData) {
          setRecentUsers(recentUsersData as User[])
        }
      }
    } catch (err) {
      console.error("Error in fetchDashboardData:", err)
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    clearAdminToken()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
    router.push('/admin/login')
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Published</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600"><AlertCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Draft</Badge>
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl md:text-5xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pendingApprovals">Pending Approvals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.publishedPosts} published, {stats.pendingPosts} pending
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Pending Approvals</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pendingPosts}</div>
                <p className="text-xs text-muted-foreground">
                  Posts awaiting review
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Including {stats.writers} writers
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Content Growth</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">+{Math.round(stats.publishedPosts / (stats.totalPosts || 1) * 100)}%</div>
                <p className="text-xs text-muted-foreground">
                  Published content ratio
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Posts</CardTitle>
                <CardDescription>The 5 most recently created posts</CardDescription>
              </CardHeader>
              <CardContent>
                {recentPosts.length === 0 ? (
                  <div className="text-center py-6">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No posts found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPosts.map(post => (
                      <div key={post.id} className="flex items-center space-x-4 border-b pb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{post.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Avatar className="h-5 w-5 mr-1">
                                <AvatarImage src={post.authorAvatar || undefined} />
                                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {post.author}
                            </div>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{formatDate(post.created_at)}</span>
                          </div>
                          <div className="mt-1">{getStatusBadge(post.status)}</div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/posts/${post.id}/edit`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/posts">View All Posts</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Users</CardTitle>
                <CardDescription>The 5 most recently joined users</CardDescription>
              </CardHeader>
              <CardContent>
                {recentUsers.length === 0 ? (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentUsers.map(user => (
                      <div key={user.id} className="flex items-center space-x-4 border-b pb-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>
                            {user.full_name ? user.full_name.charAt(0) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium">{user.full_name || 'Unnamed User'}</h4>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <div className="mt-1">
                            <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'} className="text-xs">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(user.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/users">View All Users</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pendingApprovals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Posts Awaiting Approval</CardTitle>
              <CardDescription>Review and approve submitted content</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.pendingPosts === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                  <h3 className="text-md font-medium">All caught up!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    There are no posts waiting for approval.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPosts
                      .filter(post => post.status === 'pending')
                      .map(post => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={post.authorAvatar || undefined} />
                                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {post.author}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(post.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/admin/posts/${post.id}/edit`}>
                                Review
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/posts">
                  View All Posts
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 