import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

const WORK_EXPERIENCE_DATABASE_ID = "ce4d8010-744e-4fc7-90d5-f1ca4e481955"

export async function GET() {
  try {
    console.log("Fetching work experience from Notion...")
    console.log("Database ID:", WORK_EXPERIENCE_DATABASE_ID)
    console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

    // First, get database schema to check available properties
    let sortProperty = null
    try {
      const database = await notion.databases.retrieve({
        database_id: WORK_EXPERIENCE_DATABASE_ID,
      })

      console.log("Available properties:", Object.keys(database.properties))

      // Try to find a suitable sort property (date-related)
      const possibleSortProperties = [
        "Due date",
        "date",
        "Date",
        "Employment Period",
        "Tenure",
        "Created",
        "Created time",
        "Date created",
        "Created at",
        "Last edited time",
      ]

      for (const propName of possibleSortProperties) {
        if (database.properties[propName]) {
          sortProperty = propName
          console.log(`Using sort property: ${propName}`)
          break
        }
      }
    } catch (schemaError) {
      console.warn("Could not retrieve database schema:", schemaError)
    }

    // Query the Notion database for work experience
    const queryOptions: any = {
      database_id: WORK_EXPERIENCE_DATABASE_ID,
    }

    // Only add sorting if we found a valid property
    if (sortProperty) {
      queryOptions.sorts = [
        {
          property: sortProperty,
          direction: "descending",
        },
      ]
    } else {
      console.log("No suitable sort property found, using default order")
    }

    const response = await notion.databases.query(queryOptions)

    console.log("Notion response received, processing results...")

    // Transform Notion data to your expected format
    const workExperience = response.results.map((page: any) => {
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

      return {
        id: page.id,
        title,
        company,
        location,
        startDate,
        endDate,
        tenure,
        link,
        emoji: "💎", // Default emoji, you can add this as a property in Notion if needed
        year,
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
