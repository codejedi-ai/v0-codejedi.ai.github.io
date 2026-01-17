/**
 * Notion Database IDs - Hard-coded reference for portfolio databases
 * Generated from: https://www.notion.so/darcy-liu/portfolio-databases-42ba51e735c6425282891f116d7c2e3f
 */

export const NOTION_DATABASES = {
  // Primary Portfolio Databases
  PROJECTS: "8845d571-4240-4f4d-9e67-e54f552c4e2e",
  NON_TECHNICAL_PROJECTS: "977b4bc7-08df-45ca-8895-1f0a75c5d343",
  SKILLS_CONNECTION: "c99565e6-695a-4870-9536-b72d0417f028",

  // Support Databases
  AURAFLOW: "f4c13b3e-2932-454a-8a31-abdd36d61ebd",
  BLOGS: "311b3a08-1161-4102-b265-b91425edf4df",
  IRIS_MINECRAFT_TOKENS: "b30d62dc-c834-401f-bac1-aa47744f6eac",
  POPULATE_WITH_GITHUB: "4b2191de-9774-4122-9c06-bbcc3552cfdc",

  // Academic & Coursework Databases
  DATA_GOVERNANCE_GRADES: "9ca697e3-db34-4a11-8b1c-a611d2e14509",
  K3_CLOCK_SERVER_IMPLEMENTATION: "2440226f-c222-4fd4-b23f-7fb8a472cfa9",
  ASSIGNMENT_K3_TASK_BOARD: "0507f623-c8a8-4b3a-9bf3-dd84f5740028",

  // Personal Projects & Content
  BLOG_PURE_TO_RISE_UP: "6d770d78-10c8-4537-afc9-a71a6df214e3",
  SHOWER_THOUGHTS: "8f6cd3a4-e8e1-4a62-93ca-3e7d29ab4e22",
  MAGIC_QUILL: "87ae5d35-95af-47b7-b111-941e0711bfb0",

  // Miscellaneous Databases
  GOALS: "809f5c6b-4a29-4d9b-bcfb-3dba61988de1",
  MARKLIN_COMMANDS: "83157f37-c38f-4bf2-bac7-1b758baefcb7",
  OKRS: "193a9ae1-b608-81a2-b140-f1898c445038",
  READING_LIST: "32abdf77-5c85-460e-b772-792925f14e8e",
  CS452_LECTURE_NOTES: "8a45c2b7-16b3-4f03-91ee-eedf98e9a409",
  COMPANIES_LIST: "313a012b-9ef7-45a8-955f-d9f218a96638",
} as const

/**
 * Get database ID by key
 * @param key - Database key from NOTION_DATABASES
 * @returns Database ID string
 */
export function getDatabaseId(key: keyof typeof NOTION_DATABASES): string {
  return NOTION_DATABASES[key]
}

/**
 * Primary database for portfolio projects
 */
export const SIDE_PROJECTS_DATABASE_ID = NOTION_DATABASES.PROJECTS
