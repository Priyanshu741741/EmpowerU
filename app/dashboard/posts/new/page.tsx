"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function NewPostPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState("")

  useEffect(() => {
    // Here you would add your Supabase auth check
    // const checkUser = async () => {
    //   const { data: { session } } = await supabase.auth.getSession()
    //   if (!session) {
    //     router.push('/auth/login')
    //     return
    //   }
    //   setUser(session.user)
    //   setIsLoading(false)
    // }
    // checkUser()

    // Simulate auth check
    setTimeout(() => {
      // Mock user data
      setUser({
        id: "123",
        email: "writer@example.com",
        user_metadata: {
          role: "writer",
          name: "Jessica Chen",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      })
      setIsLoading(false)
    }, 1000)
  }, [router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImage(file)
      setCoverImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSaveDraft = async () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a title for your post.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Here you would add your Supabase storage and database code
      // // Upload image if exists
      // let imageUrl = null
      // if (coverImage) {
      //   const { data: imageData, error: imageError } = await supabase
      //     .storage
      //     .from('post-images')
      //     .upload(`${user.id}/${Date.now()}-${coverImage.name}`, coverImage)
      //
      //   if (imageError) throw imageError
      //
      //   // Get public URL
      //   const { data: { publicUrl } } = supabase
      //     .storage
      //     .from('post-images')
      //     .getPublicUrl(imageData.path)
      //
      //   imageUrl = publicUrl
      // }
      //
      // // Save post to database
      // const { error } = await supabase
      //   .from('posts')
      //   .insert({
      //     title,
      //     excerpt,
      //     content,
      //     category,
      //     cover_image: imageUrl,
      //     author_id: user.id,
      //     status: 'draft'
      //   })
      //
      // if (error) throw error

      // Simulate saving
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Post saved as draft.",
        })
        router.push("/dashboard/posts")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      })
      setIsSaving(false)
    }
  }

  const handleSubmitForReview = async () => {
    if (!title || !content || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (title, content, category).",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Here you would add your Supabase storage and database code
      // // Upload image if exists
      // let imageUrl = null
      // if (coverImage) {
      //   const { data: imageData, error: imageError } = await supabase
      //     .storage
      //     .from('post-images')
      //     .upload(`${user.id}/${Date.now()}-${coverImage.name}`, coverImage)
      //
      //   if (imageError) throw imageError
      //
      //   // Get public URL
      //   const { data: { publicUrl } } = supabase
      //     .storage
      //     .from('post-images')
      //     .getPublicUrl(imageData.path)
      //
      //   imageUrl = publicUrl
      // }
      //
      // // Save post to database
      // const { error } = await supabase
      //   .from('posts')
      //   .insert({
      //     title,
      //     excerpt,
      //     content,
      //     category,
      //     cover_image: imageUrl,
      //     author_id: user.id,
      //     status: 'pending'
      //   })
      //
      // if (error) throw error

      // Simulate saving
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Post submitted for review.",
        })
        router.push("/dashboard/posts")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit post. Please try again.",
        variant: "destructive",
      })
      setIsSaving(false)
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
              onClick={handleSubmitForReview}
              disabled={isSaving}
              className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Review"
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
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                placeholder="Brief summary of your post"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Tabs defaultValue="write">
                <TabsList className="mb-2">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                  <Editor value={content} onChange={setContent} placeholder="Write your post content here..." />
                </TabsContent>
                <TabsContent value="preview">
                  <Card>
                    <CardContent className="p-4">
                      {content ? (
                        <div
                          className="prose prose-pink max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">Nothing to preview</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="career">Career Development</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="stories">Personal Stories</SelectItem>
                  <SelectItem value="advocacy">Advocacy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <Card className="border-dashed">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  {coverImagePreview ? (
                    <div className="relative w-full aspect-[16/9] mb-4">
                      <img
                        src={coverImagePreview || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setCoverImage(null)
                          setCoverImagePreview("")
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop or click to upload</p>
                    </div>
                  )}

                  <Input
                    type="file"
                    id="cover-image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Label
                    htmlFor="cover-image"
                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 py-2 px-4"
                  >
                    {coverImagePreview ? "Change Image" : "Select Image"}
                  </Label>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardShell>
    </PageTransition>
  )
}

