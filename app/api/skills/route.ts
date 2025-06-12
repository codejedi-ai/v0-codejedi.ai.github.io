import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the skills data from the JSON file
    const dataFilePath = path.join(process.cwd(), "data", "skills.json")
    const fileContents = fs.readFileSync(dataFilePath, "utf8")
    const skills = JSON.parse(fileContents)

    // Return the skills data as JSON
    return NextResponse.json({ skills }, { status: 200 })
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json({ error: "Failed to fetch skills data" }, { status: 500 })
  }
}
