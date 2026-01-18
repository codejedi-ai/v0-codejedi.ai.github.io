import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { corsResponse, handleOptions } from "@/lib/cors"
import { Client } from "@notionhq/client"
import { readCache, writeCache } from "@/lib/file-cache"

const SKILLS_DATABASE_ID = "93762143-ef43-4c4b-be97-cb7e7d2dd2f4"

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}

// Helper function to fetch and process skills from Notion
async function fetchSkillsFromNotion() {
  console.log("Fetching skills from Notion using SDK...")
  console.log("Database ID:", SKILLS_DATABASE_ID)

  const apiKey = process.env.NOTION_INTEGRATION_SECRET || process.env.NOTION_API_KEY
  if (!apiKey) throw new Error("NOTION_API_KEY/NOTION_INTEGRATION_SECRET is not configured")

  const notion = new Client({ auth: apiKey })

  // Discover data source id
  let dataSourceId: string | undefined = process.env.SKILLS_DATA_SOURCE_ID
  try {
    const db = await (notion as any).databases.retrieve({ database_id: SKILLS_DATABASE_ID })
    dataSourceId =
      dataSourceId ||
      (Array.isArray(db?.data_sources) && db.data_sources[0]?.id) ||
      db?.data_source_id ||
      db?.data_source?.id ||
      db?.parent?.data_source_id ||
      db?.parent?.data_source?.id
    console.log("Skills data source discovery:", { found: !!dataSourceId })
  } catch (e) {
    console.warn("Unable to retrieve skills DB for data source discovery; falling back to databases.query", e)
  }

  // Page through results (no filters)
  const pages: any[] = []
  let start_cursor: string | undefined
  while (true) {
    let resp: { results: any[]; has_more?: boolean; next_cursor?: string | null }
    if (dataSourceId) {
      resp = await (notion as any).dataSources.query({ data_source_id: dataSourceId, start_cursor })
    } else {
      resp = await (notion as any).databases.query({ database_id: SKILLS_DATABASE_ID, start_cursor })
    }
    pages.push(...(resp.results || []))
    if (!resp.has_more || !resp.next_cursor) break
    start_cursor = resp.next_cursor as string
  }

  const data = { results: pages }

  // Analysis logging
  console.log('\n🔍 SKILLS DATABASE ANALYSIS:')
  console.log(`📊 Total skills in database: ${data.results.length}`)

  // Show all skills that will be processed
  console.log('\n📋 ALL SKILLS IN DATABASE:')
  data.results.forEach((page: { properties: Record<string, unknown> }, index: number) => {
    const properties = page.properties as Record<string, {
      title?: Array<{ plain_text: string }>
      select?: { name: string }
      rich_text?: Array<{ plain_text: string }>
    }>
    const name = properties.Name?.title?.[0]?.plain_text || "Untitled"
    const category = properties.category?.select?.name || "No Category"
    console.log(`   ${index + 1}. ${name} [${category}]`)
  })

  // Group skills by category
  const skillsMap: Record<string, { id: string; title: string; icon: string; skills: string[] }> = {}

  data.results.forEach((page: { properties: Record<string, unknown> }) => {
      const properties = page.properties as Record<string, {
        title?: Array<{ plain_text: string }>
        select?: { name: string }
        rich_text?: Array<{ plain_text: string }>
      }>
      const name = 
        properties.Name?.title?.[0]?.plain_text ||
        properties.name?.title?.[0]?.plain_text ||
        "Untitled Skill"
      
      const category = 
        properties.category?.select?.name ||
        properties.Category?.select?.name ||
        "Uncategorized"
      
      const icon = 
        properties.icon?.rich_text?.[0]?.plain_text ||
        properties.Icon?.rich_text?.[0]?.plain_text ||
        "Code"

      // Only process skills that have a valid category
      if (category !== "Uncategorized" && category) {
        // Create category group if it doesn't exist
        if (!skillsMap[category]) {
          const categoryId = category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/[^a-z0-9-]/g, '')
          skillsMap[category] = {
            id: categoryId,
            title: category,
            icon: icon,
            skills: []
          }
        }

        // Add skill name to the category
        skillsMap[category].skills.push(name)
    }
  })

  // Helper function to intelligently group skills based on patterns
  const groupSkillsIntelligently = (skills: string[]): string[] => {
      if (skills.length === 0) return []
      
      // For categories with many skills, try to group them logically
      if (skills.length > 6) {
        // Group skills in chunks of 3-4 for better readability
        const chunks: string[] = []
        for (let i = 0; i < skills.length; i += 3) {
          chunks.push(skills.slice(i, i + 3).join(", "))
        }
        return chunks
      } else if (skills.length > 3) {
        // Group skills in chunks of 2-3 for medium-sized categories
        const chunks: string[] = []
        for (let i = 0; i < skills.length; i += 2) {
          chunks.push(skills.slice(i, i + 2).join(", "))
        }
        return chunks
      } else {
        // For small categories, keep them as a single group or individual items
        return skills.length <= 2 ? [skills.join(", ")] : skills
    }
  }

  // Convert to array and format skills into groups of related items
  const skills = Object.values(skillsMap).map((category) => {
      const skillsList = category.skills
      const groupedSkills = groupSkillsIntelligently(skillsList)

      return {
        ...category,
        skills: groupedSkills.length > 0 ? groupedSkills : skillsList
    }
  })

  // Fallback to hardcoded data if Notion fails
  const fallbackSkills = [
      {
        id: "programming",
        title: "Programming Languages",
        icon: "Code",
        skills: ["C, C++, C#, Java, R and Python", "JavaScript, TypeScript, HTML, CSS", "SQL, NoSQL"],
      },
      {
        id: "developer-tools",
        title: "Developer Tools",
        icon: "Terminal",
        skills: [
          "Pycharm, Eclipse, Jupyter Notebook",
          "XCode, Visual Studio, VSCode, Code Blocks",
          "Robot Framework, Git, GitHub",
        ],
      },
      {
        id: "libraries",
        title: "Libraries & Frameworks",
        icon: "Library",
        skills: [
          "OpenCV, TensorFlow, PyTorch, Scikit-learn",
          "Seaborn, Selenium, Pandas, NumPy, Matplotlib",
          "OpenAIGym, Nengo, React, Next.js",
        ],
      },
      {
        id: "devops",
        title: "DevOps",
        icon: "Server",
        skills: [
          "CI/CD, GitHub Actions, CodePipeline",
          "Jenkins, Ansible, Docker, Kubernetes",
          "Infrastructure as Code, Terraform",
        ],
      },
      {
        id: "database",
        title: "Database",
        icon: "Database",
        skills: ["PostgreSQL, MySQL, Aurora", "MongoDB, DynamoDB"],
      },
      {
        id: "cloud",
        title: "Cloud",
        icon: "Cloud",
        skills: ["AWS (EC2, S3, Lambda, etc.)", "GCP, Azure"],
    },
  ]

  // Return the skills data as JSON
  console.log(`\n🎯 FINAL RESULT: ${skills.length} categories will be displayed on frontend`)
  console.log('📋 Categories:', skills.map(s => s.title).join(', '))

  return {
    skills: skills.length > 0 ? skills : fallbackSkills,
    meta: {
      totalSkillsInDatabase: data.results.length,
      categoriesDisplayed: skills.length,
      analysisTimestamp: new Date().toISOString()
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const cacheKey = "skills"
    const ttlMs = 5 * 60 * 1000
    const cached = await readCache<{ skills: any[]; meta?: any }>(cacheKey, ttlMs)
    if (cached) {
      const res = corsResponse(cached, 200, request)
      res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=86400")
      return res
    }

    const result = await fetchSkillsFromNotion()
    await writeCache(cacheKey, result)
    const res = corsResponse(result, 200, request)
    res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=86400")
    return res
  } catch (error) {
    console.error("Error fetching skills:", error)
    
    // Return fallback data on error
    const fallbackSkills = [
      {
        id: "programming",
        title: "Programming Languages",
        icon: "Code",
        skills: ["C, C++, C#, Java, R and Python", "JavaScript, TypeScript, HTML, CSS", "SQL, NoSQL"],
      },
      {
        id: "developer-tools",
        title: "Developer Tools",
        icon: "Terminal",
        skills: [
          "Pycharm, Eclipse, Jupyter Notebook",
          "XCode, Visual Studio, VSCode, Code Blocks",
          "Robot Framework, Git, GitHub",
        ],
      },
      {
        id: "libraries",
        title: "Libraries & Frameworks",
        icon: "Library",
        skills: [
          "OpenCV, TensorFlow, PyTorch, Scikit-learn",
          "Seaborn, Selenium, Pandas, NumPy, Matplotlib",
          "OpenAIGym, Nengo, React, Next.js",
        ],
      },
      {
        id: "devops",
        title: "DevOps",
        icon: "Server",
        skills: [
          "CI/CD, GitHub Actions, CodePipeline",
          "Jenkins, Ansible, Docker, Kubernetes",
          "Infrastructure as Code, Terraform",
        ],
      },
      {
        id: "database",
        title: "Database",
        icon: "Database",
        skills: ["PostgreSQL, MySQL, Aurora", "MongoDB, DynamoDB"],
      },
      {
        id: "cloud",
        title: "Cloud",
        icon: "Cloud",
        skills: ["AWS (EC2, S3, Lambda, etc.)", "GCP, Azure"],
      },
    ]

    return corsResponse({
      skills: fallbackSkills,
      error: error instanceof Error ? error.message : "Failed to fetch skills data"
    }, 200, request)
  }
}

// POST removed: GET-only API using Notion SDK
