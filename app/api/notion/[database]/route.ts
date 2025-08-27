import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

// Database mappings with properly formatted IDs
const DATABASE_MAPPINGS = {
  "work-experience": "ce4d8010-744e-4fc7-90d5-f1ca4e481955",
  blogs: "311b3a0811614102b265b91425edf4df",
  "side-project-technical": "8845d571-4240-4f4d-9e67-e54f552c4e2e",
  images: "911ef9d8-89c2-41ad-bf82-a2a9cc41e231",
}

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

export async function GET(request: Request, { params }: { params: { database: string } }) {
  try {
    const { database } = params
    const databaseId = DATABASE_MAPPINGS[database as keyof typeof DATABASE_MAPPINGS]

    if (!databaseId) {
      return NextResponse.json(
        {
          error: `Database '${database}' not found. Available databases: ${Object.keys(DATABASE_MAPPINGS).join(", ")}`,
        },
        { status: 404 },
      )
    }

    console.log(`Querying Notion database: ${database} (${databaseId})`)

    // Query the Notion database
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Created",
          direction: "descending",
        },
      ],
    })

    return NextResponse.json({
      database: database,
      databaseId: databaseId,
      results: response.results,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    })
  } catch (error) {
    console.error(`Error querying Notion database '${params.database}':`, error)
    return NextResponse.json(
      {
        error: "Failed to query Notion database",
        database: params.database,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request, { params }: { params: { database: string } }) {
  try {
    const { database } = params
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

    // Create a new page in the Notion database
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: body.properties || {},
      children: body.children || [],
    })

    return NextResponse.json({
      database: database,
      databaseId: databaseId,
      page: response,
    })
  } catch (error) {
    console.error(`Error creating Notion page in '${params.database}':`, error)
    return NextResponse.json(
      {
        error: "Failed to create Notion page",
        database: params.database,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
