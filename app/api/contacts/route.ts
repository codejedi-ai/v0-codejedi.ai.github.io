import { NextResponse } from "next/server"

export async function GET() {
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
    return NextResponse.json({ contacts }, { status: 200 })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts data" }, { status: 500 })
  }
}
