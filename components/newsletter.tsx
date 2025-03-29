"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      })
      setEmail("")
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Subscribe to our newsletter and stay updated with the latest stories, events, and resources.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full bg-white dark:bg-gray-900"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our team.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

