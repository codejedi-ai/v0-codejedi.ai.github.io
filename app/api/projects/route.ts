import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the projects data from the JSON file
    const dataFilePath = path.join(process.cwd(), "data", "projects.json")
    const fileContents = fs.readFileSync(dataFilePath, "utf8")
    const projects = JSON.parse(fileContents)

    // Return the projects data as JSON
    return NextResponse.json({ projects }, { status: 200 })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects data" }, { status: 500 })
  }
}
