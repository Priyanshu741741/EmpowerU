"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Upload, Image } from "lucide-react"
import { SuccessDialog } from "@/components/success-dialog"

export default function JoinPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !content || !name || !email || !image) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload an image.",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("name", name)
      formData.append("email", email)
      formData.append("bio", bio)
      if (image) {
        formData.append("image", image)
      }
      
      const response = await fetch("/api/stories/submit", {
        method: "POST",
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error("Failed to submit story")
      }
      
      // Show success dialog instead of toast and redirect
      setShowSuccessDialog(true)
      
      // Clear form after successful submission
      setTitle("")
      setContent("")
      setName("")
      setEmail("")
      setBio("")
      setImage(null)
      setImagePreview(null)
    } catch (error) {
      console.error("Error submitting story:", error)
      toast({
        title: "Error",
        description: "Failed to submit your story. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">Share Your Story</h1>
          <div className="w-full max-w-3xl mx-auto h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-8" />
          
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Write Your Own Story</CardTitle>
                <CardDescription>
                  Your story can inspire others. Share your experience and make a difference.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Story Title</Label>
                    <Input 
                      id="title"
                      placeholder="Enter a compelling title for your story"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Story</Label>
                    <Textarea 
                      id="content"
                      placeholder="Share your experience, journey, or message..."
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6">
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      
                      {imagePreview ? (
                        <div className="relative w-full max-w-md">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-auto rounded-md"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImage(null)
                              setImagePreview(null)
                            }}
                          >
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <label
                          htmlFor="image"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Image className="w-16 h-16 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">
                            Click to upload an image
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </label>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Short Bio (Optional)</Label>
                    <Textarea 
                      id="bio"
                      placeholder="Tell us a little about yourself"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Your Story
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <SuccessDialog 
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title="Thank You for Sharing Your Story!"
        description="Your story has been submitted successfully and will be reviewed by our team. We appreciate your contribution to our community!"
        buttonText="Return to Home"
        redirectPath="/"
      />
    </PageTransition>
  )
} 