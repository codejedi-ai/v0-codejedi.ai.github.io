import { NextResponse } from "next/server"
import { SIDE_PROJECTS_DATABASE_ID } from "@/lib/notion-databases"

export const revalidate = false

export async function GET() {
  try {
    console.log("Fetching projects from Notion using REST API...")
    console.log("Database ID:", SIDE_PROJECTS_DATABASE_ID)
    console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

    if (!process.env.NOTION_INTEGRATION_SECRET) {
      throw new Error("NOTION_INTEGRATION_SECRET is not configured")
    }

    // Query the Notion database using REST API
    const response = await fetch(`https://api.notion.com/v1/databases/${SIDE_PROJECTS_DATABASE_ID}/query`, {
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
    const projects = await Promise.all(
      data.results.map(async (page: any, index: number) => {
        console.log(`Processing page ${index + 1}/${data.results.length}: ${page.id}`)

        const properties = page.properties

        console.log("Available page properties:", Object.keys(properties))
        console.log("Page cover:", page.cover)

        // Extract basic properties - try multiple possible property names
        const title =
          properties.Title?.title?.[0]?.plain_text ||
          properties.title?.title?.[0]?.plain_text ||
          properties.Name?.title?.[0]?.plain_text ||
          properties["Project Name"]?.title?.[0]?.plain_text ||
          "Untitled Project"

        console.log(`Project title: "${title}"`)

        // Description can be either rich_text or plain_text type
        const description =
          properties.Description?.rich_text?.[0]?.plain_text ||
          properties.Description?.plain_text ||
          properties.Summary?.rich_text?.[0]?.plain_text ||
          properties.About?.rich_text?.[0]?.plain_text ||
          ""

        console.log(`Project description: "${description}"`)

        // Get detailed description from page content
        let longDescription = description
        try {
          console.log(`Fetching blocks for page: ${page.id}`)

          // Fetch blocks using REST API with timeout
          const blocksResponse = await Promise.race([
            fetch(`https://api.notion.com/v1/blocks/${page.id}/children`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${process.env.NOTION_INTEGRATION_SECRET}`,
                "Notion-Version": "2022-06-28",
              },
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("Block fetch timeout")), 5000)
            ),
          ]) as Response

          if (!blocksResponse.ok) {
            throw new Error(`Failed to fetch blocks: ${blocksResponse.status}`)
          }

          const blocks = await blocksResponse.json()

          console.log(`Found ${blocks.results.length} blocks`)

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

          if (textContent) {
            longDescription = textContent
            console.log(`Long description extracted: ${textContent.substring(0, 100)}...`)
          } else {
            console.log("No text content found in blocks, using description as longDescription")
            longDescription = description || "No detailed description available"
          }
        } catch (blockError) {
          console.warn(
            `Could not fetch blocks for project ${page.id}:`,
            blockError instanceof Error ? blockError.message : "Unknown error",
          )
          // Use description as fallback if block fetching fails
          longDescription = description || "No detailed description available"
        }

        // Extract other properties with multiple possible names
        const tags =
          properties.Tags?.multi_select?.map((tag: any) => tag.name) ||
          properties.Technologies?.multi_select?.map((tag: any) => tag.name) ||
          properties.Skills?.multi_select?.map((tag: any) => tag.name) ||
          []

        console.log(`Project tags: [${tags.join(", ")}]`)

        // Extract project link from URL properties
        // Primary: 'url' property (ID: }suo) - Main project link in the database
        // Fallback chain for alternate property names
        const link =
          properties.url?.url ||
          properties.URL?.url ||
          properties.Link?.url ||
          properties["Live URL"]?.url ||
          properties["Demo URL"]?.url ||
          `https://www.notion.so/${page.id.replace(/-/g, "")}`

        console.log(`📎 Project link for "${title}":`, link)

        const github =
          properties.github?.url ||
          properties.GitHub?.url ||
          properties["GitHub URL"]?.url ||
          properties["Source Code"]?.url ||
          properties.Repository?.url ||
          ""

        console.log(`🔗 Project github for "${title}":`, github || "(empty)")
        console.log(`   Available URL properties:`, {
          github: !!properties.github?.url,
          GitHub: !!properties.GitHub?.url,
          "GitHub URL": !!properties["GitHub URL"]?.url,
          "Source Code": !!properties["Source Code"]?.url,
          Repository: !!properties.Repository?.url,
        })

        const featured =
          properties.Featured?.checkbox || properties.Highlight?.checkbox || properties.Important?.checkbox || false
        
        const technical =
          properties.Technical?.checkbox || false

        // Extract cover image from page cover property (PRIORITY)
        let image = "/placeholder.svg"

        // Validate image URL - must be absolute or start with /
        const isValidImageUrl = (url: string): boolean => {
          if (!url) return false
          return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")
        }

        // First priority: Page cover image
        if (page.cover) {
          if (page.cover.type === "external" && page.cover.external?.url) {
            image = page.cover.external.url
            console.log(`✅ External cover image found: ${image}`)
          } else if (page.cover.type === "file" && page.cover.file?.url) {
            image = page.cover.file.url
            console.log(`✅ File cover image found: ${image}`)
          }
        }

        // Second priority: Image property as fallback only if no cover
        if (image === "/placeholder.svg") {
          const imageProperty =
            properties.Image?.files?.[0]?.file?.url ||
            properties.Image?.files?.[0]?.external?.url ||
            properties.Screenshot?.files?.[0]?.file?.url ||
            properties.Preview?.files?.[0]?.file?.url ||
            properties.Cover?.files?.[0]?.file?.url

          if (imageProperty && isValidImageUrl(imageProperty)) {
            image = imageProperty
            console.log(`📎 Image property fallback found: ${image}`)
          } else if (imageProperty) {
            console.warn(`⚠️ Invalid image URL for project "${title}": ${imageProperty}, using placeholder`)
          } else {
            console.log(`⚠️ No image found for project "${title}", using placeholder`)
          }
        }

        // Validate final image URL
        if (!isValidImageUrl(image)) {
          console.warn(`⚠️ Final image URL is invalid for project "${title}": ${image}, reverting to placeholder`)
          image = "/placeholder.svg"
        }

        // Get page emoji/icon
        const pageIcon = page.icon?.emoji || page.icon?.file?.url || page.icon?.external?.url || null
        const iconType = page.icon?.type || null // "emoji", "file", or "external"

        console.log(`🖼️ Final project "${title}" image: ${image}, Icon: ${pageIcon ? "✅ " + pageIcon : "❌ None"}`)

        return {
          id: page.id,
          title,
          description,
          longDescription,
          image,
          tags,
          link,
          github,
          featured,
          technical,
          // Page icon/emoji
          icon: pageIcon,
          iconType: iconType,
        }
      }),
    )

    console.log(`Successfully processed ${projects.length} projects from Notion`)

    // Log each project for debugging
    projects.forEach((project, index) => {
      console.log(
        `Project ${index + 1}: "${project.title}" - ${project.tags.length} tags - Featured: ${project.featured}`,
      )
    })

    // Log complete JSON response
    console.log("\n✅ COMPLETE PROJECTS JSON RESPONSE:\n")
    console.log(JSON.stringify({ projects }, null, 2))
    console.log("\n")

    return NextResponse.json({ projects }, { status: 200 })
  } catch (error) {
    console.error("Error fetching projects from Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    })

    // Return error response instead of fallback data
    return NextResponse.json(
      {
        error: "Failed to fetch projects from Notion",
        details: error instanceof Error ? error.message : "Unknown error",
        projects: [], // Return empty array instead of fallback
      },
      { status: 500 },
    )
  }
}
