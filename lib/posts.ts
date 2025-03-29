import type { Post } from "./types"
import { supabase } from "./supabase"

// Mock data for posts, used as fallback if Supabase connection fails
const mockPosts: Post[] = [
  {
    id: "1",
    title: "Breaking the Glass Ceiling: Women Leaders in Tech",
    slug: "breaking-glass-ceiling-women-leaders-tech",
    excerpt:
      "Explore the journeys of women who have shattered barriers in the tech industry and their advice for aspiring leaders.",
    content:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><h2>The Journey Begins</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p>",
    coverImage: "/placeholder.svg?height=600&width=800",
    date: "2023-05-28",
    readingTime: 5,
    category: "leadership",
    authors: [
      {
        id: "1",
        name: "Jessica Chen",
        role: "Tech Executive",
        bio: "Jessica is a tech executive with over 15 years of experience in the industry.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "2",
    title: "Finding Your Voice: Public Speaking for Women",
    slug: "finding-your-voice-public-speaking-women",
    excerpt: "Practical tips and strategies to help women overcome anxiety and excel in public speaking opportunities.",
    content:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><h2>Overcoming Fear</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p>",
    coverImage: "/placeholder.svg?height=600&width=800",
    date: "2023-05-25",
    readingTime: 4,
    category: "career",
    authors: [
      {
        id: "2",
        name: "Maya Johnson",
        role: "Communication Coach",
        bio: "Maya helps women find their authentic voice and communicate with confidence.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "3",
    title: "Self-Care Isn't Selfish: Prioritizing Mental Health",
    slug: "self-care-isnt-selfish-prioritizing-mental-health",
    excerpt:
      "Why taking care of your mental health is essential for success and how to incorporate self-care into your busy schedule.",
    content:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><h2>Making Time for Yourself</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p>",
    coverImage: "/placeholder.svg?height=600&width=800",
    date: "2023-05-20",
    readingTime: 6,
    category: "wellness",
    authors: [
      {
        id: "3",
        name: "Dr. Sarah Williams",
        role: "Psychologist",
        bio: "Dr. Williams specializes in women's mental health and work-life balance.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "4",
    title: "My Journey from Refugee to CEO",
    slug: "journey-from-refugee-to-ceo",
    excerpt:
      "A personal story of resilience, determination, and the power of education in transforming one woman's life.",
    content:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><h2>Early Challenges</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p>",
    coverImage: "/placeholder.svg?height=600&width=800",
    date: "2023-05-15",
    readingTime: 8,
    category: "stories",
    authors: [
      {
        id: "4",
        name: "Amina Hassan",
        role: "CEO & Founder",
        bio: "Amina founded her company after overcoming significant personal challenges as a refugee. She now advocates for immigrant women in business.",
      },
    ],
  },
  {
    id: "5",
    title: "Advocating for Equal Pay: What You Need to Know",
    slug: "advocating-equal-pay-what-to-know",
    excerpt:
      "Understanding the gender pay gap and practical strategies for negotiating fair compensation in your workplace.",
    content:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><h2>The Data Behind the Gap</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p>",
    coverImage: "/placeholder.svg?height=600&width=800",
    date: "2023-05-10",
    readingTime: 7,
    category: "advocacy",
    authors: [
      {
        id: "5",
        name: "Elena Rodriguez",
        role: "Labor Rights Attorney",
        bio: "Elena specializes in gender discrimination cases and advocates for workplace equality.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "6",
    title: "Balancing Motherhood and Career: Real Stories",
    slug: "balancing-motherhood-career-real-stories",
    excerpt:
      "Women share their experiences navigating the challenges and joys of being working mothers in different industries.",
    content:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><h2>Finding Support Systems</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p>",
    coverImage: "/placeholder.svg?height=600&width=800",
    date: "2023-05-05",
    readingTime: 6,
    category: "stories",
    authors: [
      {
        id: "6",
        name: "Olivia Taylor",
        role: "Work-Life Balance Coach",
        bio: "Olivia helps working mothers find balance and fulfillment in their personal and professional lives.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "7",
        name: "Sophia Kim",
        role: "HR Director",
        bio: "Sophia advocates for family-friendly workplace policies and flexible work arrangements.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "7",
    title: "Financial Independence: Investment Strategies for Women",
    slug: "financial-independence-investment-strategies-women",
    excerpt:
      "Essential financial literacy and investment tips to help women build wealth and secure their financial future.",
    content:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p><h2>Starting Your Investment Journey</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.</p>",
    coverImage: "/placeholder.svg?height=600&width=800",
    date: "2023-04-28",
    readingTime: 5,
    category: "career",
    authors: [
      {
        id: "8",
        name: "Priya Patel",
        role: "Financial Advisor",
        bio: "Priya specializes in helping women achieve financial independence through smart investment strategies.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
]

export async function getPosts(): Promise<Post[]> {
  try {
    // Fetch published posts from Supabase
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        created_at,
        category,
        users (
          id,
          full_name,
          role,
          bio,
          avatar_url
        )
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching posts:", error)
      return mockPosts // Return mock data as fallback
    }

    // Transform data to match the Post type
    const posts: Post[] = data.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug || slugify(post.title),
      excerpt: post.excerpt || `${post.content.substring(0, 150)}...`,
      content: post.content,
      coverImage: post.cover_image || "/placeholder.svg?height=600&width=800",
      date: new Date(post.created_at).toISOString().split("T")[0],
      readingTime: calculateReadingTime(post.content),
      category: post.category || "general",
      authors: [
        {
          id: post.users?.id || "anonymous",
          name: post.users?.full_name || "Anonymous Author",
          role: post.users?.role || "Writer",
          bio: post.users?.bio || "Community contributor",
          avatar: post.users?.avatar_url || "/placeholder.svg?height=100&width=100",
        },
      ],
    }))

    return posts
  } catch (err) {
    console.error("Error in getPosts:", err)
    return mockPosts // Return mock data as fallback
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    // Fetch a specific post by slug
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        created_at,
        category,
        users (
          id,
          full_name,
          role,
          bio,
          avatar_url
        )
      `)
      .eq("slug", slug)
      .eq("status", "published")
      .single()

    if (error || !data) {
      console.error("Error fetching post by slug:", error)
      // Look in mock data
      return mockPosts.find((post) => post.slug === slug)
    }

    // Transform data to match the Post type
    const post: Post = {
      id: data.id,
      title: data.title,
      slug: data.slug || slugify(data.title),
      excerpt: data.excerpt || `${data.content.substring(0, 150)}...`,
      content: data.content,
      coverImage: data.cover_image || "/placeholder.svg?height=600&width=800",
      date: new Date(data.created_at).toISOString().split("T")[0],
      readingTime: calculateReadingTime(data.content),
      category: data.category || "general",
      authors: [
        {
          id: data.users?.id || "anonymous",
          name: data.users?.full_name || "Anonymous Author",
          role: data.users?.role || "Writer",
          bio: data.users?.bio || "Community contributor",
          avatar: data.users?.avatar_url || "/placeholder.svg?height=100&width=100",
        },
      ],
    }

    return post
  } catch (err) {
    console.error("Error in getPostBySlug:", err)
    return mockPosts.find((post) => post.slug === slug) // Return from mock data as fallback
  }
}

export async function getRelatedPosts(currentPostId: string, category: string): Promise<Post[]> {
  try {
    // Fetch related posts from Supabase
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        created_at,
        category,
        users (
          id,
          full_name,
          role,
          bio,
          avatar_url
        )
      `)
      .eq("status", "published")
      .eq("category", category)
      .neq("id", currentPostId)
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error("Error fetching related posts:", error)
      // Return related posts from mock data as fallback
      return mockPosts.filter((post) => post.id !== currentPostId && post.category === category).slice(0, 3)
    }

    // Transform data to match the Post type
    const posts: Post[] = data.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug || slugify(post.title),
      excerpt: post.excerpt || `${post.content.substring(0, 150)}...`,
      content: post.content,
      coverImage: post.cover_image || "/placeholder.svg?height=600&width=800",
      date: new Date(post.created_at).toISOString().split("T")[0],
      readingTime: calculateReadingTime(post.content),
      category: post.category || "general",
      authors: [
        {
          id: post.users?.id || "anonymous",
          name: post.users?.full_name || "Anonymous Author",
          role: post.users?.role || "Writer",
          bio: post.users?.bio || "Community contributor",
          avatar: post.users?.avatar_url || "/placeholder.svg?height=100&width=100",
        },
      ],
    }))

    return posts
  } catch (err) {
    console.error("Error in getRelatedPosts:", err)
    // Return related posts from mock data as fallback
    return mockPosts.filter((post) => post.id !== currentPostId && post.category === category).slice(0, 3)
  }
}

// Utility functions
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

