import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { corsResponse, handleOptions } from "@/lib/cors"

const ABOUT_IMAGES_DATABASE_ID = "c8c11443-ac59-4f07-899a-1c0604751414"

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}

// Helper function to fetch and process about images from Notion
async function fetchAboutImagesFromNotion(queryBody: Record<string, unknown> = {}) {
  console.log("Fetching about images from Notion using REST API...")
  console.log("Database ID:", ABOUT_IMAGES_DATABASE_ID)
  console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

  if (!process.env.NOTION_INTEGRATION_SECRET) {
    throw new Error("NOTION_INTEGRATION_SECRET is not configured")
  }

  // Query the Notion database using REST API
  const response = await fetch(`https://api.notion.com/v1/databases/${ABOUT_IMAGES_DATABASE_ID}/query`, {
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
  console.log("Processing about images...")

  // Transform Notion data to your expected format
  const aboutImages = data.results.map((page: { id: string; properties: Record<string, unknown>; cover?: { type: string; external?: { url: string }; file?: { url: string } } | null }, index: number) => {
    console.log(`Processing about image ${index + 1}/${data.results.length}: ${page.id}`)
    const properties = page.properties as Record<string, {
      title?: Array<{ plain_text: string }>
      rich_text?: Array<{ plain_text: string }>
    }>

    console.log("Available about image properties:", Object.keys(properties))

    // Extract the id from the title field (named "id" in your database)
    const id = 
      (properties.id as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ||
      (properties["userDefined:id"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ||
      properties.Name?.title?.[0]?.plain_text ||
      properties.Title?.title?.[0]?.plain_text ||
      page.id

    console.log(`About image id: "${id}"`)

    // Extract alt text
    const alt = 
      properties.alt?.rich_text?.[0]?.plain_text ||
      properties.Alt?.rich_text?.[0]?.plain_text ||
      (properties["Alt Text"] as { rich_text?: Array<{ plain_text: string }> })?.rich_text?.[0]?.plain_text ||
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

    console.log(`🖼️ Final about image "${id}" src: ${src || "N/A"}, alt: ${alt || "N/A"}`)

    return {
      id,
      src: src || "",
      alt,
    }
  })

  console.log(`Successfully processed ${aboutImages.length} about images from Notion`)

  // Log each about image for debugging
  aboutImages.forEach((image: { id: string; src: string; alt: string }, index: number) => {
    console.log(
      `About Image ${index + 1}: "${image.id}" - src: ${image.src ? "✅" : "❌"}, alt: ${image.alt || "N/A"}`,
    )
  })

  return aboutImages
}

export async function GET(request: NextRequest) {
  try {
    const aboutImages = await fetchAboutImagesFromNotion()
    return corsResponse({ aboutImages }, 200, request)
  } catch (error) {
    console.error("Error fetching about images from Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
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
    return corsResponse({ aboutImages: fallbackData }, 200, request)
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

    const aboutImages = await fetchAboutImagesFromNotion(queryBody)
    return corsResponse({ aboutImages }, 200, request)
  } catch (error) {
    console.error("Error fetching about images from Notion (POST):", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
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
    return corsResponse({ aboutImages: fallbackData }, 200, request)
  }
}
