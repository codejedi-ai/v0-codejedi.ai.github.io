import { Client } from "@notionhq/client"

// Notion Configuration - Environment variables only for security
export const NOTION_CONFIG = {
  API_KEY: process.env.NOTION_API_KEY || "",
  SKILLS_DATABASE_ID: process.env.NOTION_SKILLS_DATABASE_ID || "",
  EXPERIENCE_DATABASE_ID: process.env.NOTION_EXPERIENCE_DATABASE_ID || ""
}

// Initialize Notion client only if API key is available
export const notion = NOTION_CONFIG.API_KEY ? new Client({ 
  auth: NOTION_CONFIG.API_KEY 
}) : null

// TypeScript interfaces
export interface NotionSkill {
  id: string
  name: string
  category: string
  level: number
  description?: string
}

export interface NotionExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  technologies: string[]
  location?: string
}

// Notion API functions using the request method
export async function getSkillsFromNotion(): Promise<NotionSkill[]> {
  try {
    if (!notion || !NOTION_CONFIG.API_KEY || !NOTION_CONFIG.SKILLS_DATABASE_ID) {
      console.log('Notion not configured for skills, using fallback data')
      return []
    }

    console.log('🔍 Fetching skills from Notion database:', NOTION_CONFIG.SKILLS_DATABASE_ID)

    // Use the request method for better compatibility
    const response = await notion.request({
      path: `databases/${NOTION_CONFIG.SKILLS_DATABASE_ID}/query`,
      method: 'post',
      body: {
        sorts: [
          {
            property: 'Name',
            direction: 'ascending',
          },
        ],
      },
    }) as any

    console.log('✅ Skills API response received, processing', response.results?.length || 0, 'items')

    if (!response.results) {
      console.log('No results in response:', response)
      return []
    }

    return response.results.map((page: any) => {
      const properties = page.properties
      
      return {
        id: page.id,
        name: properties.Name?.title?.[0]?.text?.content || properties.Name?.title?.[0]?.plain_text || '',
        category: properties.category?.select?.name || 'Other',
        level: 85, // Default level
        description: properties.Description?.rich_text?.[0]?.text?.content || properties.Description?.rich_text?.[0]?.plain_text || '',
      }
    })
  } catch (error) {
    console.error('❌ Error fetching skills from Notion:', error)
    return []
  }
}

export async function getExperienceFromNotion(): Promise<NotionExperience[]> {
  try {
    if (!notion || !NOTION_CONFIG.API_KEY || !NOTION_CONFIG.EXPERIENCE_DATABASE_ID) {
      console.log('Notion not configured for experience, using fallback data')
      return []
    }

    console.log('🔍 Fetching experience from Notion database:', NOTION_CONFIG.EXPERIENCE_DATABASE_ID)

    // Use the request method for better compatibility
    const response = await notion.request({
      path: `databases/${NOTION_CONFIG.EXPERIENCE_DATABASE_ID}/query`,
      method: 'post',
      body: {
        sorts: [
          {
            property: 'date',
            direction: 'descending',
          },
        ],
      },
    }) as any

    console.log('✅ Experience API response received, processing', response.results?.length || 0, 'items')

    if (!response.results) {
      console.log('No results in response:', response)
      return []
    }

    return response.results.map((page: any) => {
      const properties = page.properties
      
      return {
        id: page.id,
        company: properties.company?.rich_text?.[0]?.text?.content || properties.company?.rich_text?.[0]?.plain_text || '',
        position: properties.title?.title?.[0]?.text?.content || properties.title?.title?.[0]?.plain_text || '',
        startDate: properties.date?.date?.start || '',
        endDate: properties.date?.date?.end || undefined,
        description: properties.Description?.rich_text?.[0]?.text?.content || properties.Description?.rich_text?.[0]?.plain_text || '',
        technologies: properties.Technologies?.multi_select?.map((tech: any) => tech.name) || [],
        location: properties.location?.rich_text?.[0]?.text?.content || properties.location?.rich_text?.[0]?.plain_text || '',
      }
    })
  } catch (error) {
    console.error('❌ Error fetching experience from Notion:', error)
    return []
  }
}