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

    console.log(`Notion response received: ${data.results.length} pages found`)

    // Transform Notion data to your expected format
    const aboutImages = data.results.map((page: any, index: number) => {
      const properties = page.properties

      console.log(`Processing page ${index + 1}/${data.results.length}: ${page.id}`)
      console.log("Available page properties:", Object.keys(properties))

      // Try multiple possible property names
      const imageUrl =
        properties.Image?.files?.[0]?.file?.url ||
        properties.Image?.files?.[0]?.external?.url ||
        properties.image?.files?.[0]?.file?.url ||
        properties.image?.files?.[0]?.external?.url ||
        properties.cover?.files?.[0]?.file?.url ||
        properties.cover?.files?.[0]?.external?.url ||
        ""

      const altText =
        properties.Alt?.rich_text?.[0]?.plain_text ||
        properties.alt?.rich_text?.[0]?.plain_text ||
        properties.Description?.rich_text?.[0]?.plain_text ||
        properties.description?.rich_text?.[0]?.plain_text ||
        "Image"

      console.log(`Image URL: ${imageUrl ? "found" : "NOT FOUND"}`)
      console.log(`Alt text: ${altText}`)

      return {
        id: page.id,
        src: imageUrl,
        alt: altText,
      }
    })

    console.log("Successfully processed about images:", aboutImages.length)

    return NextResponse.json({ aboutImages }, { status: 200 })
  } catch (error) {
    console.error("Error fetching about images:", error)
    return NextResponse.json({ error: "Failed to fetch about images" }, { status: 500 })
  }
}
