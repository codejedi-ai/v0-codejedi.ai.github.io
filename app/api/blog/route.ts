import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

// Removed force-static export for Vercel deployment

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

const BLOGS_DATABASE_ID = "311b3a0811614102b265b91425edf4df"

export async function GET() {
  try {
    console.log("Fetching blog posts from Notion...")
    console.log("Database ID:", BLOGS_DATABASE_ID)
    console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

    // First, get database schema to check available properties
    let sortProperty = null
    try {
      const database = await notion.databases.retrieve({
        database_id: BLOGS_DATABASE_ID,
      })

      console.log("Available blog properties:", Object.keys(database.properties))

      // Try to find a suitable sort property (creation date)
      const possibleSortProperties = [
        "Created",
        "Created time",
        "Date created",
        "Created at",
        "Date",
        "Published",
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
      console.warn("Could not retrieve blog database schema:", schemaError)
    }

    // Query the Notion database for blog posts
    const queryOptions: any = {
      database_id: BLOGS_DATABASE_ID,
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
      console.log("No suitable sort property found for blogs, using default order")
    }

    const response = await notion.databases.query(queryOptions)

    console.log("Notion response received, processing blog posts...")

    // Transform Notion data to your expected format
    const blogPosts = await Promise.all(
      response.results.map(async (page: any) => {
        const properties = page.properties

        console.log("Processing blog page properties:", Object.keys(properties))

        // Extract basic properties with multiple possible names
        const title =
          properties.title?.title?.[0]?.plain_text ||
          properties.Name?.title?.[0]?.plain_text ||
          properties.Title?.title?.[0]?.plain_text ||
          properties["Post Title"]?.title?.[0]?.plain_text ||
          "Untitled Post"

        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")

        // Get page content for excerpt and full content
        let content = ""
        let excerpt = ""

        try {
          const blocks = await notion.blocks.children.list({
            block_id: page.id,
          })

          // Extract text content from blocks
          const textContent = blocks.results
            .map((block: any) => {
              if (block.type === "paragraph" && block.paragraph?.rich_text) {
                return block.paragraph.rich_text.map((text: any) => text.plain_text).join("")
              }
              if (block.type === "heading_1" && block.heading_1?.rich_text) {
                return "# " + block.heading_1.rich_text.map((text: any) => text.plain_text).join("")
              }
              if (block.type === "heading_2" && block.heading_2?.rich_text) {
                return "## " + block.heading_2.rich_text.map((text: any) => text.plain_text).join("")
              }
              if (block.type === "heading_3" && block.heading_3?.rich_text) {
                return "### " + block.heading_3.rich_text.map((text: any) => text.plain_text).join("")
              }
              return ""
            })
            .filter(Boolean)
            .join("\n\n")

          content = textContent
          excerpt = textContent.substring(0, 200) + "..."
        } catch (blockError) {
          console.error("Error fetching blocks for page:", page.id, blockError)
          excerpt = "Content preview unavailable"
          content = "Content unavailable"
        }

        // Extract other properties with multiple possible names
        const publishedAt =
          properties.Created?.created_time ||
          properties["Created time"]?.created_time ||
          properties.Date?.date?.start ||
          properties.Published?.date?.start ||
          new Date().toISOString()

        const tags =
          properties.Tags?.multi_select?.map((tag: any) => tag.name) ||
          properties.Categories?.multi_select?.map((tag: any) => tag.name) ||
          properties.Topics?.multi_select?.map((tag: any) => tag.name) ||
          []

        const category =
          properties.Category?.select?.name ||
          properties.Type?.select?.name ||
          properties.Section?.select?.name ||
          "General"

        const featured =
          properties.Featured?.checkbox || properties.Highlight?.checkbox || properties.Important?.checkbox || false

        const readTime =
          properties["Read Time"]?.rich_text?.[0]?.plain_text ||
          properties.Duration?.rich_text?.[0]?.plain_text ||
          "5 min read"

        // Get cover image from page cover or properties (PRIORITY: page cover)
        const coverImage = page.cover?.file?.url || page.cover?.external?.url
        const propertyImage =
          properties.Image?.files?.[0]?.file?.url ||
          properties.Image?.files?.[0]?.external?.url ||
          properties.Cover?.files?.[0]?.file?.url ||
          properties.Thumbnail?.files?.[0]?.file?.url
        
        const image = coverImage || propertyImage || "/placeholder.svg"

        // Get page emoji/icon
        const pageIcon = page.icon?.emoji || page.icon?.file?.url || page.icon?.external?.url || null
        const iconType = page.icon?.type || null // "emoji", "file", or "external"

        console.log(`Blog post "${title}" - Cover image: ${coverImage ? "✅ Found" : "❌ None"}, Property image: ${propertyImage ? "✅ Found" : "❌ None"}, Icon: ${pageIcon ? "✅ " + pageIcon : "❌ None"}, Final: ${image}`)

        return {
          id: page.id,
          title,
          slug,
          excerpt,
          content,
          author: "Darcy Liu",
          publishedAt,
          updatedAt: page.last_edited_time,
          tags,
          featured,
          readTime,
          image,
          category,
          // Page icon/emoji
          icon: pageIcon,
          iconType: iconType,
          // Additional Notion-specific data for admin
          notionUrl: page.url,
          createdTime: page.created_time,
          lastEditedTime: page.last_edited_time,
        }
      }),
    )

    console.log(`Successfully processed ${blogPosts.length} blog posts`)
    return NextResponse.json({ blogPosts }, { status: 200 })
  } catch (error) {
    console.error("Error fetching blog posts from Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Fallback to empty array if Notion fails
    const fallbackBlogPosts: any[] = []

    console.log("Using fallback blog posts data (empty)")
    return NextResponse.json({ blogPosts: fallbackBlogPosts }, { status: 200 })
  }
}
