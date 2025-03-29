import { Suspense } from "react"
import { PageTransition } from "@/components/page-transition"
import { PostGrid } from "@/components/post-grid"
import { getPosts } from "@/lib/posts"
import { CategoryFilter } from "@/components/category-filter"

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <PageTransition>
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">All Stories</h1>
          <div className="w-full max-w-3xl mx-auto h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-16"></div>

          <CategoryFilter />

          <Suspense fallback={<div>Loading posts...</div>}>
            <PostGrid posts={posts} />
          </Suspense>
        </div>
      </section>
    </PageTransition>
  )
}

