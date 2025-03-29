"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Facebook, Twitter, Linkedin } from "lucide-react"
import type { TeamMember as TeamMemberType } from "@/lib/types"

export function TeamMember({ member }: { member: TeamMemberType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-64 w-full">
        <Image
          src={member.avatar || "/placeholder.svg"}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
        <p className="text-pink-600 dark:text-pink-400 mb-4">{member.role}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{member.bio}</p>

        <div className="flex space-x-4">
          {member.socialLinks.facebook && (
            <a
              href={member.socialLinks.facebook}
              className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
          )}
          {member.socialLinks.twitter && (
            <a
              href={member.socialLinks.twitter}
              className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          )}
          {member.socialLinks.linkedin && (
            <a
              href={member.socialLinks.linkedin}
              className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

