import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the work experience data from the JSON file
    const dataFilePath = path.join(process.cwd(), "data", "work-experience.json")
    const fileContents = fs.readFileSync(dataFilePath, "utf8")
    const workExperience = JSON.parse(fileContents)

    // Return the work experience data as JSON
    return NextResponse.json({ workExperience }, { status: 200 })
  } catch (error) {
    console.error("Error fetching work experience:", error)
    return NextResponse.json({ error: "Failed to fetch work experience data" }, { status: 500 })
  }
}
