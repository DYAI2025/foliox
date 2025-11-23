"use client"

import { Button } from "@/components/ui/button"
import { FaArrowLeft } from "react-icons/fa"
import Link from "next/link"
import type { NormalizedProfile } from "@/types/github"

interface TopbarProps {
  profile: NormalizedProfile
}

export function Topbar({ profile }: TopbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <FaArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            {profile.name || profile.username}
          </div>
        </div>
      </div>
    </nav>
  )
}

