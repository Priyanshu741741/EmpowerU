import Image from "next/image"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/page-transition"
import { ShareButtons } from "@/components/share-buttons"
import { getPostBySlug, getPosts } from "@/lib/posts"

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <PageTransition>
      <article className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-8" asChild>
            <a href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all stories
            </a>
          </Button>

          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{format(new Date(post.date), "MMMM d, yyyy")}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="mb-10 flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Written by </span>
                <span className="font-medium">
                  {post.authors.map((author, index) => (
                    <span key={index}>
                      {author.name}
                      {index < post.authors.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            <div className="relative w-full aspect-[16/9] mb-10 rounded-xl overflow-hidden">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>

            <div
              className="prose prose-lg dark:prose-invert max-w-none mb-16"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mb-16">
              <ShareButtons title={post.title} />
            </div>
          </div>
        </div>
      </article>
    </PageTransition>
  )
}

