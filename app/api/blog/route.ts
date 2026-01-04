import { NextResponse } from "next/server"

const BLOGS_DATABASE_ID = "311b3a0811614102b265b91425edf4df"

export async function GET() {
  try {
    console.log("Fetching blog posts from Notion using REST API...")
    console.log("Database ID:", BLOGS_DATABASE_ID)
    console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

    if (!process.env.NOTION_INTEGRATION_SECRET) {
      throw new Error("NOTION_INTEGRATION_SECRET is not configured")
    }

    // Query the Notion database using REST API
    const response = await fetch(`https://api.notion.com/v1/databases/${BLOGS_DATABASE_ID}/query`, {
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

    console.log("Notion response received, processing blog posts...")

    // Transform Notion data to your expected format
    const blogPosts = await Promise.all(
      data.results.map(async (page: Record<string, unknown>) => {
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
          const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${process.env.NOTION_INTEGRATION_SECRET}`,
              "Notion-Version": "2022-06-28",
            },
          })

          if (!blocksResponse.ok) {
            throw new Error(`Failed to fetch blocks: ${blocksResponse.status}`)
          }

          const blocks = await blocksResponse.json()

          // Extract text content from blocks
          const textContent = blocks.results
            .map((block: Record<string, unknown>) => {
              if (block.type === "paragraph" && block.paragraph?.rich_text) {
                return block.paragraph.rich_text.map((text: Record<string, unknown>) => text.plain_text).join("")
              }
              if (block.type === "heading_1" && block.heading_1?.rich_text) {
                return "# " + block.heading_1.rich_text.map((text: Record<string, unknown>) => text.plain_text).join("")
              }
              if (block.type === "heading_2" && block.heading_2?.rich_text) {
                return "## " + block.heading_2.rich_text.map((text: Record<string, unknown>) => text.plain_text).join("")
              }
              if (block.type === "heading_3" && block.heading_3?.rich_text) {
                return "### " + block.heading_3.rich_text.map((text: Record<string, unknown>) => text.plain_text).join("")
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
          properties.Tags?.multi_select?.map((tag: Record<string, unknown>) => tag.name) ||
          properties.Categories?.multi_select?.map((tag: Record<string, unknown>) => tag.name) ||
          properties.Topics?.multi_select?.map((tag: Record<string, unknown>) => tag.name) ||
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
    const fallbackBlogPosts: Record<string, unknown>[] = []

    console.log("Using fallback blog posts data (empty)")
    return NextResponse.json({ blogPosts: fallbackBlogPosts }, { status: 200 })
  }
}
