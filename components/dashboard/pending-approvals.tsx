"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Eye, RefreshCw, Trash } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function PendingApprovals() {
  const [pendingPosts, setPendingPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [debugInfo, setDebugInfo] = useState("")
  const [testingConnection, setTestingConnection] = useState(false)

  const fetchPendingPosts = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching pending posts...");
      
      // First, check connection to Supabase - avoid aggregate functions
      const { data: connectionTest, error: connectionError } = await supabase
        .from('posts')
        .select('id')
        .limit(1);
      
      if (connectionError) {
        console.error("Connection error:", connectionError);
        const errorMessage = connectionError.message || JSON.stringify(connectionError);
        setDebugInfo(`Connection error: ${errorMessage}`);
        setIsLoading(false);
        return;
      }
      
      console.log("Connection successful, connection test:", connectionTest);
      
      // Now try to fetch ALL posts regardless of status to see what's in the database
      const { data: allPosts, error: allPostsError } = await supabase
        .from("posts")
        .select('*');
      
      if (allPostsError) {
        console.error("Error fetching all posts:", allPostsError);
        const errorMessage = allPostsError.message || JSON.stringify(allPostsError);
        setDebugInfo(`Error fetching all posts: ${errorMessage}`);
        setIsLoading(false);
        return;
      }
      
      console.log("Found total posts:", allPosts?.length || 0);
      if (allPosts && allPosts.length > 0) {
        // Log the status values found in the database
        const statusValues = [...new Set(allPosts.map(post => post.status))];
        console.log("Post status values found:", statusValues);
        
        // Check if any have status 'pending'
        const pendingCount = allPosts.filter(post => post.status === 'pending').length;
        console.log("Posts with 'pending' status:", pendingCount);
      }
      
      // Try to get all pending posts with a simpler query first
      const { data: allPendingPosts, error: pendingError } = await supabase
        .from("posts")
        .select('*')
        .eq("status", "pending");
      
      if (pendingError) {
        console.error("Error fetching pending posts:", pendingError);
        const errorMessage = pendingError.message || JSON.stringify(pendingError);
        setDebugInfo(`Error fetching pending posts: ${errorMessage}`);
        setIsLoading(false);
        return;
      }
      
      console.log("Found pending posts:", allPendingPosts?.length || 0);
      
      if (!allPendingPosts || allPendingPosts.length === 0) {
        setDebugInfo(`No pending posts found in the database. Total posts: ${allPosts?.length || 0}. 
          Status values: ${[...new Set(allPosts?.map(post => post.status) || [])].join(', ')}`);
        setPendingPosts([]);
        setIsLoading(false);
        return;
      }
      
      // Now get detailed data including user info
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          excerpt,
          content,
          cover_image,
          created_at,
          author_id,
          status
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pending posts details:", error);
        const errorMessage = error.message || JSON.stringify(error);
        setDebugInfo(`Error fetching post details: ${errorMessage}`);
        setIsLoading(false);
        return;
      }

      console.log("Fetched detailed pending posts:", data?.length || 0);
      
      if (!data || data.length === 0) {
        setPendingPosts([]);
        setIsLoading(false);
        return;
      }

      // Fetch user details for each post
      const postsWithUserDetails = await Promise.all(
        (data || []).map(async (post) => {
          try {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("full_name, email")
              .eq("id", post.author_id)
              .single();

            if (userError || !userData) {
              console.error("Error fetching user data for post:", post.id, userError);
              return {
                ...post,
                author: "Unknown Author",
                email: null,
              };
            }

            return {
              ...post,
              author: userData.full_name || userData.email || "Anonymous",
              email: userData.email,
            };
          } catch (err) {
            console.error("Error in user data processing:", err);
            return {
              ...post,
              author: "Unknown Author",
              email: null,
            };
          }
        })
      );

      console.log("Posts with user details:", postsWithUserDetails);
      setPendingPosts(postsWithUserDetails);
    } catch (err) {
      console.error("Error fetching pending posts:", err);
      setDebugInfo(`Error fetching pending posts: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    setTestingConnection(true);
    setDebugInfo("Testing Supabase connection...");
    
    try {
      // 1. Check that Supabase config is valid
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setDebugInfo("Missing Supabase URL or key in environment variables");
        setTestingConnection(false);
        return;
      }
      
      setDebugInfo(`URL: ${supabaseUrl.substring(0, 15)}...`);
      
      // 2. Try to access tables without aggregate functions
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id')
        .limit(1);
        
      if (postsError) {
        const errorMessage = postsError.message || JSON.stringify(postsError);
        setDebugInfo(`Posts table connection error: ${errorMessage}`);
        setTestingConnection(false);
        return;
      }
      
      // 3. Try users table without aggregate functions
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
        
      if (usersError) {
        const errorMessage = usersError.message || JSON.stringify(usersError);
        setDebugInfo(`Users table connection error: ${errorMessage}`);
        setTestingConnection(false);
        return;
      }
      
      setDebugInfo(`Connection successful! Found tables: posts, users`);
    } catch (err) {
      console.error("Connection test error:", err);
      setDebugInfo(`Connection test error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setTestingConnection(false);
    }
  };

  useEffect(() => {
    fetchPendingPosts()
  }, [])

  const handleApprovePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ status: "published" })
        .eq("id", id)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to approve story.",
          variant: "destructive",
        })
        return
      }

      setPendingPosts(pendingPosts.filter(post => post.id !== id))
      toast({
        title: "Success",
        description: "Story has been approved and published.",
      })
    } catch (error) {
      console.error("Error approving post:", error)
      toast({
        title: "Error",
        description: "Failed to approve story.",
        variant: "destructive",
      })
    }
  }

  const handleRejectPost = async (id: string) => {
    try {
      // Close the dialog
      setShowRejectDialog(false)
      
      const { error } = await supabase
        .from("posts")
        .update({ 
          status: "rejected",
          rejection_reason: rejectionReason || "Your submission did not meet our guidelines."
        })
        .eq("id", id)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to reject story.",
          variant: "destructive",
        })
        return
      }

      setPendingPosts(pendingPosts.filter(post => post.id !== id))
      setRejectionReason("")
      toast({
        title: "Success",
        description: "Story has been rejected.",
      })
    } catch (error) {
      console.error("Error rejecting post:", error)
      toast({
        title: "Error",
        description: "Failed to reject story.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete story.",
          variant: "destructive",
        });
        return;
      }

      setPendingPosts(pendingPosts.filter(post => post.id !== id));
      toast({
        title: "Success",
        description: "Story has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete story.",
        variant: "destructive",
      });
    }
  };

  const openRejectDialog = (post: any) => {
    setSelectedPost(post)
    setShowRejectDialog(true)
  }

  const openPreview = (post: any) => {
    setSelectedPost(post)
    setShowPreview(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Story Submissions</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testSupabaseConnection}
              disabled={testingConnection}
              className="flex items-center gap-1"
            >
              {testingConnection ? 
                <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-pink-600"></div> : 
                <RefreshCw className="h-4 w-4" />
              }
              Test Connection
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchPendingPosts}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {debugInfo && (
            <div className="mb-4 p-2 text-xs bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <p className="font-mono">{debugInfo}</p>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
            </div>
          ) : pendingPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No stories pending approval</p>
              {debugInfo && (
                <p className="mt-2 text-xs text-gray-400">{debugInfo}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md"
                >
                  <div className="mb-4 sm:mb-0">
                    <h3 className="font-medium">{post.title}</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openPreview(post)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                      onClick={() => handleApprovePost(post.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => openRejectDialog(post)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedPost?.title}</DialogTitle>
            <DialogDescription>
              Written by {selectedPost?.author} • {selectedPost?.created_at && new Date(selectedPost.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPost?.cover_image && (
            <div className="w-full rounded-md overflow-hidden my-4">
              <img
                src={selectedPost.cover_image}
                alt={selectedPost.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <div className="prose dark:prose-invert max-w-none mt-4" dangerouslySetInnerHTML={{ __html: selectedPost?.content }} />
          
          <DialogFooter className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                onClick={() => {
                  handleApprovePost(selectedPost.id)
                  setShowPreview(false)
                }}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  setShowPreview(false)
                  openRejectDialog(selectedPost)
                }}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button 
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                onClick={() => {
                  handleDeletePost(selectedPost.id)
                  setShowPreview(false)
                }}
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Story</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedPost?.title}". This feedback will be sent to the author.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide specific feedback to help the author understand why their story was rejected."
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleRejectPost(selectedPost?.id)}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

