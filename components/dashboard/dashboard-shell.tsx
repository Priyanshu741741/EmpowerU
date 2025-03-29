"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, FileText, Users, Settings, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Posts", href: "/dashboard/posts", icon: FileText },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <aside
        className={`hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/dashboard" className="font-bold text-xl text-pink-600 dark:text-pink-400">
            EmpowerU
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href || pathname?.startsWith(`${item.href}/`)
                    ? "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    pathname === item.href || pathname?.startsWith(`${item.href}/`)
                      ? "text-pink-600 dark:text-pink-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Mobile sidebar */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-950 flex flex-col">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
              <Link href="/admin" className="font-bold text-xl text-pink-600 dark:text-pink-400">
                EmpowerU
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1 py-4">
              <nav className="space-y-1 px-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href || pathname?.startsWith(`${item.href}/`)
                        ? "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        pathname === item.href || pathname?.startsWith(`${item.href}/`)
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="flex items-center lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}

