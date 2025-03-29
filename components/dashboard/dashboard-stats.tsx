"use client"

import { motion } from "framer-motion"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardStatsProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  description: string
}

export function DashboardStats({ title, value, change, trend, description }: DashboardStatsProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <div className="flex items-baseline mt-1">
              <p className="text-3xl font-bold">{value}</p>
              <div
                className={`ml-2 flex items-center text-sm ${
                  trend === "up"
                    ? "text-green-600 dark:text-green-400"
                    : trend === "down"
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {trend === "up" ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : trend === "down" ? (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                ) : null}
                {change}
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

