import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

// This API route handles POST requests and needs to be dynamic (removed static export)

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

const CONTACTS_DATABASE_ID = "46fdbe9f-11ca-4f7e-9123-8f2e9025c66d"

interface ContactMethod {
  platform: string
  category: string
  value: string
}

interface ContactFormData {
  name: string
  message: string
  contactMethods: ContactMethod[]
}

export async function POST(request: Request) {
  try {
    const formData: ContactFormData = await request.json()
    
    console.log("Submitting contact to Notion:", formData)

    if (!process.env.NOTION_INTEGRATION_SECRET) {
      throw new Error("NOTION_INTEGRATION_SECRET is not configured")
    }

    // Validate required fields
    if (!formData.name || !formData.message || !formData.contactMethods || formData.contactMethods.length === 0) {
      return NextResponse.json(
        { error: "Name, message, and at least one contact method are required" },
        { status: 400 }
      )
    }

    // Create separate Notion pages for each contact method
    const createdPages = []

    for (const contactMethod of formData.contactMethods) {
      // Skip if value is empty
      if (!contactMethod.value?.trim()) {
        continue
      }

      // Create the page properties for this contact method
      const properties: Record<string, unknown> = {
        Name: {
          title: [
            {
              text: {
                content: formData.name
              }
            }
          ]
        }
      }

      // Add Platform field (select type)
      if (contactMethod.platform) {
        properties.Platform = {
          select: {
            name: contactMethod.platform
          }
        }
      }

      // Handle different categories
      switch (contactMethod.category) {
        case 'email':
          // Email category - use Email Address field
          properties["Email Address"] = {
            email: contactMethod.value
          }
          break
          
        case 'phone':
          // Phone category (Phone & WhatsApp) - use Phone Number field
          properties["Phone Number"] = {
            phone_number: contactMethod.value
          }
          break
          
        case 'url':
          // URL category (LinkedIn, GitHub) - use URL field
          let cleanUrl = contactMethod.value
          if (cleanUrl && !cleanUrl.startsWith('http')) {
            cleanUrl = `https://${cleanUrl}`
          }
          properties.URL = {
            url: cleanUrl
          }
          break
          
        case 'handle':
          // Handle category (Instagram, Twitter, Telegram, Discord, WeChat) - use Handle field
          properties.Handle = {
            rich_text: [
              {
                text: {
                  content: contactMethod.value
                }
              }
            ]
          }
          break
          
        case 'other':
          // Other category - use Handle field for the contact info
          properties.Handle = {
            rich_text: [
              {
                text: {
                  content: contactMethod.value
                }
              }
            ]
          }
          break
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

      try {
        // Create the page in Notion
        const response = await notion.pages.create({
          parent: {
            database_id: CONTACTS_DATABASE_ID
          },
          properties,
          children: children as import("@notionhq/client").BlockObjectRequest[]
        })

        createdPages.push(response.id)
        console.log(`Successfully created contact page for ${contactMethod.platform}:`, response.id)
      } catch (pageError) {
        console.error(`Error creating page for ${contactMethod.platform}:`, pageError)
        // Continue with other contact methods even if one fails
      }
    }

    if (createdPages.length === 0) {
      throw new Error("Failed to create any contact pages")
    }

    return NextResponse.json({ 
      success: true, 
      message: "Contact submitted successfully!",
      pageIds: createdPages,
      contactMethodsCreated: createdPages.length
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
