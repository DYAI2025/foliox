import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AboutData } from "@/types/github"

interface CapabilitiesSectionProps {
  about?: AboutData | null
}

export function CapabilitiesSection({ about }: CapabilitiesSectionProps) {
  if (!about) return null

  return (
    <section className="w-full py-16 border-b border-border">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">About</h2>
          {about.summary && (
            <p className="text-foreground/80 leading-relaxed">
              {about.summary}
            </p>
          )}
        </div>

        {about.highlights && about.highlights.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Highlights</h3>
            <ul className="space-y-2">
              {about.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-foreground mt-1.5">—</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {about.skills && about.skills.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {about.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

