import { createClient } from '@supabase/supabase-js'

// Default URL and key for development when env vars are missing
const DEFAULT_SUPABASE_URL = 'https://osvhpquyijykncwsxhum.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdmhwcXV5aWp5a25jd3N4aHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDk5MjMsImV4cCI6MjA1ODU4NTkyM30.4YEZee9ZnF3-0Q5ivrYVvs4TpsR_2REGK_oJi8WwZTo'

// Check for environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

// Log to help debug
if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl === DEFAULT_SUPABASE_URL ? 'Using default URL' : 'Using env URL')
  console.log('Supabase Key:', supabaseAnonKey === DEFAULT_SUPABASE_ANON_KEY ? 'Using default key' : 'Using env key')
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

// Test the connection
if (typeof window !== 'undefined') {
  // Only run in browser environment
  supabase.from('posts').select('count()', { count: 'exact', head: true })
    .then(({ error }) => {
      if (error) {
        console.warn('Supabase connection test failed:', error)
      } else {
        console.log('Supabase connection successfully established')
      }
    })
}

export type UserRole = 'admin' | 'writer'
export type PostStatus = 'draft' | 'pending' | 'published' | 'rejected'

export interface User {
  id: string
  role: UserRole
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  title: string
  content: string
  author_id: string
  status: PostStatus
  category: string | null
  featured: boolean
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

