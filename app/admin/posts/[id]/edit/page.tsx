"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { PageTransition } from "@/components/page-transition"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"
import { Editor } from "@/components/editor"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export default function AdminEditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const postId = params.id
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState("")
  const [existingCoverImage, setExistingCoverImage] = useState("")
  const [authorId, setAuthorId] = useState("")
  const [authors, setAuthors] = useState<any[]>([])

  useEffect(() => {
    // Check if user is already authenticated
    if (!isAdminAuthenticated(router)) {
      return
    }
    
    setIsAuthenticated(true)
    
    const fetchData = async () => {
      try {
        // Fetch post data
        console.log("Fetching post data for ID:", postId)
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            excerpt,
            content,
            status,
            category,
            cover_image,
            author_id,
            created_at
          `)
          .eq('id', postId)
          .single()
          
        if (postError) {
          console.error("Error fetching post:", postError)
          toast({
            title: "Error",
            description: "Failed to load post data.",
            variant: "destructive",
          })
          router.push('/admin/posts')
          return
        }
        
        console.log("Post data:", postData)
        if (postData) {
          setTitle(postData.title || "")
          setExcerpt(postData.excerpt || "")
          setContent(postData.content || "")
          setCategory(postData.category || "")
          setStatus(postData.status || "draft")
          setAuthorId(postData.author_id || "")
          setExistingCoverImage(postData.cover_image || "")
          if (postData.cover_image) {
            setCoverImagePreview(postData.cover_image)
          }
        }
        
        // Fetch authors
        console.log("Fetching authors...")
        const { data: authorsData, error: authorsError } = await supabase
          .from('users')
          .select('id, full_name, role')
          .in('role', ['writer', 'admin'])
          
        if (authorsError) {
          console.error("Error fetching authors:", authorsError)
        } else {
          console.log("Authors:", authorsData)
          setAuthors(authorsData || [])
        }
      } catch (err) {
        console.error("Error in fetchData:", err)
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [postId, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImage(file)
      setCoverImagePreview(URL.createObjectURL(file))
    }
  }

  const updatePost = async (newStatus?: string) => {
    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a title for your post.",
        variant: "destructive",
      })
      return
    }

    if (!authorId) {
      toast({
        title: "Error",
        description: "Please select an author for the post.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const updatedStatus = newStatus || status
      console.log("Updating post with status:", updatedStatus)
      
      // Upload image if changed
      let imageUrl = existingCoverImage
      if (coverImage) {
        console.log("Uploading new cover image...")
        const fileExt = coverImage.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `${authorId}/${fileName}`
        
        const { error: uploadError } = await supabase
          .storage
          .from('post-images')
          .upload(filePath, coverImage)
        
        if (uploadError) {
          console.error("Error uploading image:", uploadError)
          throw uploadError
        }
        
        // Get public URL
        const { data } = supabase
          .storage
          .from('post-images')
          .getPublicUrl(filePath)
        
        imageUrl = data.publicUrl
        console.log("Image uploaded, URL:", imageUrl)
      }
      
      // Update post in database
      console.log("Updating post in database...")
      const { data, error } = await supabase
        .from('posts')
        .update({
          title,
          excerpt,
          content,
          category,
          cover_image: imageUrl,
          author_id: authorId,
          status: updatedStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .select()
      
      if (error) {
        console.error("Error updating post:", error)
        throw error
      }
      
      console.log("Post updated successfully:", data)
      
      let successMessage = "Post updated successfully."
      if (newStatus === 'published' && status !== 'published') {
        successMessage = "Post published successfully."
      } else if (newStatus === 'draft' && status !== 'draft') {
        successMessage = "Post saved as draft."
      }
      
      toast({
        title: "Success",
        description: successMessage,
      })
      
      router.push("/admin/posts")
    } catch (error) {
      console.error("Error in updatePost:", error)
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDraft = () => updatePost('draft')
  const handlePublish = () => updatePost('published')
  const handleUpdate = () => updatePost()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <PageTransition>
      <DashboardShell>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Edit Post</h1>
          </div>
          <div className="flex items-center gap-2">
            {status !== 'draft' && (
              <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save as Draft"
                )}
              </Button>
            )}
            
            {status !== 'published' && (
              <Button
                onClick={handlePublish}
                disabled={isSaving}
                className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish"
                )}
              </Button>
            )}
            
            <Button
              onClick={handleUpdate}
              disabled={isSaving}
              className={status === 'published' 
                ? "bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600" 
                : ""}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (optional)</Label>
              <Textarea
                id="excerpt"
                placeholder="A short summary of your post"
                className="min-h-[100px]"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="mb-2">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="mt-0">
                  <Card>
                    <CardContent className="p-4">
                      <Editor
                        value={content}
                        onChange={(value) => setContent(value)}
                        placeholder="Write your post content here..."
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="preview" className="mt-0">
                  <Card>
                    <CardContent className="p-4 prose dark:prose-invert max-w-none">
                      {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                      ) : (
                        <p className="text-gray-500">Nothing to preview.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Select value={authorId} onValueChange={setAuthorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover-image">Cover Image (optional)</Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-4 cursor-pointer relative overflow-hidden" onClick={() => document.getElementById('cover-image-input')?.click()}>
                    {coverImagePreview ? (
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center">
                          Click to select an image <br />
                          <span className="text-xs">JPG, PNG, GIF up to 10MB</span>
                        </p>
                      </div>
                    )}
                    <input
                      id="cover-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  {coverImagePreview && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCoverImage(null)
                        setCoverImagePreview("")
                        setExistingCoverImage("")
                      }}
                      className="mt-2 w-full"
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    </PageTransition>
  )
} 