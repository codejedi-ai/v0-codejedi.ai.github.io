import { NextResponse } from "next/server"

export const revalidate = false

export async function GET() {
  const explicitMode = process.env.BUILD_MODE || process.env.NEXT_BUILD_MODE
  const hasNotionSecret = !!process.env.NOTION_INTEGRATION_SECRET
  const inferredMode = hasNotionSecret ? "api" : "static"
  const buildMode = explicitMode ?? inferredMode

  const checks = {
    buildMode,
    hasNotionSecret,
    env: {
      NOTION_INTEGRATION_SECRET: hasNotionSecret,
      WORK_EXPERIENCE_DATABASE_ID: !!process.env.WORK_EXPERIENCE_DATABASE_ID,
      SIDE_PROJECTS_DATABASE_ID: !!process.env.SIDE_PROJECTS_DATABASE_ID,
      SKILLS_DATABASE_ID: !!process.env.SKILLS_DATABASE_ID,
    },
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(checks, { status: 200 })
}
