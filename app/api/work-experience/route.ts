import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { corsResponse, handleOptions } from "@/lib/cors"
import { unstable_cache } from "next/cache"
import { Client } from "@notionhq/client"

const WORK_EXPERIENCE_DATABASE_ID = "ce4d8010-744e-4fc7-90d5-f1ca4e481955"

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}

// Helper function to fetch and process work experience from Notion
async function fetchWorkExperienceFromNotion() {
  console.log("Fetching work experience from Notion using SDK...")
  console.log("Database ID:", WORK_EXPERIENCE_DATABASE_ID)
  const apiKey = process.env.NOTION_INTEGRATION_SECRET || process.env.NOTION_API_KEY
  if (!apiKey) throw new Error("NOTION_API_KEY/NOTION_INTEGRATION_SECRET is not configured")
  const notion = new Client({ auth: apiKey })
  const data = await notion.databases.query({ database_id: WORK_EXPERIENCE_DATABASE_ID })

  console.log(`Notion response received: ${data.results.length} pages found`)

  // Transform Notion data to your expected format
  const workExperience = data.results.map((page: { id: string; properties: Record<string, unknown>; icon?: { type?: string; emoji?: string; file?: { url: string }; external?: { url: string } } | null }, index: number) => {
    console.log(`Processing work experience ${index + 1}/${data.results.length}: ${page.id}`)
    const properties = page.properties as Record<string, {
      title?: Array<{ plain_text: string }>
      rich_text?: Array<{ plain_text: string }>
      url?: string
      date?: { start: string; end?: string }
      number?: number
    }>

    console.log("Available work experience properties:", Object.keys(properties))

    // Extract data based on your schema with flexible property names
    const title =
      properties.title?.title?.[0]?.plain_text ||
      properties.Title?.title?.[0]?.plain_text ||
      (properties["Job Title"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ||
      properties.Position?.title?.[0]?.plain_text ||
      ""

    console.log(`Work experience title: "${title}"`)

    const company =
      properties.company?.rich_text?.[0]?.plain_text ||
      properties.Company?.rich_text?.[0]?.plain_text ||
      (properties["Company Name"] as { rich_text?: Array<{ plain_text: string }> })?.rich_text?.[0]?.plain_text ||
      ""

    const location =
      properties.location?.rich_text?.[0]?.plain_text ||
      properties.Location?.rich_text?.[0]?.plain_text ||
      (properties["Work Location"] as { rich_text?: Array<{ plain_text: string }> })?.rich_text?.[0]?.plain_text ||
      ""

    const link =
      properties.link?.url || properties.Link?.url || (properties["Company URL"] as { url?: string })?.url || properties.Website?.url || ""

    // Handle date property with multiple possible names
    const dateRange =
      (properties["Due date"] as { date?: { start: string; end?: string } })?.date ||
      properties.date?.date ||
      properties.Date?.date ||
      (properties["Employment Period"] as { date?: { start: string; end?: string } })?.date ||
      properties.Tenure?.date ||
      null

    const tenure =
      properties.tenure?.number ||
      properties.Tenure?.number ||
      properties.Duration?.number ||
      properties.Length?.number ||
      0

    // Calculate year from date - handle both start/end dates and single dates
    const startDate = dateRange?.start || ""
    const endDate = dateRange?.end || dateRange?.start || "" // Use start date if no end date
    const year = startDate ? new Date(startDate).getFullYear().toString() : ""

    // Get page emoji/icon
    const pageIcon = page.icon?.emoji || page.icon?.file?.url || page.icon?.external?.url || null
    const iconType = page.icon?.type || null // "emoji", "file", or "external"
    const emoji = pageIcon || "💎" // Use page icon or default emoji

    console.log(`💼 Final work experience "${title}" at ${company} - ${year}`)

    return {
      id: page.id,
      title,
      company,
      location,
      startDate,
      endDate,
      tenure,
      link,
      emoji: emoji,
      year,
      // Page icon/emoji details
      icon: pageIcon,
      iconType: iconType,
    }
  })

  console.log(`Successfully processed ${workExperience.length} work experience entries from Notion`)

  // Log each work experience for debugging
  workExperience.forEach((exp, index) => {
    console.log(
      `Work Experience ${index + 1}: "${exp.title}" at ${exp.company} - ${exp.year}`,
    )
  })

  return workExperience
}

export async function GET(request: NextRequest) {
  try {
    const cached = unstable_cache(
      () => fetchWorkExperienceFromNotion(),
      ["work-experience"],
      { revalidate: 300, tags: ["work-experience"] }
    )
    const workExperience = await cached()
    const res = corsResponse({ workExperience }, 200, request)
    res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=86400")
    return res
  } catch (error) {
    console.error("Error fetching work experience from Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    })

    // Fallback to hardcoded data if Notion fails
    const fallbackData = [
      {
        id: "opentext-2024",
        title: "Software Developer Intern - DevOps (Hybrid)",
        company: "Open Text Corporation",
        location: "Ottawa, ON, Canada",
        startDate: "2024-09-03",
        endDate: "2024-12-20",
        tenure: 108,
        link: "https://www.opentext.com/",
        emoji: "💎",
        year: "2024",
      },
      {
        id: "sunlife-2024",
        title: "Cloud Engineer Intern (Remote)",
        company: "Sun Life Financial",
        location: "Toronto, ON, Canada",
        startDate: "2024-05-06",
        endDate: "2024-08-30",
        tenure: 116,
        link: "https://www.sunlife.ca",
        emoji: "💎",
        year: "2024",
      },
      {
        id: "oanda-2023",
        title: "Site Reliability Engineer Intern (Remote)",
        company: "OANDA (Canada) Corporation.",
        location: "Toronto, ON, Canada",
        startDate: "2023-01-09",
        endDate: "2023-04-21",
        tenure: 102,
        link: "https://oanda.com",
        emoji: "💎",
        year: "2023",
      },
      {
        id: "carta-2022",
        title: "Site Reliability Engineer Intern (Hybrid)",
        company: "Carta Maple Technologies Inc.",
        location: "Waterloo, ON, Canada",
        startDate: "2022-05-02",
        endDate: "2022-08-26",
        tenure: 116,
        link: "https://carta.com",
        emoji: "💎",
        year: "2022",
      },
      {
        id: "virtamove-2021",
        title: "Software Development Co-op Student (Remote)",
        company: "VirtaMove Corp.",
        location: "Ottawa, ON, Canada",
        startDate: "2021-05-06",
        endDate: "2021-08-27",
        tenure: 113,
        link: "https://www.virtamove.com",
        emoji: "💎",
        year: "2021",
      },
    ]

    console.log("Using fallback work experience data")
    return corsResponse({ workExperience: fallbackData }, 200, request)
  }
}

// POST removed: GET-only API using Notion SDK
