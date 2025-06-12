import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the about images data from the JSON file
    const dataFilePath = path.join(process.cwd(), "data", "about-images.json")
    const fileContents = fs.readFileSync(dataFilePath, "utf8")
    const aboutImages = JSON.parse(fileContents)

    // Return the about images data as JSON
    return NextResponse.json({ aboutImages }, { status: 200 })
  } catch (error) {
    console.error("Error fetching about images:", error)
    return NextResponse.json({ error: "Failed to fetch about images data" }, { status: 500 })
  }
}
