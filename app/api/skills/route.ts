import { NextResponse } from "next/server"

const SKILLS_DATABASE_ID = "93762143-ef43-4c4b-be97-cb7e7d2dd2f4"

export async function GET() {
  try {
    console.log("Fetching skills from Notion using REST API...")
    console.log("Database ID:", SKILLS_DATABASE_ID)
    console.log("Integration Secret exists:", !!process.env.NOTION_INTEGRATION_SECRET)

    if (!process.env.NOTION_INTEGRATION_SECRET) {
      throw new Error("NOTION_INTEGRATION_SECRET is not configured")
    }

    // Fetch skills from Notion database using REST API
    const response = await fetch(`https://api.notion.com/v1/databases/${SKILLS_DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_INTEGRATION_SECRET}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Notion API error:", response.status, errorText)
      throw new Error(`Notion API returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()

    // Analysis logging
    console.log('\n🔍 SKILLS DATABASE ANALYSIS:')
    console.log(`📊 Total skills in database: ${data.results.length}`)

    // Show all skills that will be processed
    console.log('\n📋 ALL SKILLS IN DATABASE:')
    data.results.forEach((page: { properties: Record<string, unknown> }, index: number) => {
      const properties = page.properties
      const name = properties.Name?.title?.[0]?.plain_text || "Untitled"
      const category = properties.category?.select?.name || "No Category"
      console.log(`   ${index + 1}. ${name} [${category}]`)
    })

    // Group skills by category
    const skillsMap: Record<string, { id: string; title: string; icon: string; skills: string[] }> = {}

    data.results.forEach((page: { properties: Record<string, unknown> }) => {
      const properties = page.properties
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

    return NextResponse.json({
      skills: skills.length > 0 ? skills : fallbackSkills,
      meta: {
        totalSkillsInDatabase: data.results.length,
        categoriesDisplayed: skills.length,
        analysisTimestamp: new Date().toISOString()
      }
    }, { status: 200 })
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

    return NextResponse.json({
      skills: fallbackSkills,
      error: error instanceof Error ? error.message : "Failed to fetch skills data"
    }, { status: 200 })
  }
}
