import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { corsResponse, handleOptions } from "@/lib/cors"
import { Client } from "@notionhq/client"
import { readCache, writeCache } from "@/lib/file-cache"

const ABOUT_IMAGES_DATABASE_ID = "c8c11443-ac59-4f07-899a-1c0604751414"

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}

// Helper function to fetch and process about images from Notion via Data Sources (fallback to databases.query)
async function fetchAboutImagesFromNotion() {
  console.log("Fetching about images from Notion using SDK (prefer Data Sources)...")
  console.log("Database ID:", ABOUT_IMAGES_DATABASE_ID)

  const apiKey = process.env.NOTION_INTEGRATION_SECRET || process.env.NOTION_API_KEY
  if (!apiKey) throw new Error("NOTION_API_KEY/NOTION_INTEGRATION_SECRET is not configured")

  const notion = new Client({ auth: apiKey })

  // Discover data source id
  let dataSourceId: string | undefined = process.env.ABOUT_IMAGES_DATA_SOURCE_ID
  try {
    const db = await (notion as any).databases.retrieve({ database_id: ABOUT_IMAGES_DATABASE_ID })
    dataSourceId =
      dataSourceId ||
      (Array.isArray(db?.data_sources) && db.data_sources[0]?.id) ||
      db?.data_source_id ||
      db?.data_source?.id ||
      db?.parent?.data_source_id ||
      db?.parent?.data_source?.id
    console.log("About images data source discovery:", { found: !!dataSourceId })
  } catch (e) {
    console.warn("Unable to retrieve about-images DB for data source discovery; falling back to databases.query", e)
  }

  // Page through results (no filters)
  const results: any[] = []
  let start_cursor: string | undefined
  while (true) {
    let resp: { results: any[]; has_more?: boolean; next_cursor?: string | null }
    if (dataSourceId) {
      resp = await (notion as any).dataSources.query({ data_source_id: dataSourceId, start_cursor })
    } else {
      resp = await (notion as any).databases.query({ database_id: ABOUT_IMAGES_DATABASE_ID, start_cursor })
    }
    results.push(...(resp.results || []))
    if (!resp.has_more || !resp.next_cursor) break
    start_cursor = resp.next_cursor as string
  }

  const data = { results }

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
    // Local file cache first
    const cacheKey = "about-images"
    const ttlMs = 5 * 60 * 1000
    const cached = await readCache<any[]>(cacheKey, ttlMs)
    if (cached && Array.isArray(cached)) {
      const res = corsResponse({ aboutImages: cached }, 200, request)
      res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=86400")
      return res
    }

    const aboutImages = await fetchAboutImagesFromNotion()
    await writeCache(cacheKey, aboutImages)
    const res = corsResponse({ aboutImages }, 200, request)
    res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=86400")
    return res
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
