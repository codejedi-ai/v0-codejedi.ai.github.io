import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { corsResponse, handleOptions } from "@/lib/cors"
import { Client } from "@notionhq/client"
import { readCache, writeCache } from "@/lib/file-cache"

const SIDE_PROJECTS_DATABASE_ID = "8845d571-4240-4f4d-9e67-e54f552c4e2e"

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}

// Helper function to fetch and process projects from Notion using SDK (no filters)
async function fetchProjectsFromNotion() {
  console.log("Fetching projects from Notion using SDK (no filters)...")
  console.log("Database ID:", SIDE_PROJECTS_DATABASE_ID)
  const apiKey = process.env.NOTION_INTEGRATION_SECRET || process.env.NOTION_API_KEY
  if (!apiKey) throw new Error("NOTION_API_KEY/NOTION_INTEGRATION_SECRET is not configured")

  const notion = new Client({ auth: apiKey })
  const data = await (notion as any).databases.query({ database_id: SIDE_PROJECTS_DATABASE_ID })

  console.log(`Notion response received: ${data.results.length} pages found`)

  // Helper to normalize URLs: ensure absolute with protocol
  const normalizeUrl = (url: string | undefined | null): string => {
    if (!url) return "#"
    const trimmed = String(url).trim()
    if (!trimmed || trimmed === "#" || trimmed === "/") return "#"
    const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)
    return hasScheme ? trimmed : `https://${trimmed}`
  }

  // Helper to retrieve a URL from Notion properties with case/spacing variants
  const getUrlProperty = (
    props: Record<string, { url?: string; rich_text?: Array<{ plain_text: string }>; plain_text?: string; title?: Array<{ plain_text: string }> } | undefined>,
    candidates: string[],
  ): string | undefined => {
    // Helper to extract a URL-like string from a property value regardless of type
    const extract = (val: { url?: string; rich_text?: Array<{ plain_text: string }>; plain_text?: string; title?: Array<{ plain_text: string }> } | undefined): string | undefined => {
      if (!val) return undefined
      const fromUrl = val.url
      const fromRichText = val.rich_text?.[0]?.plain_text
      const fromPlain = val.plain_text
      const fromTitle = val.title?.[0]?.plain_text
      return fromUrl || fromRichText || fromPlain || fromTitle
    }

    // Try direct matches first (as-is and lowercased)
    for (const name of candidates) {
      const directVal = extract(props[name])
      if (directVal) return directVal
      const lowerVal = extract(props[name.toLowerCase()])
      if (lowerVal) return lowerVal
    }
    // Fallback: normalize keys by removing spaces/underscores/hyphens and compare case-insensitively
    const norm = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, "")
    const candidateNorms = candidates.map(norm)
    for (const [key, value] of Object.entries(props)) {
      const keyNorm = norm(key)
      if (candidateNorms.includes(keyNorm)) {
        const candidateVal = extract(value)
        if (candidateVal) return candidateVal
      }
    }
    return undefined
  }

  // Transform Notion data to your expected format
    const projects = await Promise.all(
      data.results.map(async (page: { id: string; properties: Record<string, unknown>; cover?: { type: string; external?: { url: string }; file?: { url: string } } | null; icon?: { type?: string; emoji?: string; file?: { url: string }; external?: { url: string } } | null }, index: number) => {
        console.log(`Processing page ${index + 1}/${data.results.length}: ${page.id}`)

        const properties = page.properties as Record<string, {
          title?: Array<{ plain_text: string }>
          rich_text?: Array<{ plain_text: string }>
          plain_text?: string
          multi_select?: Array<{ name: string }>
          url?: string
          checkbox?: boolean
          files?: Array<{ file?: { url: string }; external?: { url: string } }>
        }>

        console.log("Available page properties:", Object.keys(properties))
        console.log("Page cover:", page.cover)

        // Extract basic properties - try multiple possible property names
        const title =
          properties.Title?.title?.[0]?.plain_text ||
          properties.title?.title?.[0]?.plain_text ||
          properties.Name?.title?.[0]?.plain_text ||
          (properties["Project Name"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ||
          "Untitled Project"

        console.log(`Project title: "${title}"`)

        // Description can be either rich_text or plain_text type
        const description =
          properties.Description?.rich_text?.[0]?.plain_text ||
          properties.Description?.plain_text ||
          properties.Summary?.rich_text?.[0]?.plain_text ||
          properties.About?.rich_text?.[0]?.plain_text ||
          ""

        console.log(`Project description: "${description}"`)

        // Long description no longer fetched from blocks for performance; use description
        const longDescription = description || ""

        // Extract tags (project type) - keep the old Tags field
        const tags =
          properties.Tags?.multi_select?.map((tag: { name: string }) => tag.name) ||
          []

        // Extract tech (technologies used) - new Tech field
        const tech =
          properties.Tech?.multi_select?.map((techItem: { name: string }) => techItem.name) ||
          properties.Technologies?.multi_select?.map((techItem: { name: string }) => techItem.name) ||
          properties.Skills?.multi_select?.map((techItem: { name: string }) => techItem.name) ||
          []

        console.log(`Project tags (type): [${tags.join(", ")}]`)
        console.log(`Project tech: [${tech.join(", ")}]`)

        const rawLink =
          getUrlProperty(properties as unknown as Record<string, { url?: string }>, [
            "Link",
            "URL",
            "Live URL",
            "Demo URL",
          ]) || "#"

        const rawGithub =
          getUrlProperty(properties as unknown as Record<string, { url?: string }>, [
            "GitHub",
            "github",
            "GitHub URL",
            "Source Code",
            "Repository",
          ]) || "#"

        const link = normalizeUrl(rawLink)
        const github = normalizeUrl(rawGithub)

        const featured =
          properties.Featured?.checkbox || properties.Highlight?.checkbox || properties.Important?.checkbox || false
        
        const technical =
          properties.Technical?.checkbox || false

        // Extract cover image from page cover property (PRIORITY)
        let image = "/placeholder.svg"

        // First priority: Page cover image
        if (page.cover) {
          if (page.cover.type === "external" && page.cover.external?.url) {
            image = page.cover.external.url
            console.log(`✅ External cover image found: ${image}`)
          } else if (page.cover.type === "file" && page.cover.file?.url) {
            image = page.cover.file.url
            console.log(`✅ File cover image found: ${image}`)
          }
        }

        // Second priority: Image property as fallback only if no cover
        if (image === "/placeholder.svg") {
          const imageProperty =
            properties.Image?.files?.[0]?.file?.url ||
            properties.Image?.files?.[0]?.external?.url ||
            properties.Screenshot?.files?.[0]?.file?.url ||
            properties.Preview?.files?.[0]?.file?.url ||
            properties.Cover?.files?.[0]?.file?.url

          if (imageProperty) {
            image = imageProperty
            console.log(`📎 Image property fallback found: ${image}`)
          } else {
            console.log(`⚠️ No image found for project "${title}", using placeholder`)
          }
        }

        // Get page emoji/icon
        const pageIcon = page.icon?.emoji || page.icon?.file?.url || page.icon?.external?.url || null
        const iconType = page.icon?.type || null // "emoji", "file", or "external"

        console.log(`🖼️ Final project "${title}" image: ${image}, Icon: ${pageIcon ? "✅ " + pageIcon : "❌ None"}`)

        return {
          id: page.id,
          title,
          description,
          longDescription,
          image,
          tags,
          tech,
          link,
          github,
          featured,
          technical,
          // Page icon/emoji
          icon: pageIcon,
          iconType: iconType,
        }
      }),
    )

  console.log(`Successfully processed ${projects.length} projects from Notion`)

  // Log each project for debugging
  projects.forEach((project: any, index: number) => {
    console.log(
      `Project ${index + 1}: "${project.title}" - ${project.tags.length} tags - Featured: ${project.featured}`,
    )
  })

  return projects
}

export async function GET(request: NextRequest) {
  try {
    // Local file cache first
    const ttlMs = 5 * 60 * 1000 // 5 minutes
    const cacheKey = "projects"
    const cachedProjects = await readCache<any[]>(cacheKey, ttlMs).catch(() => null)
    if (cachedProjects && Array.isArray(cachedProjects)) {
      const res = corsResponse({ projects: cachedProjects }, 200, request)
      res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=86400")
      return res
    }

    const projects = await fetchProjectsFromNotion()
    await writeCache(cacheKey, projects)
    const res = corsResponse({ projects }, 200, request)
    res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=86400")
    return res
  } catch (error) {
    console.error("Error fetching projects from Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    })

    // Return error response instead of fallback data
    return corsResponse(
      {
        error: "Failed to fetch projects from Notion",
        details: error instanceof Error ? error.message : "Unknown error",
        projects: [], // Return empty array instead of fallback
      },
      500,
      request
    )
  }
}

// POST removed: the public API is GET-only for retrieval
