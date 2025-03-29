"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export default function AdminSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("general")
  
  // General settings
  const [siteName, setSiteName] = useState("EmpowerU")
  const [siteUrl, setSiteUrl] = useState("https://empoweru.vercel.app")
  const [adminEmail, setAdminEmail] = useState("admin@empoweru.com")
  
  // Content settings
  const [commentsEnabled, setCommentsEnabled] = useState(true)
  const [moderationEnabled, setModerationEnabled] = useState(true)
  const [maxPostsPerPage, setMaxPostsPerPage] = useState("10")
  
  // API settings
  const [apiKey, setApiKey] = useState("sk_test_••••••••••••••••••••••••••")
  const [webhookUrl, setWebhookUrl] = useState("")
  
  useEffect(() => {
    // Check authentication
    if (!isAdminAuthenticated(router)) {
      return
    }
    
    setIsLoading(false)
  }, [router])
  
  const handleSaveSettings = (settingType: string) => {
    toast({
      title: "Settings Saved",
      description: `${settingType} settings have been saved successfully.`,
    })
  }
  
  const handleGenerateApiKey = () => {
    // In a real app, we would call an API to generate a new key
    setApiKey("sk_live_" + Math.random().toString(36).substring(2, 15))
    toast({
      title: "API Key Generated",
      description: "A new API key has been generated. Keep it secure!",
    })
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
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic settings for your site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input 
                  id="site-name" 
                  value={siteName} 
                  onChange={(e) => setSiteName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-url">Site URL</Label>
                <Input 
                  id="site-url" 
                  value={siteUrl} 
                  onChange={(e) => setSiteUrl(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input 
                  id="admin-email" 
                  value={adminEmail} 
                  type="email"
                  onChange={(e) => setAdminEmail(e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("General")}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Environment</CardTitle>
              <CardDescription>View environment information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Environment:</span>
                <Badge variant="outline">Development</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Version:</span>
                <Badge variant="outline">1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Deployed:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
              <CardDescription>
                Configure how content is displayed and managed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="comments">Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable comments on posts.
                  </p>
                </div>
                <Switch
                  id="comments"
                  checked={commentsEnabled}
                  onCheckedChange={setCommentsEnabled}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="moderation">Content Moderation</Label>
                  <p className="text-sm text-muted-foreground">
                    Require approval before publishing posts.
                  </p>
                </div>
                <Switch
                  id="moderation"
                  checked={moderationEnabled}
                  onCheckedChange={setModerationEnabled}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="posts-per-page">Posts Per Page</Label>
                <Input 
                  id="posts-per-page" 
                  value={maxPostsPerPage} 
                  onChange={(e) => setMaxPostsPerPage(e.target.value)} 
                  type="number"
                  min="1"
                  max="50"
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of posts to display per page.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("Content")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Manage your API keys and webhooks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="api-key" 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)} 
                    type="password"
                    className="flex-1"
                  />
                  <Button onClick={handleGenerateApiKey}>Generate</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your API key is used to authenticate API requests.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input 
                  id="webhook-url" 
                  value={webhookUrl} 
                  onChange={(e) => setWebhookUrl(e.target.value)} 
                  placeholder="https://your-site.com/api/webhook"
                />
                <p className="text-sm text-muted-foreground">
                  URL to receive webhook notifications.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("API")}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Access documentation for the API.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive documentation for the API endpoints, authentication, and usage examples.
              </p>
              <Button variant="outline" className="w-full" onClick={() => 
                toast({
                  title: "API Documentation",
                  description: "Documentation not available in demo mode."
                })
              }>
                View Documentation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 