import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa"
import type { ProjectsData } from "@/types/github"

interface WorkGalleryProps {
  projects?: ProjectsData
}

export function WorkGallery({ projects }: WorkGalleryProps) {
  if (!projects || projects.featured.length === 0) return null

  return (
    <section className="w-full py-16 border-b border-border">
      <div className="space-y-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground">
            {projects.total_stars} stars · {projects.total_repos} repos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.featured.slice(0, 6).map((project) => (
            <Card key={project.name} className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {project.description}
                  </p>
                )}
                {project.ai_summary && (
                  <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
                    {project.ai_summary}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {project.language && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-foreground" />
                      <span>{project.language}</span>
                    </div>
                  )}
                  <span>{project.stars} stars</span>
                  <span>{project.forks} forks</span>
                </div>

                {project.languages && Object.keys(project.languages).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(project.languages)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([lang]) => (
                        <Badge key={lang} variant="outline" className="text-xs font-normal">
                          {lang}
                        </Badge>
                      ))}
                  </div>
                )}

                {project.topics && project.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.topics.slice(0, 4).map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs font-normal">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <FaGithub className="h-3.5 w-3.5 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  {project.homepage && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt className="h-3.5 w-3.5 mr-2" />
                        Live
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.languages && Object.keys(projects.languages).length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(projects.languages)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 12)
                  .map(([lang]) => (
                    <Badge key={lang} variant="secondary" className="font-normal">
                      {lang}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}

