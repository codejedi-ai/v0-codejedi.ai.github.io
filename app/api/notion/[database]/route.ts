import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { corsResponse, handleOptions } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}

// Generic Notion database query proxy with CORS
export async function GET(request: NextRequest, ctx: { params: { database: string } }) {
  try {
    const databaseId = ctx?.params?.database
    if (!databaseId) {
      return corsResponse({ error: "Missing database id in route" }, 400, request)
    }

    if (!process.env.NOTION_INTEGRATION_SECRET) {
      return corsResponse({ error: "NOTION_INTEGRATION_SECRET is not configured" }, 500, request)
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_INTEGRATION_SECRET}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return corsResponse({ error: `Notion API returned ${response.status}`, details: errorText }, response.status, request)
    }

    const data = await response.json()
    return corsResponse({ results: data.results }, 200, request)
  } catch (error) {
    return corsResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500, request)
  }
}

export async function POST(request: NextRequest, ctx: { params: { database: string } }) {
  try {
    const databaseId = ctx?.params?.database
    if (!databaseId) {
      return corsResponse({ error: "Missing database id in route" }, 400, request)
    }

    if (!process.env.NOTION_INTEGRATION_SECRET) {
      return corsResponse({ error: "NOTION_INTEGRATION_SECRET is not configured" }, 500, request)
    }

    // Allow client-provided query body (filters/sorts)
    let queryBody: Record<string, unknown> = {}
    try {
      const body = await request.json().catch(() => ({}))
      if (body && typeof body === "object") {
        queryBody = body
      }
    } catch {
      queryBody = {}
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_INTEGRATION_SECRET}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return corsResponse({ error: `Notion API returned ${response.status}`, details: errorText }, response.status, request)
    }

    const data = await response.json()
    return corsResponse({ results: data.results }, 200, request)
  } catch (error) {
    return corsResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500, request)
  }
}
