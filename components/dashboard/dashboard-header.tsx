"use client"

import React from "react"
import { Separator } from "@/components/ui/separator"

export interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({
  heading,
  text,
  children
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">{heading}</h1>
          {text && <p className="text-muted-foreground">{text}</p>}
        </div>
        {children}
      </div>
      <Separator />
    </div>
  )
}

