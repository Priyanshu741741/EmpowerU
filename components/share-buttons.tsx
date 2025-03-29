"use client"

import { Facebook, Twitter, Linkedin, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export function ShareButtons({ title }: { title: string }) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "The link has been copied to your clipboard.",
    })
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Share this story</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() =>
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
              "_blank",
            )
          }
        >
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`,
              "_blank",
            )
          }
        >
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() =>
            window.open(
              `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}`,
              "_blank",
            )
          }
        >
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </Button>
        <Button variant="outline" size="sm" className="rounded-full" onClick={handleCopyLink}>
          <Link2 className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
      </div>
    </div>
  )
}

