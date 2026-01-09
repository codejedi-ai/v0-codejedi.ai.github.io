import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { corsResponse, handleOptions } from "@/lib/cors"

const IMAGES_DATABASE_ID = "911ef9d8-89c2-41ad-bf82-a2a9cc41e231"

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}

// Helper function to fetch and process images from Notion
async function fetchImagesFromNotion(queryBody: Record<string, unknown> = {}) {
  console.log("Fetching images from Notion using REST API...")
  console.log("Database ID:", IMAGES_DATABASE_ID)
  console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

  if (!process.env.NOTION_INTEGRATION_SECRET) {
    throw new Error("NOTION_INTEGRATION_SECRET is not configured")
  }

  // Query the Notion database using REST API
  const response = await fetch(`https://api.notion.com/v1/databases/${IMAGES_DATABASE_ID}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_INTEGRATION_SECRET}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(queryBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Notion API error:", response.status, errorText)
    throw new Error(`Notion API returned ${response.status}: ${errorText}`)
  }

  const data = await response.json()

  console.log(`Notion response received: ${data.results.length} pages found`)

  // Transform Notion data to your expected format
  const images = data.results.map((page: { id: string; properties: Record<string, unknown>; cover?: { type: string; external?: { url: string }; file?: { url: string } } | null; icon?: { type?: string; emoji?: string; file?: { url: string }; external?: { url: string } } | null; created_time: string; last_edited_time: string; url: string }, index: number) => {
    console.log(`Processing image ${index + 1}/${data.results.length}: ${page.id}`)

    const properties = page.properties as Record<string, {
      title?: Array<{ plain_text: string }>
      select?: { name: string }
      files?: Array<{ file?: { url: string }; external?: { url: string } }>
    }>

    console.log("Available image properties:", Object.keys(properties))

    // Extract basic properties with multiple possible names
    const name =
      properties.Name?.title?.[0]?.plain_text ||
      properties.title?.title?.[0]?.plain_text ||
      properties.Title?.title?.[0]?.plain_text ||
      "Untitled Image"

    console.log(`Image name: "${name}"`)

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

    // Get page emoji/icon
    const pageIcon = page.icon?.emoji || page.icon?.file?.url || page.icon?.external?.url || null
    const iconType = page.icon?.type || null // "emoji", "file", or "external"

    console.log(`🖼️ Final image "${name}" imageUrl: ${imageUrl || "N/A"}, type: ${type}`)

    return {
      id: page.id,
      name,
      type,
      imageUrl,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      url: page.url,
      // Page icon/emoji
      icon: pageIcon,
      iconType: iconType,
    }
  })

  console.log(`Successfully processed ${images.length} images from Notion`)

  // Log each image for debugging
  images.forEach((image: { id: string; name: string; type: string; imageUrl: string | null; createdTime: string; lastEditedTime: string; url: string; icon: string | null; iconType: string | null }, index: number) => {
    console.log(
      `Image ${index + 1}: "${image.name}" - Type: ${image.type}, URL: ${image.imageUrl ? "✅" : "❌"}`,
    )
  })

  return { images }
}

export async function GET(request: NextRequest) {
  try {
    const result = await fetchImagesFromNotion()
    return corsResponse(result, 200, request)
  } catch (error) {
    console.error("Error fetching images from Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Fallback to empty array if Notion fails
    const fallbackData: Array<Record<string, unknown>> = []

    console.log("Using fallback images data (empty)")
    return corsResponse({ images: fallbackData }, 200, request)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body for query parameters (optional)
    let queryBody: Record<string, unknown> = {}
    try {
      const body = await request.json().catch(() => ({}))
      if (body && typeof body === "object") {
        queryBody = body
      }
    } catch {
      // If no body or invalid JSON, use empty query
      queryBody = {}
    }

    const result = await fetchImagesFromNotion(queryBody)
    return corsResponse(result, 200, request)
  } catch (error) {
    console.error("Error fetching images from Notion (POST):", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    })

    // Fallback to empty array if Notion fails
    const fallbackData: Array<Record<string, unknown>> = []

    console.log("Using fallback images data (empty)")
    return corsResponse({ images: fallbackData }, 200, request)
  }
}
