import { NextResponse } from "next/server"

// This would typically fetch from your Notion database
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // For now, we'll use the same hardcoded data
    // In production, you'd fetch from Notion using the secret key
    const blogPosts = [
      {
        id: "hugging-face-agents-journey",
        title: "My Journey Through Hugging Face AI Agents",
        slug: "hugging-face-agents-journey",
        excerpt:
          "Exploring the world of AI agents through Hugging Face's comprehensive course series, from fundamentals to advanced implementations.",
        content: `
# My Journey Through Hugging Face AI Agents

## Introduction

The world of AI agents has been rapidly evolving, and Hugging Face has been at the forefront of making these technologies accessible to developers and researchers alike. My journey through their AI Agents course series has been both challenging and rewarding.

## Starting with the Fundamentals

The journey began with the **Fundamentals of Agents** course, where I learned about:

- Agent architecture and design patterns
- Environment interaction and perception
- Action selection and planning
- Multi-agent systems

## Diving into Model Context Protocol (MCP)

The **MCP Course** introduced me to the fascinating world of context management in AI systems:

- Understanding context preservation across interactions
- Implementing memory mechanisms
- Managing long-term and short-term context
- Protocol design for context sharing

## Achieving Excellence

The culmination of this journey was earning the **Certificate of Excellence** for the complete Hugging Face Agents Course. This comprehensive program covered:

- Advanced agent architectures
- Real-world deployment strategies
- Performance optimization
- Integration with the Hugging Face ecosystem

## Key Takeaways

1. **Agent Design is Critical**: The architecture of an AI agent determines its capabilities and limitations
2. **Context Matters**: Proper context management is essential for coherent agent behavior
3. **Practical Implementation**: Theory must be backed by hands-on experience
4. **Community Learning**: The Hugging Face community provides invaluable support and resources

## What's Next?

This journey has opened up new possibilities for my work in AI and machine learning. I'm excited to apply these concepts in real-world projects and continue exploring the evolving landscape of AI agents.
        `,
        author: "Darcy Liu",
        publishedAt: "2025-06-20",
        updatedAt: "2025-06-20",
        tags: ["AI Agents", "Hugging Face", "Machine Learning", "Certification"],
        featured: true,
        readTime: "5 min read",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hugging%20Face%20Agents%20Course%20Certificate-h7by0WgWsn0t2ppzw1UJSwuqagcWUR.webp",
      },
      // ... other blog posts
    ]

    const post = blogPosts.find((post) => post.slug === slug)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post data" }, { status: 500 })
  }
}
