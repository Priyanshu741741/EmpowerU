"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Edit, Trash, Eye, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { setupPostDeletionFunctions, deletePostWithFallbacks } from "@/lib/sql-helpers"

interface User {
  id: string;
  full_name: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  status: string;
  author: string;
  category: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export default function AdminPostsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're running on the client side
    if (typeof window === 'undefined') {
      return;
    }
    
    // Check authentication
    try {
      const isAuth = isAdminAuthenticated();
      if (!isAuth) {
        console.log("Not authenticated, redirecting to login");
        router.push('/admin/login');
        return;
      }
      
      // Setup database functions
      setupPostDeletionFunctions().catch(error => {
        console.log("Setup error (non-critical):", error);
      });
      
      // Fetch posts data from Supabase
      const fetchPosts = async () => {
        try {
          console.log("Fetching posts from Supabase...")
          const { data, error } = await supabase
            .from('posts')
            .select(`
              id,
              title,
              status,
              created_at,
              category,
              author_id,
              users (
                id,
                full_name
              )
            `)
            .order('created_at', { ascending: false })
          
          if (error) {
            console.error("Error fetching posts:", error)
            setConnectionError(error.message)
            toast({
              title: "Error",
              description: "Failed to load posts.",
              variant: "destructive",
            })
            setIsLoading(false)
            return
          }
          
          console.log("Supabase posts data:", data)
          
          if (!data || data.length === 0) {
            // If no posts exist yet, set empty array
            console.log("No posts found in Supabase")
            setPosts([])
            setIsLoading(false)
            return
          }
          
          // Format the post data
          const formattedPosts = data.map((post: {
            id: string;
            title: string;
            description?: string;
            status: string;
            created_at: string;
            updated_at?: string;
            category?: string;
            users?: {
              id: string;
              full_name: string;
            };
          }) => ({
            id: post.id,
            title: post.title,
            description: post.description || "",
            status: post.status,
            author: post.users?.full_name || "Unknown Author",
            created_at: post.created_at,
            updated_at: post.updated_at || post.created_at,
            category: post.category || "Uncategorized",
            user: post.users
          }));
          
          console.log("Formatted posts:", formattedPosts);
          setPosts(formattedPosts);
        } catch (err) {
          console.error("Error in fetchPosts:", err)
          setConnectionError(err instanceof Error ? err.message : String(err))
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchPosts();
    } catch (error) {
      console.error("Authentication check error:", error);
      router.push('/admin/login');
    }
  }, [router]);

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const authors = useMemo(() => {
    const uniqueAuthors = Array.from(
      new Set(posts.map(post => post.user?.id))
    ).map(id => {
      const post = posts.find(post => post.user?.id === id);
      return post?.user ? { id: post.user.id, full_name: post.user.full_name } : null;
    }).filter(Boolean) as User[];
    
    return uniqueAuthors;
  }, [posts]);

