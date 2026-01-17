import { NextResponse } from "next/server"

export const revalidate = false

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

    if (data.results.length === 0) {
      console.warn("No pages found in about-images database")
      return NextResponse.json({ aboutImages: [] }, { status: 200 })
    }

    // Transform Notion data to extract images
    const aboutImages = data.results
      .map((page: any, index: number) => {
        const properties = page.properties

        console.log(`\nProcessing page ${index + 1}/${data.results.length}: ${page.id}`)
        console.log("Available properties:", Object.keys(properties))

        // Try to extract image URL from various possible property names
        let imageUrl = ""

        // Check for file-type properties (Image, image, cover, Photo, etc.)
        for (const [key, value] of Object.entries(properties)) {
          if (
            value &&
            typeof value === "object" &&
            "files" in value &&
            Array.isArray((value as any).files) &&
            (value as any).files.length > 0
          ) {
            const file = (value as any).files[0]
            if (file.type === "file" && file.file?.url) {
              imageUrl = file.file.url
              console.log(`Found image in property "${key}": ✓`)
              break
            } else if (file.type === "external" && file.external?.url) {
              imageUrl = file.external.url
              console.log(`Found external image in property "${key}": ✓`)
              break
            }
          }
        }

        // If no image found in files, check page cover
        if (!imageUrl && page.cover) {
          if (page.cover.type === "file" && page.cover.file?.url) {
            imageUrl = page.cover.file.url
            console.log(`Found image in page cover (file): ✓`)
          } else if (page.cover.type === "external" && page.cover.external?.url) {
            imageUrl = page.cover.external.url
            console.log(`Found image in page cover (external): ✓`)
          }
        }

        // Try to get alt text from various properties
        let altText = "About image"
        for (const [key, value] of Object.entries(properties)) {
          if (
            value &&
            typeof value === "object" &&
            ("rich_text" in value || "title" in value)
          ) {
            const content =
              (value as any).rich_text?.[0]?.plain_text ||
              (value as any).title?.[0]?.plain_text
            if (content) {
              altText = content
              console.log(`Found alt text in property "${key}": ${altText}`)
              break
            }
          }
        }

        if (!imageUrl) {
          console.warn(`No image URL found for page ${index + 1}`)
        }

        return {
          id: page.id,
          src: imageUrl,
          alt: altText,
        }
      })
      .filter((item: any) => item.src) // Only return pages with images

    console.log(`\nSuccessfully processed ${aboutImages.length} pages with images`)

    return NextResponse.json({ aboutImages }, { status: 200 })
  } catch (error) {
    console.error("Error fetching about images:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch about images" },
      { status: 500 }
    )
  }
}
