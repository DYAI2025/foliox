import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Topbar } from "@/components/portfolio/topbar"
import { HeroSection } from "@/components/portfolio/hero-section"
import { CapabilitiesSection } from "@/components/portfolio/capabilities-section"
import { WorkGallery } from "@/components/portfolio/work-gallery"
import { ContributionGraph } from "@/components/portfolio/contribution-graph"
import { MetricsSection } from "@/components/portfolio/metrics-section"
import { PortfolioFooter } from "@/components/portfolio/footer"
import type { PortfolioData } from "@/types/portfolio"
import { createAPIClient } from "@/lib/utils/api-client"

interface PageProps {
  params: Promise<{ username: string }>
}

async function fetchPortfolioData(username: string): Promise<PortfolioData | null> {
  const apiKey = process.env.API_KEYS?.split(",")[0] || ""
  const client = createAPIClient(apiKey)
  
  return client.getFullPortfolio(username, { revalidate: 3600 })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const data = await fetchPortfolioData(username)

  if (!data) {
    return {
      title: "Portfolio Not Found",
      description: "The requested portfolio could not be found.",
    }
  }

  return {
    title: data.seo?.title || `${data.profile.name || username} - Developer Portfolio`,
    description: data.seo?.description || data.profile.bio || `Check out ${username}'s developer portfolio`,
    keywords: data.seo?.keywords || [],
    openGraph: {
      title: data.seo?.title || `${data.profile.name || username} - Developer Portfolio`,
      description: data.seo?.description || data.profile.bio || "",
      images: [data.profile.avatar_url],
    },
    twitter: {
      card: "summary_large_image",
      title: data.seo?.title || `${data.profile.name || username} - Developer Portfolio`,
      description: data.seo?.description || data.profile.bio || "",
      images: [data.profile.avatar_url],
    },
  }
}

export default async function PortfolioPage({ params }: PageProps) {
  const { username } = await params
  const data = await fetchPortfolioData(username)

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Topbar profile={data.profile} />

      <main className="container mx-auto px-4 max-w-6xl">
        <HeroSection profile={data.profile} about={data.about} />
        
        <CapabilitiesSection about={data.about} />
        
        {data.profile.metrics && (
          <MetricsSection 
            metrics={data.profile.metrics} 
            publicRepos={data.profile.public_repos}
            followers={data.profile.followers}
          />
        )}
        
        <WorkGallery projects={data.projects} />
        
        {data.projects && data.projects.featured.length > 0 && (
          <ContributionGraph username={username} />
        )}
      </main>

      <PortfolioFooter profile={data.profile} />
    </div>
  )
}

