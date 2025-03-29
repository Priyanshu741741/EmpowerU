"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Edit, 
  Trash, 
  Mail, 
  Shield, 
  ShieldOff 
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export default function AdminUsersPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication
    if (!isAdminAuthenticated(router)) {
      return
    }
    
    // Fetch users data from Supabase
    const fetchUsers = async () => {
      try {
        console.log("Fetching users from Supabase...")
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error("Error fetching users:", error)
          setConnectionError(error.message)
          toast({
            title: "Error",
            description: "Failed to load users.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
        
        console.log("Supabase users data:", data)
        
        if (!data || data.length === 0) {
          // If no users exist yet, set empty array
          console.log("No users found in Supabase")
          setUsers([])
          setIsLoading(false)
          return
        }
        
        setUsers(data)
      } catch (err) {
        console.error("Error in fetchUsers:", err)
        setConnectionError(err instanceof Error ? err.message : String(err))
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUsers()
  }, [router])

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    (user.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.role || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error("Error deleting user:", error)
        toast({
          title: "Error",
          description: "Failed to delete user.",
          variant: "destructive",
        })
        return
      }
      
      setUsers(users.filter(user => user.id !== id))
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
    } catch (err) {
      console.error("Error in handleDeleteUser:", err)
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      })
    }
  }

  const handlePromoteToAdmin = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', id)
      
      if (error) {
        console.error("Error promoting user:", error)
        toast({
          title: "Error",
          description: "Failed to promote user.",
          variant: "destructive",
        })
        return
      }
      
      // Update user role in the local state
      setUsers(users.map(user => 
        user.id === id ? { ...user, role: 'admin' } : user
      ))
      
      toast({
        title: "Success",
        description: "User promoted to admin.",
      })
    } catch (err) {
      console.error("Error in handlePromoteToAdmin:", err)
      toast({
        title: "Error",
        description: "Failed to promote user.",
        variant: "destructive",
      })
    }
  }

  const handleDemoteToWriter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'writer' })
        .eq('id', id)
      
      if (error) {
        console.error("Error demoting user:", error)
        toast({
          title: "Error",
          description: "Failed to demote user.",
          variant: "destructive",
        })
        return
      }
      
      // Update user role in the local state
      setUsers(users.map(user => 
        user.id === id ? { ...user, role: 'writer' } : user
      ))
      
      toast({
        title: "Success",
        description: "User demoted to writer.",
      })
    } catch (err) {
      console.error("Error in handleDemoteToWriter:", err)
      toast({
        title: "Error",
        description: "Failed to demote user.",
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
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
            onClick={() => toast({
              title: "Info", 
              description: "User creation is currently disabled in the demo."
            })}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            New User
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
        {users.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No users found</p>
            <Button 
              className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
              onClick={() => toast({
                title: "Info", 
                description: "User creation is currently disabled in the demo."
              })}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create First User
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead className="w-[250px]">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || "Unknown"}
                    </TableCell>
                    <TableCell>{user.email || "No email"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                      >
                        {user.role || "user"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.created_at 
                        ? new Date(user.created_at).toLocaleDateString() 
                        : "Unknown"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            toast({
                              title: "Info",
                              description: `Would email ${user.email || "the user"}`
                            })
                          }}>
                            <Mail className="mr-2 h-4 w-4" />
                            Email User
                          </DropdownMenuItem>
                          
                          {user.role !== "admin" && (
                            <DropdownMenuItem onClick={() => handlePromoteToAdmin(user.id)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Promote to Admin
                            </DropdownMenuItem>
                          )}
                          
                          {user.role === "admin" && (
                            <DropdownMenuItem onClick={() => handleDemoteToWriter(user.id)}>
                              <ShieldOff className="mr-2 h-4 w-4" />
                              Demote to Writer
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem onClick={() => {
                            toast({
                              title: "Info",
                              description: "User editing is currently disabled in the demo."
                            })
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete User
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
    </div>
  )
} 