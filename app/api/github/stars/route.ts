import { NextResponse } from "next/server"
import { Settings } from "@/lib/config/settings"
import { createCachedFunction } from "@/lib/utils/cache"

const REPO_OWNER = "kartiklabhshetwar"
const REPO_NAME = "foliox"
const CACHE_TTL = 300

async function fetchGitHubStars(): Promise<number> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  }

  if (Settings.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${Settings.GITHUB_TOKEN}`
  }

  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
    {
      headers,
      next: { revalidate: CACHE_TTL },
    }
  )

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error")
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText} - ${errorText}`
    )
  }

  const data = await response.json()
  const stars = typeof data.stargazers_count === "number" ? data.stargazers_count : 0
  return stars
}

function getCachedStars() {
  const cachedFn = createCachedFunction(
    () => fetchGitHubStars(),
    ["github_stars", REPO_OWNER, REPO_NAME],
    {
      ttl: CACHE_TTL,
      tags: ["github_stars", `repo:${REPO_OWNER}/${REPO_NAME}`],
    }
  )
  return cachedFn()
}

export async function GET() {
  try {
    const stars = await getCachedStars()
    return NextResponse.json({ stars }, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    if (Settings.DEBUG) {
      console.error("Failed to fetch GitHub stars:", errorMessage)
    }

    return NextResponse.json({ stars: 0 }, { status: 200 })
  }
}

