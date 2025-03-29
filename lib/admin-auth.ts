// Simple admin authentication utilities
// In a real app, this would be implemented with proper authentication

// Define a generic router type that matches both Next.js App Router and Pages Router
type RouterLike = {
  push: (url: string) => void | Promise<boolean>
}

export const TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours
export const ADMIN_USERNAME = "admin"
export const ADMIN_PASSWORD = "password"

export function createAdminToken(): string {
  // Create a token with expiry
  const tokenData = {
    token: `admin-${Date.now()}-${Math.random().toString(36).substring(2)}`,
    expiry: new Date().getTime() + TOKEN_EXPIRY
  }
  
  // Store in localStorage
  localStorage.setItem("admin_auth_token", JSON.stringify(tokenData))
  localStorage.setItem("admin_authenticated", "true")
  
  return tokenData.token
}

export function clearAdminToken(): void {
  localStorage.removeItem("admin_auth_token")
  localStorage.removeItem("admin_authenticated")
}

export function checkAdminAuth(router?: RouterLike): boolean {
  // Check if we're running on the client side
  if (typeof window === 'undefined') {
    return false; // Return false when running on the server
  }

  try {
    const tokenData = localStorage.getItem("admin_auth_token")
    
    if (!tokenData) {
      console.log("No admin token found")
      if (router) router.push('/admin/login')
      return false
    }
    
    const { token, expiry } = JSON.parse(tokenData)
    
    // Check if token is valid and not expired
    if (token && expiry && new Date().getTime() < expiry) {
      console.log("Admin token valid, authenticated")
      return true
    }

    console.log("Admin token expired")
    clearAdminToken()
    if (router) router.push('/admin/login')
    return false
  } catch (err) {
    console.error("Error parsing auth token:", err)
    clearAdminToken()
    if (router) router.push('/admin/login')
    return false
  }
}

// Fallback check that also uses the old authentication method
export function isAdminAuthenticated(router?: RouterLike): boolean {
  // Check if we're running on the client side
  if (typeof window === 'undefined') {
    return false; // Return false when running on the server
  }

  try {
    // First check the new token format
    const newAuthValid = checkAdminAuth(undefined) // Don't pass router to avoid redirect loops
    
    // If that fails, try the old format as fallback
    const oldAuthValid = localStorage.getItem("admin_authenticated") === "true"
    
    const isValid = newAuthValid || oldAuthValid
    
    if (!isValid && router) {
      router.push('/admin/login')
    }
    
    return isValid
  } catch (error) {
    console.error("Error checking authentication:", error);
    if (router) {
      router.push('/admin/login')
    }
    return false;
  }
} 