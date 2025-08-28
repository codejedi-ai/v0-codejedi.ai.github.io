import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

const SKILLS_DATABASE_ID = "93762143-ef43-4c4b-be97-cb7e7d2dd2f4"

// Removed force-static export for Vercel deployment

export async function GET() {
  try {
    // Fetch skills from Notion database
    const response = await notion.databases.query({
      database_id: SKILLS_DATABASE_ID,
    })

    // Group skills by category
    const skillsMap: Record<string, any> = {}

    response.results.forEach((page: any) => {
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

      const display = 
        properties.display?.checkbox ||
        properties.Display?.checkbox ||
        true // Default to true (checked) if not set

      // Only process skills that are checked (display === true) and have a valid category
      if (display === true && category !== "Uncategorized" && category) {
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

    // Convert to array and format skills into groups of related items
    const skills = Object.values(skillsMap).map((category: any) => {
      // Group skills into logical chunks for display
      const groupedSkills: string[] = []
      const skillsList = category.skills

      if (category.title === "Programming Languages") {
        // Group programming languages logically
        const cLanguages = skillsList.filter((s: string) => s.match(/^(C|C\+\+|C#)$/))
        const pythonR = skillsList.filter((s: string) => s.match(/^(Python|R|Java)$/))
        const webLangs = skillsList.filter((s: string) => s.match(/^(JavaScript|TypeScript|HTML|CSS)$/))
        const databases = skillsList.filter((s: string) => s.match(/^(SQL|NoSQL)$/))
        
        if (cLanguages.length > 0 || pythonR.length > 0) {
          groupedSkills.push([...cLanguages, ...pythonR].join(", "))
        }
        if (webLangs.length > 0) {
          groupedSkills.push(webLangs.join(", "))
        }
        if (databases.length > 0) {
          groupedSkills.push(databases.join(", "))
        }
      } else if (category.title === "Developer Tools") {
        // Group dev tools logically
        const ides = skillsList.filter((s: string) => s.match(/(PyCharm|Eclipse|Jupyter|XCode|Visual Studio|VSCode|Code Blocks)/i))
        const versionControl = skillsList.filter((s: string) => s.match(/(Git|GitHub|Robot Framework)/i))
        
        if (ides.length > 0) {
          // Split IDEs into chunks of 3-4
          for (let i = 0; i < ides.length; i += 3) {
            groupedSkills.push(ides.slice(i, i + 3).join(", "))
          }
        }
        if (versionControl.length > 0) {
          groupedSkills.push(versionControl.join(", "))
        }
      } else if (category.title === "Libraries & Frameworks") {
        // Group libraries logically
        const aiLibs = skillsList.filter((s: string) => s.match(/(OpenCV|TensorFlow|PyTorch|Scikit-learn)/i))
        const dataLibs = skillsList.filter((s: string) => s.match(/(Seaborn|Selenium|Pandas|NumPy|Matplotlib)/i))
        const webFrameworks = skillsList.filter((s: string) => s.match(/(React|Next\.js|OpenAI Gym|Nengo)/i))
        
        if (aiLibs.length > 0) {
          groupedSkills.push(aiLibs.join(", "))
        }
        if (dataLibs.length > 0) {
          groupedSkills.push(dataLibs.join(", "))
        }
        if (webFrameworks.length > 0) {
          groupedSkills.push(webFrameworks.join(", "))
        }
      } else if (category.title === "DevOps") {
        // Group DevOps tools logically
        const cicd = skillsList.filter((s: string) => s.match(/(CI\/CD|GitHub Actions|CodePipeline)/i))
        const automation = skillsList.filter((s: string) => s.match(/(Jenkins|Ansible|Docker|Kubernetes)/i))
        const iac = skillsList.filter((s: string) => s.match(/(Infrastructure|Terraform)/i))
        
        if (cicd.length > 0) {
          groupedSkills.push(cicd.join(", "))
        }
        if (automation.length > 0) {
          groupedSkills.push(automation.join(", "))
        }
        if (iac.length > 0) {
          groupedSkills.push(iac.join(", "))
        }
      } else {
        // For other categories, group in chunks of 2-3
        for (let i = 0; i < skillsList.length; i += 2) {
          groupedSkills.push(skillsList.slice(i, i + 2).join(", "))
        }
      }

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
    return NextResponse.json({ 
      skills: skills.length > 0 ? skills : fallbackSkills 
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

    return NextResponse.json({ skills: fallbackSkills }, { status: 500 })
  }
}
