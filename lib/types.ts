export type Author = {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
}

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  date: string
  readingTime: number
  category: string
  authors: Author[]
}

export type TeamMember = {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  socialLinks: {
    facebook?: string
    twitter?: string
    linkedin?: string
  }
}

