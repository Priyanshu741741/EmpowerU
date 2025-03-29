"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const categories = [
  { id: "all", name: "All" },
  { id: "leadership", name: "Leadership" },
  { id: "career", name: "Career Development" },
  { id: "wellness", name: "Wellness" },
  { id: "stories", name: "Personal Stories" },
  { id: "advocacy", name: "Advocacy" },
]

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      router.push("/blog")
    } else {
      router.push(`/blog?category=${categoryId}`)
    }
  }

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={currentCategory === category.id ? "default" : "outline"}
            className={`rounded-full ${
              currentCategory === category.id
                ? "bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
                : "border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-950"
            }`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.name}
            {currentCategory === category.id && (
              <motion.span
                layoutId="category-indicator"
                className="absolute inset-0 rounded-full"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

