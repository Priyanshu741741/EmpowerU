"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, Settings, Menu, X } from "lucide-react"
import Footer from "@/components/footer"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Navigation links
  const navItems = [
    { title: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { title: "Posts", href: "/admin/posts", icon: <FileText className="w-5 h-5 mr-3" /> },
    { title: "Users", href: "/admin/users", icon: <Users className="w-5 h-5 mr-3" /> },
    { title: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5 mr-3" /> }
  ]

  const isActive = (path: string) => {
    return pathname === path || 
           (path !== '/admin' && pathname.startsWith(path))
  }
  
  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login'

  if (!mounted) {
    return null
  }

  // If we're on the login page, just render the content without the admin layout
  if (isLoginPage) {
    return children
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative mt-16 md:mt-20">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed p-2 bg-pink-600 text-white rounded-md top-20 left-4 z-30 lg:hidden"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar - positioned below the fixed header */}
      <div
        className={`fixed top-16 md:top-20 bottom-0 left-0 z-20 w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <Link href="/" className="flex items-center mb-8">
            <Image 
              src="/WecxLogo-removebg-preview.png"
              alt="WecxLogo"
              width={55}
              height={55}
              className="mr-2"
            />
            <span className="text-2xl md:text-3xl font-bold text-pink-600 dark:text-pink-500">
              Admin Panel
            </span>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-md ${
                  isActive(item.href)
                    ? "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content - positioned below the fixed header with correct margin for sidebar */}
      <div className="ml-0 lg:ml-64 p-6 md:p-8 w-full bg-gray-50 dark:bg-gray-900">
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 