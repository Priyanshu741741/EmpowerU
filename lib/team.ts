import type { TeamMember } from "./types"

// Mock data for team members
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Founder & President",
    bio: "Sarah founded Empower Her with a vision to create a supportive community for women from all walks of life.",
    avatar: "/placeholder.svg?height=400&width=300",
    socialLinks: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "2",
    name: "Maya Rodriguez",
    role: "Vice President",
    bio: "Maya brings her experience in community organizing to help expand our club's reach and impact.",
    avatar: "/placeholder.svg?height=400&width=300",
    socialLinks: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "3",
    name: "Jessica Chen",
    role: "Content Director",
    bio: "Jessica oversees our blog and ensures we share diverse and empowering stories from our community.",
    avatar: "/placeholder.svg?height=400&width=300",
    socialLinks: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "4",
    name: "Amina Hassan",
    role: "Events Coordinator",
    bio: "Amina organizes our workshops, networking events, and annual conference with creativity and precision.",
    avatar: "/placeholder.svg?height=400&width=300",
    socialLinks: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "5",
    name: "Olivia Taylor",
    role: "Mentorship Program Lead",
    bio: "Olivia connects mentors and mentees, creating valuable relationships that help women advance in their careers.",
    avatar: "/placeholder.svg?height=400&width=300",
    socialLinks: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "6",
    name: "Priya Patel",
    role: "Outreach Coordinator",
    bio: "Priya builds partnerships with organizations that share our mission of empowering women in our community.",
    avatar: "/placeholder.svg?height=400&width=300",
    socialLinks: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
]

export async function getTeamMembers(): Promise<TeamMember[]> {
  // In a real app, this would fetch from a database or API
  return teamMembers
}

