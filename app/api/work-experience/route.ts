import { NextResponse } from "next/server"

export const revalidate = false

// Allow overriding via env; fallback to known ID
const WORK_EXPERIENCE_DATABASE_ID =
  process.env.WORK_EXPERIENCE_DATABASE_ID || "ce4d8010-744e-4fc7-90d5-f1ca4e481955"

export async function GET() {
  try {
    console.log("Fetching work experience from Notion using REST API...")
    console.log("Database ID:", WORK_EXPERIENCE_DATABASE_ID)
    if (!process.env.WORK_EXPERIENCE_DATABASE_ID) {
      console.log("WORK_EXPERIENCE_DATABASE_ID env not set — using fallback constant")
    }
    console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

    if (!process.env.NOTION_INTEGRATION_SECRET) {
      throw new Error("NOTION_INTEGRATION_SECRET is not configured")
    }

    // Query the Notion database using REST API
    const response = await fetch(`https://api.notion.com/v1/databases/${WORK_EXPERIENCE_DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_INTEGRATION_SECRET}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Notion API error:", response.status, errorText)
      throw new Error(`Notion API returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()

    console.log("Notion response received, processing results...")

    // Transform Notion data to your expected format
    const workExperience = data.results.map((page: any) => {
      const properties = page.properties

      console.log("Processing page properties:", Object.keys(properties))

      // Extract data based on your schema with flexible property names
      const title =
        properties.title?.title?.[0]?.plain_text ||
        properties.Title?.title?.[0]?.plain_text ||
        properties["Job Title"]?.title?.[0]?.plain_text ||
        properties.Position?.title?.[0]?.plain_text ||
        ""

      const company =
        properties.company?.rich_text?.[0]?.plain_text ||
        properties.Company?.rich_text?.[0]?.plain_text ||
        properties["Company Name"]?.rich_text?.[0]?.plain_text ||
        ""

      const location =
        properties.location?.rich_text?.[0]?.plain_text ||
        properties.Location?.rich_text?.[0]?.plain_text ||
        properties["Work Location"]?.rich_text?.[0]?.plain_text ||
        ""

      const link =
        properties.link?.url || properties.Link?.url || properties["Company URL"]?.url || properties.Website?.url || ""

      // Handle date property with multiple possible names
      const dateRange =
        properties["Due date"]?.date ||
        properties.date?.date ||
        properties.Date?.date ||
        properties["Employment Period"]?.date ||
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

    console.log(`Successfully processed ${workExperience.length} work experience entries`)
    return NextResponse.json({ workExperience }, { status: 200 })
  } catch (error) {
    console.error("Error fetching work experience from Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
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
    return NextResponse.json({ workExperience: fallbackData }, { status: 200 })
  }
}
