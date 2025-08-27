import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

const IMAGES_DATABASE_ID = "911ef9d8-89c2-41ad-bf82-a2a9cc41e231"

export async function GET() {
  try {
    console.log("Fetching images from Notion...")
    console.log("Database ID:", IMAGES_DATABASE_ID)
    console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

    // First, get database schema to check available properties
    let sortProperty = null
    try {
      const database = await notion.databases.retrieve({
        database_id: IMAGES_DATABASE_ID,
      })

      console.log("Available image properties:", Object.keys(database.properties))

      // Try to find a suitable sort property (creation date)
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
      console.warn("Could not retrieve image database schema:", schemaError)
    }

    // Query the Notion database for images
    const queryOptions: any = {
      database_id: IMAGES_DATABASE_ID,
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
      console.log("No suitable sort property found for images, using default order")
    }

    const response = await notion.databases.query(queryOptions)

    console.log("Notion response received, processing images...")

    // Transform Notion data to your expected format
    const images = response.results.map((page: any) => {
      const properties = page.properties

      console.log("Processing image page properties:", Object.keys(properties))

      // Extract basic properties with multiple possible names
      const name =
        properties.Name?.title?.[0]?.plain_text ||
        properties.title?.title?.[0]?.plain_text ||
        properties.Title?.title?.[0]?.plain_text ||
        "Untitled Image"

      const type =
        properties.Type?.select?.name || properties.Category?.select?.name || properties.Kind?.select?.name || "Unknown"

      // Extract image URL from page cover or files
      let imageUrl = null

      // First priority: Page cover
      if (page.cover) {
        if (page.cover.type === "external" && page.cover.external?.url) {
          imageUrl = page.cover.external.url
          console.log(`✅ External cover image found: ${imageUrl}`)
        } else if (page.cover.type === "file" && page.cover.file?.url) {
          imageUrl = page.cover.file.url
          console.log(`✅ File cover image found: ${imageUrl}`)
        }
      }

      // Second priority: Files property
      if (!imageUrl) {
        const filesProperty =
          properties.Files?.files?.[0]?.file?.url ||
          properties.Image?.files?.[0]?.file?.url ||
          properties.File?.files?.[0]?.file?.url

        if (filesProperty) {
          imageUrl = filesProperty
          console.log(`📎 Files property found: ${imageUrl}`)
        }
      }

      return {
        id: page.id,
        name,
        type,
        imageUrl,
        createdTime: page.created_time,
        lastEditedTime: page.last_edited_time,
        url: page.url,
      }
    })

    console.log(`Successfully processed ${images.length} images`)
    return NextResponse.json({ images }, { status: 200 })
  } catch (error) {
    console.error("Error fetching images from Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Fallback to empty array if Notion fails
    const fallbackData: any[] = []

    console.log("Using fallback images data (empty)")
    return NextResponse.json({ images: fallbackData }, { status: 200 })
  }
}
