import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

const BLOGS_DATABASE_ID = "311b3a0811614102b265b91425edf4df"

export async function GET() {
  try {
    console.log("Fetching blog posts from Notion...")
    console.log("Database ID:", BLOGS_DATABASE_ID)
    console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

    // First, get database schema to check available properties
    let sortProperty = null
    try {
      const database = await notion.databases.retrieve({
        database_id: BLOGS_DATABASE_ID,
      })

      console.log("Available blog properties:", Object.keys(database.properties))

      // Try to find a suitable sort property (creation date)
      const possibleSortProperties = [
        "Created",
        "Created time",
        "Date created",
        "Created at",
        "Date",
        "Published",
        "Last edited time",
      ]

      for (const propName of possibleSortProperties) {
        if (database.properties[propName]) {
          sortProperty = propName
          console.log(`Using sort property: ${propName}`)
          break
        }
      }
    } catch (schemaError) {
      console.warn("Could not retrieve blog database schema:", schemaError)
    }

    // Query the Notion database for blog posts
    const queryOptions: any = {
      database_id: BLOGS_DATABASE_ID,
    }

    // Only add sorting if we found a valid property
    if (sortProperty) {
      queryOptions.sorts = [
        {
          property: sortProperty,
          direction: "descending",
        },
      ]
    } else {
      console.log("No suitable sort property found for blogs, using default order")
    }

    const response = await notion.databases.query(queryOptions)

    console.log("Notion response received, processing blog posts...")

    // Transform Notion data to your expected format
    const blogPosts = await Promise.all(
      response.results.map(async (page: any) => {
        const properties = page.properties

        console.log("Processing blog page properties:", Object.keys(properties))

        // Extract basic properties with multiple possible names
        const title =
          properties.title?.title?.[0]?.plain_text ||
          properties.Name?.title?.[0]?.plain_text ||
          properties.Title?.title?.[0]?.plain_text ||
          properties["Post Title"]?.title?.[0]?.plain_text ||
          "Untitled Post"

        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")

        // Get page content for excerpt and full content
        let content = ""
        let excerpt = ""

        try {
          const blocks = await notion.blocks.children.list({
            block_id: page.id,
          })

          // Extract text content from blocks
          const textContent = blocks.results
            .map((block: any) => {
              if (block.type === "paragraph" && block.paragraph?.rich_text) {
                return block.paragraph.rich_text.map((text: any) => text.plain_text).join("")
              }
              if (block.type === "heading_1" && block.heading_1?.rich_text) {
                return "# " + block.heading_1.rich_text.map((text: any) => text.plain_text).join("")
              }
              if (block.type === "heading_2" && block.heading_2?.rich_text) {
                return "## " + block.heading_2.rich_text.map((text: any) => text.plain_text).join("")
              }
              if (block.type === "heading_3" && block.heading_3?.rich_text) {
                return "### " + block.heading_3.rich_text.map((text: any) => text.plain_text).join("")
              }
              return ""
            })
            .filter(Boolean)
            .join("\n\n")

          content = textContent
          excerpt = textContent.substring(0, 200) + "..."
        } catch (blockError) {
          console.error("Error fetching blocks for page:", page.id, blockError)
          excerpt = "Content preview unavailable"
          content = "Content unavailable"
        }

        // Extract other properties with multiple possible names
        const publishedAt =
          properties.Created?.created_time ||
          properties["Created time"]?.created_time ||
          properties.Date?.date?.start ||
          properties.Published?.date?.start ||
          new Date().toISOString()

        const tags =
          properties.Tags?.multi_select?.map((tag: any) => tag.name) ||
          properties.Categories?.multi_select?.map((tag: any) => tag.name) ||
          properties.Topics?.multi_select?.map((tag: any) => tag.name) ||
          []

        const category =
          properties.Category?.select?.name ||
          properties.Type?.select?.name ||
          properties.Section?.select?.name ||
          "General"

        const featured =
          properties.Featured?.checkbox || properties.Highlight?.checkbox || properties.Important?.checkbox || false

        const readTime =
          properties["Read Time"]?.rich_text?.[0]?.plain_text ||
          properties.Duration?.rich_text?.[0]?.plain_text ||
          "5 min read"

        const image =
          properties.Image?.files?.[0]?.file?.url ||
          properties.Image?.files?.[0]?.external?.url ||
          properties.Cover?.files?.[0]?.file?.url ||
          properties.Thumbnail?.files?.[0]?.file?.url ||
          "/placeholder.svg"

        return {
          id: page.id,
          title,
          slug,
          excerpt,
          content,
          author: "Darcy Liu",
          publishedAt,
          updatedAt: page.last_edited_time,
          tags,
          featured,
          readTime,
          image,
          category,
        }
      }),
    )

    console.log(`Successfully processed ${blogPosts.length} blog posts`)
    return NextResponse.json({ blogPosts }, { status: 200 })
  } catch (error) {
    console.error("Error fetching blog posts from Notion:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Fallback to hardcoded data if Notion fails
    const fallbackBlogPosts = [
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
        category: "AI & Machine Learning",
      },
      {
        id: "hugging-face-fundamentals-agents",
        title: "Fundamentals of AI Agents - Course Completion",
        slug: "hugging-face-fundamentals-agents",
        excerpt:
          "Successfully completed Unit 1: Foundations of Agents in the Hugging Face Agents Course, covering fundamental concepts and architecture.",
        content: `
# Fundamentals of AI Agents - Course Completion

## Course Overview

I recently completed the **Fundamentals of Agents** course as part of the Hugging Face Agents curriculum. This foundational course provided essential knowledge about AI agent architecture and implementation principles.

## What I Learned

### Agent Architecture
- Core components of AI agents
- Decision-making processes
- Environment interaction patterns
- State management and memory

### Design Patterns
- Common agent architectures
- Best practices for agent design
- Scalability considerations
- Performance optimization techniques

### Implementation Principles
- Agent lifecycle management
- Error handling and recovery
- Testing strategies for agents
- Deployment considerations

## Key Insights

The course emphasized several critical concepts:

1. **Modularity**: Agents should be built with modular components for maintainability
2. **Robustness**: Error handling is crucial for production agents
3. **Observability**: Monitoring and logging are essential for debugging
4. **Scalability**: Design with growth in mind from the beginning

## Practical Applications

The knowledge gained from this course has immediate applications in:

- Building conversational AI systems
- Developing autonomous task execution systems
- Creating intelligent automation tools
- Designing multi-agent collaborative systems

## Next Steps

This foundational knowledge sets the stage for more advanced topics in the Hugging Face Agents curriculum, including specialized agent types and advanced deployment strategies.
        `,
        author: "Darcy Liu",
        publishedAt: "2025-04-17",
        updatedAt: "2025-04-17",
        tags: ["AI Agents", "Hugging Face", "Foundations", "Course Completion"],
        featured: false,
        readTime: "4 min read",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AI-Agents-XFoMGnpSB1R3YGGoQvE9VJKu5nYYS8.webp",
        category: "Hugging Face Journey",
      },
      {
        id: "mcp-course-completion",
        title: "Model Context Protocol (MCP) Course - Unit 1 Complete",
        slug: "mcp-course-completion",
        excerpt:
          "Completed the fundamentals of Model Context Protocol (MCP), learning about context management and protocol design for AI systems.",
        content: `
# Model Context Protocol (MCP) Course - Unit 1 Complete

## Introduction to MCP

The Model Context Protocol (MCP) represents a significant advancement in how AI systems manage and share context across different interactions and sessions. Completing Unit 1 of this course has provided me with foundational knowledge in this critical area.

## Course Content

### Context Management Fundamentals
- Understanding context in AI systems
- Context preservation strategies
- Memory management techniques
- Context sharing protocols

### Protocol Design
- MCP architecture and components
- Implementation patterns
- Best practices for protocol design
- Integration with existing systems

### Practical Implementation
- Setting up MCP in development environments
- Basic context operations
- Debugging and troubleshooting
- Performance considerations

## Key Learning Outcomes

### Technical Skills
- Implementing basic MCP operations
- Understanding context lifecycle management
- Designing context-aware applications
- Troubleshooting context-related issues

### Conceptual Understanding
- The importance of context in AI systems
- How MCP differs from traditional approaches
- When to use MCP vs. other solutions
- Future directions for context protocols

## Real-World Applications

The MCP knowledge is immediately applicable to:

- Building more coherent conversational AI
- Developing context-aware applications
- Improving user experience in AI systems
- Creating more efficient AI workflows

## Looking Forward

This foundational understanding of MCP opens up possibilities for more advanced context management techniques and integration with complex AI systems. The next units will dive deeper into advanced MCP features and real-world implementation scenarios.
        `,
        author: "Darcy Liu",
        publishedAt: "2025-06-07",
        updatedAt: "2025-06-07",
        tags: ["Model Context Protocol", "MCP", "Context Management", "AI Systems"],
        featured: false,
        readTime: "3 min read",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MCP-Cert-KEcApO1IElKuUmbwg4tfO1OPK1tUMv.webp",
        category: "Hugging Face Journey",
      },
      {
        id: "aws-devops-professional-experience",
        title: "Achieving AWS DevOps Engineer Professional Certification",
        slug: "aws-devops-professional-experience",
        excerpt:
          "My experience preparing for and passing the AWS DevOps Engineer Professional certification, including study strategies and key learnings.",
        content: `
# Achieving AWS DevOps Engineer Professional Certification

## The Challenge

The AWS DevOps Engineer Professional certification is one of the most challenging AWS certifications, requiring deep knowledge of DevOps practices, AWS services, and real-world implementation experience.

## Preparation Strategy

### Study Materials
- AWS official documentation
- Hands-on labs and practice
- Real-world project experience
- Practice exams

### Key Focus Areas
- CI/CD pipeline design and implementation
- Infrastructure as Code (IaC)
- Monitoring and logging
- Security best practices
- Automation and orchestration

## Key Learnings

The certification process reinforced several important concepts:

1. **Automation First**: Everything should be automated and repeatable
2. **Security Integration**: Security must be built into every stage of the pipeline
3. **Monitoring is Essential**: Comprehensive monitoring and alerting are crucial
4. **Infrastructure as Code**: All infrastructure should be version-controlled and reproducible

## Real-World Application

The knowledge gained from this certification has been invaluable in my professional work, enabling me to:

- Design robust CI/CD pipelines
- Implement infrastructure automation
- Optimize deployment processes
- Ensure security and compliance

## Conclusion

The AWS DevOps Engineer Professional certification has been a significant milestone in my cloud journey, providing both theoretical knowledge and practical skills that I apply daily in my work.
        `,
        author: "Darcy Liu",
        publishedAt: "2024-08-25",
        updatedAt: "2024-08-25",
        tags: ["AWS", "DevOps", "Certification", "Cloud Computing"],
        featured: false,
        readTime: "4 min read",
        image: "/images/aws-devops-prof.png",
        category: "Certifications",
      },
      {
        id: "building-ai-agents-practical-guide",
        title: "Building AI Agents: A Practical Guide",
        slug: "building-ai-agents-practical-guide",
        excerpt:
          "A comprehensive guide to building AI agents, covering architecture, implementation, and deployment strategies based on real-world experience.",
        content: `
# Building AI Agents: A Practical Guide

## Introduction

AI agents represent the next frontier in artificial intelligence, combining reasoning, planning, and action in autonomous systems. This guide shares practical insights from building and deploying AI agents in production environments.

## Agent Architecture

### Core Components
1. **Perception Module**: Processes input from the environment
2. **Reasoning Engine**: Makes decisions based on available information
3. **Action Executor**: Implements decisions in the real world
4. **Memory System**: Maintains context and learning

### Design Principles
- **Modularity**: Each component should be independently testable
- **Scalability**: Architecture should handle increasing complexity
- **Reliability**: Fail-safe mechanisms and error handling
- **Observability**: Comprehensive logging and monitoring

## Implementation Strategies

### Technology Stack
- **Framework**: Hugging Face Transformers
- **Language Models**: GPT-4, Claude, or open-source alternatives
- **Vector Databases**: For memory and context storage
- **Orchestration**: Kubernetes for deployment and scaling

### Development Process
1. Define agent objectives and constraints
2. Design the interaction protocol
3. Implement core components
4. Test in controlled environments
5. Deploy with monitoring and feedback loops

## Deployment Considerations

### Performance Optimization
- Model quantization and optimization
- Caching strategies for common queries
- Load balancing and auto-scaling

### Security and Safety
- Input validation and sanitization
- Output filtering and safety checks
- Access control and authentication
- Audit logging and compliance

## Lessons Learned

Through building multiple AI agents, several key insights have emerged:

1. **Start Simple**: Begin with basic functionality and iterate
2. **Test Extensively**: Edge cases are where agents often fail
3. **Monitor Everything**: Comprehensive observability is crucial
4. **Plan for Failure**: Graceful degradation and recovery mechanisms
5. **User Experience**: The interface is as important as the intelligence

## Future Directions

The field of AI agents is rapidly evolving, with exciting developments in:

- Multi-agent collaboration
- Improved reasoning capabilities
- Better integration with existing systems
- Enhanced safety and alignment

## Conclusion

Building effective AI agents requires a combination of technical expertise, practical experience, and careful attention to real-world constraints. The investment in learning these skills pays dividends as AI agents become increasingly important in modern applications.
        `,
        author: "Darcy Liu",
        publishedAt: "2025-01-15",
        updatedAt: "2025-01-15",
        tags: ["AI Agents", "Software Architecture", "Machine Learning", "Tutorial"],
        featured: true,
        readTime: "8 min read",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AI-Agents-XFoMGnpSB1R3YGGoQvE9VJKu5nYYS8.webp",
        category: "AI & Machine Learning",
      },
    ]

    console.log("Using fallback blog posts data")
    return NextResponse.json({ blogPosts: fallbackBlogPosts }, { status: 200 })
  }
}
