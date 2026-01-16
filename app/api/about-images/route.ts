import { NextResponse } from "next/server"

const ABOUT_IMAGES_DATABASE_ID = "c8c11443-ac59-4f07-899a-1c0604751414"

export async function GET() {
  try {
    console.log("Fetching about images from Notion using REST API...")
    console.log("Database ID:", ABOUT_IMAGES_DATABASE_ID)
    console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

    if (!process.env.NOTION_INTEGRATION_SECRET) {
      throw new Error("NOTION_INTEGRATION_SECRET is not configured")
    }

    // Query the Notion database using REST API
    const response = await fetch(`https://api.notion.com/v1/databases/${ABOUT_IMAGES_DATABASE_ID}/query`, {
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

    console.log("Notion response received, processing about images...")

    // Transform Notion data to your expected format
    const aboutImages = data.results.map((page: any) => {
      const properties = page.properties

      console.log("Processing about image page properties:", Object.keys(properties))

      return {
        id: page.id,
        src: properties.Image?.files?.[0]?.file?.url || properties.Image?.files?.[0]?.external?.url || "",
        alt: properties.Alt?.rich_text?.[0]?.plain_text || "Image",
      }
    })

    console.log("Successfully processed about images:", aboutImages.length)

    return NextResponse.json({ aboutImages }, { status: 200 })
  } catch (error) {
    console.error("Error fetching about images:", error)
    return NextResponse.json({ error: "Failed to fetch about images" }, { status: 500 })
  }
}