  const handleDeleteConfirmation = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  // Add a refreshPosts function to reload data after operations
  const refreshPosts = async () => {
    setIsLoading(true);
    try {
      console.log("Refreshing posts from Supabase...");
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          status,
          created_at,
          category,
          author_id,
          users (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error refreshing posts:", error);
        toast({
          title: "Error",
          description: "Failed to refresh posts.",
          variant: "destructive",
        });
        return;
      }
      
      if (!data || data.length === 0) {
        setPosts([]);
        return;
      }
      
      const formattedPosts = data.map((post) => ({
        id: post.id,
        title: post.title,
        description: post.description || "",
        status: post.status,
        author: post.users?.full_name || "Unknown Author",
        created_at: post.created_at,
        updated_at: post.updated_at || post.created_at,
        category: post.category || "Uncategorized",
        user: post.users
      }));
      
      setPosts(formattedPosts);
      console.log("Posts refreshed successfully");
    } catch (err) {
      console.error("Error in refreshPosts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      // Check if post exists
      const postToDeleteObj = posts.find(post => post.id === postToDelete);
      
      if (!postToDeleteObj) {
        toast({
          title: "Error",
          description: `Post with ID ${postToDelete} not found`,
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(true);
      console.log(`Attempting to delete post with ID: ${postToDelete}`);
      
      // Try multiple deletion methods in sequence for maximum reliability
      
      // 1. First try the direct delete API which has multiple fallback methods
      try {
        console.log("Trying direct delete API...");
        const response = await fetch(`/api/posts/direct-delete/${postToDelete}`, {
          method: "DELETE"
        });
        
        if (response.ok) {
          console.log("Direct delete API successful");
          
          // Update local state for immediate UI feedback
          setPosts(currentPosts => currentPosts.filter(post => post.id !== postToDelete));
          
          // Display a more prominent success message
          toast({
            title: "Success!",
            description: (
              <div className="flex flex-col">
                <p className="font-medium">Post "{postToDeleteObj.title}" has been deleted.</p>
                <p className="text-sm mt-1">All data has been removed from the database.</p>
              </div>
            ),
            variant: "default",
            duration: 5000
          });
          
          // Also show a temporary success banner at the top of the page
          const successBanner = document.createElement('div');
          successBanner.className = 'bg-green-100 border border-green-200 text-green-800 p-4 mb-4 rounded-md fixed top-20 left-1/2 transform -translate-x-1/2 shadow-lg z-50';
          successBanner.innerHTML = `<p class="font-bold flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>Post successfully deleted!</p>`;
          document.body.appendChild(successBanner);
          
          setTimeout(() => {
            document.body.removeChild(successBanner);
          }, 5000);
          
          // Refresh posts to ensure UI is in sync with database
          setTimeout(() => {
            refreshPosts();
          }, 500);
          
          return;
        } else {
          console.log("Direct delete API failed, trying other methods");
        }
      } catch (apiError) {
        console.error("Error calling direct delete API:", apiError);
      }
      
      // 2. Try the helper function which uses multiple database approaches
      try {
        console.log("Trying database helper function...");
        const { success, error } = await deletePostWithFallbacks(postToDelete);
        
        if (success) {
          console.log("Helper function delete successful");
          
          // Update local state for immediate UI feedback
          setPosts(currentPosts => currentPosts.filter(post => post.id !== postToDelete));
          
          toast({
            title: "Success",
            description: `Post "${postToDeleteObj.title}" has been deleted.`,
          });
          
          // Refresh posts to ensure UI is in sync with database
          setTimeout(() => {
            refreshPosts();
          }, 500);
          
          return;
        } else {
          console.error("Helper function delete failed:", error);
        }
      } catch (helperError) {
        console.error("Error in helper function delete:", helperError);
      }
      
      // 3. Try the regular API endpoint
      try {
        console.log("Trying regular API endpoint...");
        const response = await fetch(`/api/posts/${postToDelete}`, {
          method: "DELETE"
        });
        
        if (response.ok) {
          console.log("Regular API delete successful");
          
          // Update local state for immediate UI feedback
          setPosts(currentPosts => currentPosts.filter(post => post.id !== postToDelete));
          
          toast({
            title: "Success",
            description: `Post "${postToDeleteObj.title}" has been deleted.`,
          });
          
          // Refresh posts to ensure UI is in sync with database
          setTimeout(() => {
            refreshPosts();
          }, 500);
          
          return;
        } else {
          console.error("Regular API delete failed:", await response.text());
        }
      } catch (regularApiError) {
        console.error("Error in regular API delete:", regularApiError);
      }
      
      // If we got here, all delete methods failed
      toast({
        title: "Error",
        description: "Failed to delete post after multiple attempts. Please try again.",
        variant: "destructive",
      });
      
      // Always refresh posts to ensure UI is in sync with server
      setTimeout(() => {
        refreshPosts();
      }, 500);
      
    } catch (error) {
      console.error("Unexpected error deleting post:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      // Try to refresh posts in case of error
      try {
        await refreshPosts();
      } catch (refreshError) {
        console.error("Error refreshing posts after delete failure:", refreshError);
      }
    } finally {
      // Reset state
      setPostToDelete(null);
      setDeleteDialogOpen(false);
      setIsLoading(false);
    }
  };

  const handleApprovePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: 'published' })
        .eq('id', id)
      
      if (error) {
        console.error("Error approving post:", error)
        toast({
          title: "Error",
          description: "Failed to approve post.",
          variant: "destructive",
        })
        return
      }
      
      // Update the post status in the local state
      setPosts(posts.map(post => 
        post.id === id ? { ...post, status: 'published' } : post
      ))
      
      toast({
        title: "Success",
        description: "Post approved and published.",
      })
    } catch (err) {
      console.error("Error in handleApprovePost:", err)
      toast({
        title: "Error",
        description: "Failed to approve post.",
        variant: "destructive",
      })
    }
  }

  const handleRejectPost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: 'rejected' })
        .eq('id', id)
      
      if (error) {
        console.error("Error rejecting post:", error)
        toast({
          title: "Error",
          description: "Failed to reject post.",
          variant: "destructive",
        })
        return
      }
      
      // Update the post status in the local state
      setPosts(posts.map(post => 
        post.id === id ? { ...post, status: 'rejected' } : post
      ))
      
      toast({
        title: "Success",
        description: "Post rejected.",
      })
    } catch (err) {
      console.error("Error in handleRejectPost:", err)
      toast({
        title: "Error",
        description: "Failed to reject post.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-4xl md:text-5xl font-bold">Posts</h1>
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
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {connectionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded-md">
          <p className="font-medium">Database Connection Error</p>
          <p className="text-sm mt-1">{connectionError}</p>
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="text-sm"
            >
              Retry Connection
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        {posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No posts found</p>
            <Button asChild className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600">
              <Link href="/admin/posts/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Post
              </Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
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
                  <TableCell colSpan={6} className="h-24 text-center">
                    No posts found matching your search.
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
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${post.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          {post.status === "pending" && (
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
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/posts/${post.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteConfirmation(post.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePost} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 