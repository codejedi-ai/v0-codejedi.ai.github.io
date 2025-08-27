import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

// Database mappings
const DATABASE_MAPPINGS = {
  "work-experience": "ce4d8010-744e-4fc7-90d5-f1ca4e481955",
  blogs: "311b3a0811614102b265b91425edf4df",
  "side-project-technical": "8845d571-4240-4f4d-9e67-e54f552c4e2e",
}

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

export async function GET(request: Request, { params }: { params: { database: string; pageId: string } }) {
  try {
    const { database, pageId } = params
    const databaseId = DATABASE_MAPPINGS[database as keyof typeof DATABASE_MAPPINGS]

    if (!databaseId) {
      return NextResponse.json(
        {
          error: `Database '${database}' not found. Available databases: ${Object.keys(DATABASE_MAPPINGS).join(", ")}`,
        },
        { status: 404 },
      )
    }

    // Get the specific page
    const page = await notion.pages.retrieve({ page_id: pageId })

    // Get the page content (blocks)
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    })

    return NextResponse.json({
      database: database,
      databaseId: databaseId,
      page: page,
      blocks: blocks.results,
    })
  } catch (error) {
    console.error(`Error retrieving Notion page:`, error)
    return NextResponse.json(
      {
        error: "Failed to retrieve Notion page",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request, { params }: { params: { database: string; pageId: string } }) {
  try {
    const { database, pageId } = params
    const databaseId = DATABASE_MAPPINGS[database as keyof typeof DATABASE_MAPPINGS]

    if (!databaseId) {
      return NextResponse.json(
        {
          error: `Database '${database}' not found. Available databases: ${Object.keys(DATABASE_MAPPINGS).join(", ")}`,
        },
        { status: 404 },
      )
    }

    const body = await request.json()

    // Update the page properties
    const response = await notion.pages.update({
      page_id: pageId,
      properties: body.properties || {},
    })

    return NextResponse.json({
      database: database,
      databaseId: databaseId,
      page: response,
    })
  } catch (error) {
    console.error(`Error updating Notion page:`, error)
    return NextResponse.json(
      {
        error: "Failed to update Notion page",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
