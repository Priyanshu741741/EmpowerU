import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/page-transition"
import { FeaturedPost } from "@/components/featured-post"
import { PostGrid } from "@/components/post-grid"
import { Newsletter } from "@/components/newsletter"
import { AnimatedHeading } from "@/components/animated-heading"
import { AnimatedBackground } from "@/components/animated-background"
import { getPosts } from "@/lib/posts"
import Footer from "@/components/footer"

export default async function HomePage() {
  const posts = await getPosts()
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1, 7)

  return (
    <PageTransition>
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <AnimatedBackground />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <AnimatedHeading
            title="EmpowerU"
            subtitle="Stories, resources, and community to inspire and empower people around the world."
          />

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
            >
              <Link href="/join">
                Publish
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-950"
            >
              <Link href="/blog">Explore</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Featured Story</h2>
          <Suspense fallback={<div>Loading featured post...</div>}>
            <FeaturedPost post={featuredPost} />
          </Suspense>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">Recent Stories</h2>
            <Button asChild variant="ghost" className="text-pink-600 dark:text-pink-400">
              <Link href="/blog">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Suspense fallback={<div>Loading posts...</div>}>
            <PostGrid posts={recentPosts} />
          </Suspense>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </PageTransition>
  )
}

