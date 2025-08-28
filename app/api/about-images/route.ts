import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

// Removed force-static export for Vercel deployment

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

const ABOUT_IMAGES_DATABASE_ID = "c8c11443-ac59-4f07-899a-1c0604751414"

export async function GET() {
  try {
    console.log("Fetching about images from Notion...")
    console.log("Database ID:", ABOUT_IMAGES_DATABASE_ID)
    console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

    // First, get database schema to check available properties
    let sortProperty = null
    try {
      const database = await notion.databases.retrieve({
        database_id: ABOUT_IMAGES_DATABASE_ID,
      })

      console.log("Available about images properties:", Object.keys(database.properties))

      // Try to find a suitable sort property
      const possibleSortProperties = [
        "Created",
        "Created time", 
        "Date created",
        "Created at",
        "Date",
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
      console.warn("Could not retrieve about images database schema:", schemaError)
    }

    // Query the Notion database for about images
    const queryOptions: any = {
      database_id: ABOUT_IMAGES_DATABASE_ID,
    }

    // Only add sorting if we found a valid property
    if (sortProperty) {
      queryOptions.sorts = [
        {
          property: sortProperty,
          direction: "ascending", // Use ascending to maintain order like about1, about2, etc.
        },
      ]
    } else {
      console.log("No suitable sort property found for about images, using default order")
    }

    const response = await notion.databases.query(queryOptions)

    console.log("Notion response received, processing about images...")

    // Transform Notion data to your expected format
    const aboutImages = response.results.map((page: any) => {
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
