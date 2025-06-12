import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the contacts data from the JSON file
    const dataFilePath = path.join(process.cwd(), "data", "contacts.json")
    const fileContents = fs.readFileSync(dataFilePath, "utf8")
    const contacts = JSON.parse(fileContents)

    // Return the contacts data as JSON
    return NextResponse.json({ contacts }, { status: 200 })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts data" }, { status: 500 })
  }
}
