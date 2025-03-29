// Client-side environment variable checker
import React from 'react'

// Check if running in browser environment
export function checkEnvironmentVariables(): { 
  isValid: boolean; 
  errors: string[] 
} {
  if (typeof window === 'undefined') {
    // Not running in browser, skip check
    return { isValid: true, errors: [] }
  }
  
  const errors: string[] = []
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  }
  
  // Log environment variables for debugging
  console.log('Environment variables check:')
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set')
  console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '[Key exists]' : 'Not set')
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

// This should be used inside a client component
export function EnvErrorDisplay(): React.ReactElement | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  const { isValid, errors } = checkEnvironmentVariables()
  
  if (isValid) {
    return null
  }
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded-md">
      <p className="font-medium">Environment Variable Error</p>
      <ul className="list-disc pl-5 mt-2">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
      <p className="mt-2 text-sm">
        Please make sure you&apos;ve set up your environment variables correctly.
      </p>
    </div>
  )
} 