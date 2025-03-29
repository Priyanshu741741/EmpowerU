"use client"

import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { ADMIN_USERNAME, ADMIN_PASSWORD, createAdminToken, isAdminAuthenticated } from "@/lib/admin-auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  useEffect(() => {
    // Check if we're running on the client
    if (typeof window === 'undefined') {
      return;
    }

    // Debug log - showing we're on the login page
    console.log("Admin login page loaded");

    // Check if already authenticated
    const checkAuth = () => {
      try {
        if (isAdminAuthenticated()) {
          router.push('/admin');
          return;
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Simple authentication - in production, use proper auth with API
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try {
        createAdminToken();
        setLoginError("");
        
        toast({
          title: "Login Successful",
          description: "Welcome to the Admin Panel",
        });
        
        router.push('/admin');
      } catch (error) {
        console.error("Error creating token:", error);
        setLoginError("Authentication error occurred");
      }
    } else {
      setLoginError("Invalid username or password");
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] pt-16 flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink-600 dark:text-pink-500">Admin</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to access the admin panel</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Use admin / password for demo access</p>
        </div>
      </div>
    </div>
  )
} 