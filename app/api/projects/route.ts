import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

// Correct database ID format (with hyphens)
const SIDE_PROJECTS_DATABASE_ID = "8845d571-4240-4f4d-9e67-e54f552c4e2e"

export async function GET() {
  try {
    console.log("Fetching projects from Notion...")
    console.log("Database ID:", SIDE_PROJECTS_DATABASE_ID)
    console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

    if (!process.env.NOTION_INTEGRATION_SECRET) {
      throw new Error("NOTION_INTEGRATION_SECRET is not configured")
    }

    // First, get database schema to check available properties
    let sortProperty = null
    try {
      const database = await notion.databases.retrieve({
        database_id: SIDE_PROJECTS_DATABASE_ID,
      })

      console.log("Database retrieved successfully")
      console.log("Available properties:", Object.keys(database.properties))

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

      if (!sortProperty) {
        console.log("No suitable sort property found, using default order")
      }
    } catch (schemaError) {
      console.warn("Could not retrieve database schema:", schemaError)
      // Continue without sorting if schema retrieval fails
    }

    // Query the Notion database for side projects
    const queryOptions: any = {
      database_id: SIDE_PROJECTS_DATABASE_ID,
    }

    // Only add sorting if we found a valid property
    if (sortProperty) {
      queryOptions.sorts = [
        {
          property: sortProperty,
          direction: "descending",
        },
      ]
    }

    console.log("Querying database with options:", queryOptions)
    const response = await notion.databases.query(queryOptions)

    console.log(`Notion response received: ${response.results.length} pages found`)

    // Transform Notion data to your expected format
    const projects = await Promise.all(
      response.results.map(async (page: any, index: number) => {
        console.log(`Processing page ${index + 1}/${response.results.length}: ${page.id}`)

        const properties = page.properties

        console.log("Available page properties:", Object.keys(properties))
        console.log("Page cover:", page.cover)

        // Extract basic properties - try multiple possible property names
        const title =
          properties.title?.title?.[0]?.plain_text ||
          properties.Name?.title?.[0]?.plain_text ||
          properties.Title?.title?.[0]?.plain_text ||
          properties["Project Name"]?.title?.[0]?.plain_text ||
          "Untitled Project"

        console.log(`Project title: "${title}"`)

        const description =
          properties.Description?.rich_text?.[0]?.plain_text ||
          properties.Summary?.rich_text?.[0]?.plain_text ||
          properties.About?.rich_text?.[0]?.plain_text ||
          ""

        console.log(`Project description: "${description}"`)

        // Get detailed description from page content
        let longDescription = description
        try {
          console.log(`Fetching blocks for page: ${page.id}`)

          // Add timeout and better error handling for block fetching
          const blocks = (await Promise.race([
            notion.blocks.children.list({
              block_id: page.id,
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Block fetch timeout")), 5000)),
          ])) as any

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

        const link =
          properties.Link?.url ||
          properties.URL?.url ||
          properties["Live URL"]?.url ||
          properties["Demo URL"]?.url ||
          "#"

        const github =
          properties.GitHub?.url ||
          properties["GitHub URL"]?.url ||
          properties["Source Code"]?.url ||
          properties.Repository?.url ||
          "#"

        const featured =
          properties.Featured?.checkbox || properties.Highlight?.checkbox || properties.Important?.checkbox || false

        // Extract cover image from page cover property (PRIORITY)
        let image = "/placeholder.svg"

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

          if (imageProperty) {
            image = imageProperty
            console.log(`📎 Image property fallback found: ${image}`)
          } else {
            console.log(`⚠️ No image found for project "${title}", using placeholder`)
          }
        }

        console.log(`🖼️ Final project "${title}" image: ${image}`)

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
