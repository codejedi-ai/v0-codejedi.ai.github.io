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
    const aboutImages = data.results.map((page: { id: string; properties: Record<string, unknown>; cover?: { type: string; external?: { url: string }; file?: { url: string } } | null }) => {
      const properties = page.properties

      console.log("Processing about image page properties:", Object.keys(properties))

      // Extract the id from the title field (named "id" in your database)
      const id = 
        properties.id?.title?.[0]?.plain_text ||
        properties["userDefined:id"]?.title?.[0]?.plain_text ||
        properties.Name?.title?.[0]?.plain_text ||
        properties.Title?.title?.[0]?.plain_text ||
        "unknown"

      // Extract alt text
      const alt = 
        properties.alt?.rich_text?.[0]?.plain_text ||
        properties.Alt?.rich_text?.[0]?.plain_text ||
        properties["Alt Text"]?.rich_text?.[0]?.plain_text ||
        ""

      // Extract src URL - try src property first, then fallback to cover image
      let src = 
        properties.src?.rich_text?.[0]?.plain_text ||
        properties.Src?.rich_text?.[0]?.plain_text ||
        properties.URL?.rich_text?.[0]?.plain_text ||
        properties.url?.rich_text?.[0]?.plain_text ||
        null

      // If no src property, try to get from page cover
      if (!src && page.cover) {
        if (page.cover.type === "external" && page.cover.external?.url) {
          src = page.cover.external.url
          console.log(`✅ Using cover image as src: ${src}`)
        } else if (page.cover.type === "file" && page.cover.file?.url) {
          src = page.cover.file.url
          console.log(`✅ Using cover file as src: ${src}`)
        }
      }

      return {
        id,
        src: src || "",
        alt,
      }
    })

    console.log(`Successfully processed ${aboutImages.length} about images`)
    return NextResponse.json({ aboutImages }, { status: 200 })
  } catch (error) {
    console.error("Error fetching about images from Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Fallback to hardcoded data if Notion fails
    const fallbackData = [
      {
        id: "about1",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about1.jpg-TbfdbEe1niYCAR6Fqv7JYcqm2zeKO9.jpeg",
        alt: "Kayaking with a Star Wars Rebel Alliance cap",
      },
      {
        id: "about2", 
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about2-X48rWZdpV4Q7RxVbbD5F7xRy5JhQdO.jpeg",
        alt: "Sailing at the beach with life vest",
      },
      {
        id: "about3",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about3-9AFwiFVEdtKGJqM9LmWvBQWHcfyyC2.jpeg", 
        alt: "Building a sand castle on the beach",
      },
      {
        id: "about4",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about4-Vpsom9WTaJ93mBOvtKEjXoCSR1QzC5.jpeg",
        alt: "Kayaking in a blue Hydro-Force inflatable kayak",
      },
    ]

    console.log("Using fallback about images data")
    return NextResponse.json({ aboutImages: fallbackData }, { status: 200 })
  }
}
