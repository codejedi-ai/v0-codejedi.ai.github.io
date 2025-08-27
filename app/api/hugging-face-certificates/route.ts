import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Hard-coded Hugging Face certificates data for the journal
    const huggingFaceCertificates = [
      {
        id: "hugging-face-agents-fundamentals",
        name: "Fundamentals of Agents",
        fullName: "Certificate of Achievement - Fundamentals of Agents",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AI-Agents-XFoMGnpSB1R3YGGoQvE9VJKu5nYYS8.webp",
        alt: "Hugging Face Agents Course - Unit 1: Foundations of Agents Certificate",
        date: "17 April 2025",
        description:
          "Successfully completed Unit 1: Foundations of Agents in the Hugging Face Agents Course. This unit covered the fundamental concepts of AI agents, their architecture, and basic implementation principles.",
        skills: ["AI Agents", "Agent Architecture", "Foundations", "Hugging Face"],
        courseUnit: "Unit 1",
        featured: false,
      },
      {
        id: "mcp-course-unit1",
        name: "The MCP Course: Unit 1",
        fullName: "Certificate of Achievement - The MCP Course: Unit 1",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MCP-Cert-KEcApO1IElKuUmbwg4tfO1OPK1tUMv.webp",
        alt: "The MCP Course Unit 1 - Fundamentals of MCP Certificate",
        date: "7 June 2025",
        description:
          "Completed the fundamentals of Model Context Protocol (MCP), learning about context management, protocol design, and implementation strategies for AI systems.",
        skills: ["Model Context Protocol", "MCP", "Context Management", "AI Systems"],
        courseUnit: "Unit 1",
        featured: false,
      },
      {
        id: "hugging-face-agents-course",
        name: "Hugging Face AI Agents Course",
        fullName: "Certificate of Excellence - Hugging Face Agents Course",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hugging%20Face%20Agents%20Course%20Certificate-h7by0WgWsn0t2ppzw1UJSwuqagcWUR.webp",
        alt: "Hugging Face Agents Course Certificate of Excellence",
        date: "19 June 2025",
        description:
          "Achieved Certificate of Excellence for successfully completing the comprehensive Hugging Face Agents Course. This course covered advanced topics in AI agent development, deployment, and optimization using the Hugging Face ecosystem.",
        skills: ["AI Agents", "Hugging Face", "Agent Development", "Machine Learning", "NLP"],
        courseUnit: "Complete Course",
        featured: true,
      },
    ]

    // Return the Hugging Face certificates data as JSON
    return NextResponse.json({ huggingFaceCertificates }, { status: 200 })
  } catch (error) {
    console.error("Error fetching Hugging Face certificates:", error)
    return NextResponse.json({ error: "Failed to fetch Hugging Face certificates data" }, { status: 500 })
  }
}
