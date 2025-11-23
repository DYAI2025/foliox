"use client"

import React from "react"
import { GitHubCalendar } from "react-github-calendar"
import { Card, CardContent } from "@/components/ui/card"

interface ContributionGraphProps {
  username: string
  data?: unknown
}

export function ContributionGraph({ username }: ContributionGraphProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const theme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  }

  if (!mounted) {
    return (
      <section className="w-full py-12 border-b border-border">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Contributions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              GitHub activity over the past year
            </p>
          </div>
          <Card className="border-border">
            <CardContent className="p-8">
              <div className="w-full h-[160px] bg-muted/50" />
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 border-b border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Contributions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            GitHub activity over the past year
          </p>
        </div>
        <Card className="border-border">
          <CardContent className="p-8">
            <div className="w-full overflow-x-auto">
              <GitHubCalendar
                username={username}
                fontSize={11}
                blockSize={11}
                blockMargin={3}
                showWeekdayLabels={true}
                colorScheme="light"
                theme={{
                  light: theme.light,
                  dark: theme.dark,
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#ebedf0] dark:bg-[#161b22]" />
                <div className="w-2.5 h-2.5 rounded-sm bg-[#9be9a8] dark:bg-[#0e4429]" />
                <div className="w-2.5 h-2.5 rounded-sm bg-[#40c463] dark:bg-[#006d32]" />
                <div className="w-2.5 h-2.5 rounded-sm bg-[#30a14e] dark:bg-[#26a641]" />
                <div className="w-2.5 h-2.5 rounded-sm bg-[#216e39] dark:bg-[#39d353]" />
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

