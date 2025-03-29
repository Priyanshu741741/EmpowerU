import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-xl mb-4 text-pink-600 dark:text-pink-400">EmpowerU</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-xl">
              A community dedicated to empowering people through stories, resources, and connection.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/wecpec_"
                className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/women-empowerment-cell-pec"
                className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="md:text-right">
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p className="flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-pink-600 dark:text-pink-400" /> by WEC
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} WEC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

