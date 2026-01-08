import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { corsResponse, handleOptions } from "@/lib/cors"

// Removed force-static export for Vercel deployment

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}

export async function GET(request: NextRequest) {
  try {
    // Hard-coded contacts data
    const contacts = [
      {
        id: "linkedin",
        name: "LinkedIn",
        value: "codejediatuw",
        icon: "Linkedin",
        href: "https://www.linkedin.com/in/codejediatuw/",
        color: "bg-primary-blue",
        qr: true,
      },
      {
        id: "instagram",
        name: "Instagram",
        value: "darcyldx",
        icon: "Instagram",
        href: "https://www.instagram.com/darcyldx/",
        color: "bg-primary-purple",
        qr: true,
      },
      {
        id: "twitter",
        name: "X (Twitter)",
        value: "@darsboi_cjd",
        icon: "Twitter",
        href: "https://twitter.com/darsboi_cjd",
        color: "bg-dark-lighter",
        qr: true,
      },
      {
        id: "email",
        name: "Email",
        value: "d273liu@uwaterloo.ca",
        icon: "Mail",
        href: "mailto:d273liu@uwaterloo.ca",
        color: "bg-primary-pink",
        qr: false,
      },
      {
        id: "calendly",
        name: "Schedule a Meeting",
        value: "Calendly",
        icon: "Calendar",
        href: "https://calendly.com/d273liu/one-on-one",
        color: "bg-primary-cyan",
        qr: false,
      },
      {
        id: "discord",
        name: "Discord",
        value: "codejedi",
        icon: "MessageSquare",
        href: "#",
        color: "bg-primary-purple",
        qr: false,
      },
    ]

    // Return the contacts data as JSON
    return corsResponse({ contacts }, 200, request)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return corsResponse({ error: "Failed to fetch contacts data" }, 500, request)
  }
}
