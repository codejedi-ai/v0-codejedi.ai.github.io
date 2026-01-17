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

    // Return error response
    return NextResponse.json(
      {
        error: "Failed to fetch work experience from Notion",
        details: error instanceof Error ? error.message : "Unknown error",
        workExperience: [],
      },
      { status: 500 }
    )
  }
}
