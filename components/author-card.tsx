import Image from "next/image"
import Link from "next/link"
import type { Author } from "@/lib/types"

export function AuthorCard({ authors }: { authors: Author[] }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-16">
      <h3 className="text-lg font-medium mb-4">About the {authors.length > 1 ? "Authors" : "Author"}</h3>
      <div className="space-y-6">
        {authors.map((author) => (
          <div key={author.id} className="flex gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={author.avatar || "/placeholder.svg"}
                alt={author.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <h4 className="font-medium">{author.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{author.role}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{author.bio}</p>
              <Link
                href={`/author/${author.id}`}
                className="text-sm font-medium text-pink-600 dark:text-pink-400 hover:underline"
              >
                View all posts by {author.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

