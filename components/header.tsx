"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
  { name: "Admin", path: "/admin" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center font-bold text-xl md:text-3xl text-pink-600 dark:text-pink-400">
            <Image 
              src="/WecxLogo-removebg-preview.png"
              alt="WecxLogo"
              width={60}
              height={60}
              className="mr-2"
            />
            EmpowerU
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-md text-md md:text-lg font-medium transition-colors ${
                  pathname === item.path
                    ? "text-pink-600 dark:text-pink-400"
                    : "text-gray-700 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400"
                }`}
              >
                {item.name}
                {pathname === item.path && (
                  <motion.div
                    className="h-0.5 bg-pink-600 dark:bg-pink-400 mt-0.5"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />

            <Button
              asChild
              className="hidden md:flex rounded-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600 text-md md:text-lg px-6"
            >
              <Link href="/join">Publish</Link>
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <Link
                href="/"
                className="flex items-center font-bold text-xl md:text-2xl text-pink-600 dark:text-pink-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Image 
                  src="/WecxLogo-removebg-preview.png"
                  alt="WecxLogo"
                  width={55}
                  height={55}
                  className="mr-2"
                />
                EmpowerU
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            <nav className="flex flex-col p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-3 text-xl font-medium ${
                    pathname === item.path ? "text-pink-600 dark:text-pink-400" : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                asChild
                className="mt-4 rounded-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600 text-lg py-6"
              >
                <Link href="/join" onClick={() => setIsMobileMenuOpen(false)}>
                  Publish
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

