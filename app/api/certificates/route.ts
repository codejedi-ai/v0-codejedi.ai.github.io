import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { corsResponse, handleOptions } from "@/lib/cors"
import { unstable_cache } from "next/cache"
import { Client } from "@notionhq/client"

const CERTIFICATES_DATABASE_ID = "7ad088a9-fa3e-4261-8eb4-d140952aaa3f"

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}

// Helper function to fetch and process certificates from Notion
async function fetchCertificatesFromNotion() {
  console.log("Fetching certificates from Notion using SDK...")
  console.log("Database ID:", CERTIFICATES_DATABASE_ID)
  const apiKey = process.env.NOTION_INTEGRATION_SECRET || process.env.NOTION_API_KEY
  if (!apiKey) throw new Error("NOTION_API_KEY/NOTION_INTEGRATION_SECRET is not configured")
  const notion = new Client({ auth: apiKey })
  const data = await notion.databases.query({ database_id: CERTIFICATES_DATABASE_ID })

  console.log(`Notion response received: ${data.results.length} pages found`)

  // Transform Notion data to your expected format
  const certificates = data.results.map((page: { id: string; properties: Record<string, unknown>; cover?: { type: string; external?: { url: string }; file?: { url: string } } | null }, index: number) => {
    console.log(`Processing certificate ${index + 1}/${data.results.length}: ${page.id}`)

    const properties = page.properties as Record<string, {
      title?: Array<{ plain_text: string }>
      rich_text?: Array<{ plain_text: string }>
      plain_text?: string
      date?: { start: string }
      files?: Array<{ file?: { url: string }; external?: { url: string } }>
    }>

    console.log("Available certificate properties:", Object.keys(properties))

    // Extract basic properties - try multiple possible property names
    const name =
      properties.Title?.title?.[0]?.plain_text ||
      properties.title?.title?.[0]?.plain_text ||
      properties.Name?.title?.[0]?.plain_text ||
      (properties["Certificate Name"] as { title?: Array<{ plain_text: string }> })?.title?.[0]?.plain_text ||
      "Untitled Certificate"

    console.log(`Certificate name: "${name}"`)

    // Extract date
    const dateProperty =
      properties.Date?.date?.start ||
      properties.date?.date?.start ||
      properties["Issue Date"]?.date?.start ||
      properties["Certification Date"]?.date?.start ||
      null

    // Format date if available
    let formattedDate = ""
    if (dateProperty) {
      const date = new Date(dateProperty)
      formattedDate = date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    }

    // Extract image from page cover or files property
    let image = "/placeholder.svg"
    let alt = `${name} Certificate`

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
        properties.Certificate?.files?.[0]?.file?.url

      if (imageProperty) {
        image = imageProperty
        console.log(`📎 Image property fallback found: ${image}`)
      } else {
        console.log(`⚠️ No image found for certificate "${name}", using placeholder`)
      }
    }

    // Extract alt text if available
    const altText =
      properties.Alt?.rich_text?.[0]?.plain_text ||
      properties.alt?.rich_text?.[0]?.plain_text ||
      properties["Alt Text"]?.rich_text?.[0]?.plain_text ||
      alt

    console.log(`🖼️ Final certificate "${name}" image: ${image}, Date: ${formattedDate || "N/A"}`)

    return {
      id: page.id,
      name,
      image,
      alt: altText,
      date: formattedDate || "Date not specified",
    }
  })

  console.log(`Successfully processed ${certificates.length} certificates from Notion`)

  // Log each certificate for debugging
  certificates.forEach((certificate, index) => {
    console.log(
      `Certificate ${index + 1}: "${certificate.name}" - Date: ${certificate.date}`,
    )
  })

  return certificates
}

export async function GET(request: NextRequest) {
  try {
    const cached = unstable_cache(
      () => fetchCertificatesFromNotion(),
      ["certificates"],
      { revalidate: 300, tags: ["certificates"] }
    )
    const certificates = await cached()
    const res = corsResponse({ certificates }, 200, request)
    res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=86400")
    return res
  } catch (error) {
    console.error("Error fetching certificates from Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    })

    // Return fallback data on error
    const fallbackCertificates = [
      {
        id: "aws-practitioner",
        name: "AWS Certified Practitioner",
        image: "/images/aws-practitioner.png",
        alt: "AWS Cloud Practitioner Certificate",
        date: "2 January 2021",
      },
      {
        id: "aws-developer",
        name: "AWS Certified Developer",
        image: "/images/aws-developer.png",
        alt: "AWS Developer Associate Certificate",
        date: "29 August 2021",
      },
      {
        id: "aws-devops-prof",
        name: "AWS Certified DevOps Engineer - Professional",
        image: "/images/aws-devops-prof.png",
        alt: "AWS DevOps Engineer Professional Certificate",
        date: "23 August 2024",
      },
    ]

    return corsResponse(
      {
        error: "Failed to fetch certificates from Notion",
        details: error instanceof Error ? error.message : "Unknown error",
        certificates: fallbackCertificates, // Return fallback data
      },
      200,
      request
    )
  }
}

// POST removed: GET-only API using Notion SDK
