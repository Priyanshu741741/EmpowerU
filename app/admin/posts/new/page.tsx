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

export default function AdminNewPostPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("draft")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState("")
  const [authorId, setAuthorId] = useState("")
  const [authors, setAuthors] = useState<any[]>([])

  useEffect(() => {
    // Check if user is already authenticated
    if (!isAdminAuthenticated(router)) {
      return
    }
    
    setIsAuthenticated(true)
    
    // Fetch authors (users with writer role)
    const fetchAuthors = async () => {
      try {
        console.log("Fetching authors...")
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, role')
          .in('role', ['writer', 'admin'])
          
        if (error) {
          console.error("Error fetching authors:", error)
          return
        }
        
        console.log("Authors:", data)
        setAuthors(data || [])
        // Default to the first author if available
        if (data && data.length > 0) {
          setAuthorId(data[0].id)
        }
      } catch (err) {
        console.error("Error in fetchAuthors:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAuthors()
  }, [router, supabase])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImage(file)
      setCoverImagePreview(URL.createObjectURL(file))
    }
  }

  const savePost = async (postStatus: string) => {
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
      console.log("Saving post with status:", postStatus)
      // Upload image if exists
      let imageUrl = null
      if (coverImage) {
        console.log("Uploading cover image...")
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
      
      // Save post to database
      console.log("Saving post to database...")
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title,
          excerpt,
          content,
          category,
          cover_image: imageUrl,
          author_id: authorId,
          status: postStatus
        })
        .select()
      
      if (error) {
        console.error("Error saving post:", error)
        throw error
      }
      
      console.log("Post saved successfully:", data)
      toast({
        title: "Success",
        description: postStatus === 'published' 
          ? "Post published successfully." 
          : "Post saved as draft.",
      })
      
      router.push("/admin/posts")
    } catch (error) {
      console.error("Error in savePost:", error)
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDraft = () => savePost('draft')
  const handlePublish = () => savePost('published')

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
            <h1 className="text-3xl font-bold">Create New Post</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Draft"
              )}
            </Button>
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