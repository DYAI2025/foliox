import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FaCodeBranch, FaCodePullRequest, FaCode, FaCircle, FaFolder, FaUsers } from "react-icons/fa6"
import type { GitHubMetrics } from "@/types/github"

interface MetricsSectionProps {
  metrics?: GitHubMetrics | null
  publicRepos: number
  followers: number
}

export function MetricsSection({ metrics, publicRepos, followers }: MetricsSectionProps) {
  if (!metrics) return null

  const statCards = [
    {
      label: "PRs Merged",
      value: metrics.prs_merged.toLocaleString(),
      icon: FaCodeBranch,
      color: "text-green-600",
    },
    {
      label: "Open PRs",
      value: metrics.prs_open.toLocaleString(),
      icon: FaCodePullRequest,
      color: "text-blue-600",
    },
    {
      label: "Total Contributions",
      value: metrics.total_contributions.toLocaleString(),
      icon: FaCode,
      color: "text-purple-600",
    },
    {
      label: "Issues Opened",
      value: metrics.issues_opened.toLocaleString(),
      icon: FaCircle,
      color: "text-orange-600",
    },
    {
      label: "Repositories",
      value: publicRepos.toLocaleString(),
      icon: FaFolder,
      color: "text-indigo-600",
    },
    {
      label: "Followers",
      value: followers.toLocaleString(),
      icon: FaUsers,
      color: "text-pink-600",
    },
  ]

  return (
    <section className="w-full py-16 border-b border-border">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight">Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
        </div>
      </div>
    </section>
  )
}

