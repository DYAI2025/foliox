"use client"

import { Button } from "@/components/ui/button"
import type { NormalizedProfile } from "@/types/github"

interface PortfolioFooterProps {
  profile: NormalizedProfile
}

export function PortfolioFooter({ profile }: PortfolioFooterProps) {
  return (
    <footer className="border-t border-border mt-16 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center gap-6">
          {profile.email && (
            <Button
              size="default"
              variant="outline"
              asChild
              className="border-border"
            >
              <a href={`mailto:${profile.email}`}>
                Get in touch
              </a>
            </Button>
          )}
          
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Available for select projects
          </p>

          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  )
}

