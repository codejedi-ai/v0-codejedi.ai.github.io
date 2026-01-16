import { NextResponse } from "next/server"

export async function GET() {
  const buildMode = process.env.BUILD_MODE || process.env.NEXT_BUILD_MODE || "static"
  const checks = {
    buildMode,
    hasNotionSecret: !!process.env.NOTION_INTEGRATION_SECRET,
    env: {
      NOTION_INTEGRATION_SECRET: !!process.env.NOTION_INTEGRATION_SECRET,
      WORK_EXPERIENCE_DATABASE_ID: !!process.env.WORK_EXPERIENCE_DATABASE_ID,
      SIDE_PROJECTS_DATABASE_ID: !!process.env.SIDE_PROJECTS_DATABASE_ID,
      SKILLS_DATABASE_ID: !!process.env.SKILLS_DATABASE_ID,
    },
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(checks, { status: 200 })
}
