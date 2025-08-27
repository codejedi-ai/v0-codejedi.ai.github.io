import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

export const dynamic = "force-static"

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

const CONTACTS_DATABASE_ID = "46fdbe9f-11ca-4f7e-9123-8f2e9025c66d"

interface ContactFormData {
  name: string
  email: string
  phone?: string
  instagram?: string
  twitter?: string
  discord?: string
  linkedin?: string
  github?: string
  message: string
}

export async function POST(request: Request) {
  try {
    const formData: ContactFormData = await request.json()
    
    console.log("Submitting contact to Notion:", formData)

    if (!process.env.NOTION_INTEGRATION_SECRET) {
      throw new Error("NOTION_INTEGRATION_SECRET is not configured")
    }

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields" },
        { status: 400 }
      )
    }

    // Create the page properties
    const properties: any = {
      Name: {
        title: [
          {
            text: {
              content: formData.name
            }
          }
        ]
      },
      Email: {
        email: formData.email
      }
    }

    // Add optional fields if they exist
    if (formData.phone) {
      properties["Phone Number"] = {
        phone_number: formData.phone
      }
    }

    if (formData.instagram) {
      // Clean up Instagram handle (remove @ if present)
      const cleanInstagram = formData.instagram.startsWith('@') 
        ? formData.instagram 
        : `@${formData.instagram}`
      
      properties.Instagram = {
        rich_text: [
          {
            text: {
              content: cleanInstagram
            }
          }
        ]
      }
    }

    if (formData.twitter) {
      // Clean up Twitter handle (remove @ if present)
      const cleanTwitter = formData.twitter.startsWith('@') 
        ? formData.twitter 
        : `@${formData.twitter}`
      
      properties.Twitter = {
        rich_text: [
          {
            text: {
              content: cleanTwitter
            }
          }
        ]
      }
    }

    if (formData.discord) {
      properties.Discord = {
        rich_text: [
          {
            text: {
              content: formData.discord
            }
          }
        ]
      }
    }

    if (formData.linkedin) {
      // Ensure LinkedIn URL is properly formatted
      let linkedinUrl = formData.linkedin
      if (!linkedinUrl.startsWith('http')) {
        linkedinUrl = `https://${linkedinUrl}`
      }
      
      properties.LinkedIn = {
        url: linkedinUrl
      }
    }

    if (formData.github) {
      // Ensure GitHub URL is properly formatted
      let githubUrl = formData.github
      if (!githubUrl.startsWith('http')) {
        githubUrl = `https://${githubUrl}`
      }
      
      properties.GitHub = {
        url: githubUrl
      }
    }

    // Create the page content (why they contacted you)
    const children = [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: formData.message
              }
            }
          ]
        }
      }
    ]

    // Create the page in Notion
    const response = await notion.pages.create({
      parent: {
        database_id: CONTACTS_DATABASE_ID
      },
      properties,
      children: children as import("@notionhq/client").BlockObjectRequest[]
    })

    console.log("Successfully created contact in Notion:", response.id)

    return NextResponse.json({ 
      success: true, 
      message: "Contact submitted successfully!",
      pageId: response.id 
    }, { status: 200 })

  } catch (error) {
    console.error("Error submitting contact to Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      { 
        error: "Failed to submit contact. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
