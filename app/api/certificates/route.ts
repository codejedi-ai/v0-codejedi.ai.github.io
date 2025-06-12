import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the certificates data from the JSON file
    const dataFilePath = path.join(process.cwd(), "data", "certificates.json")
    const fileContents = fs.readFileSync(dataFilePath, "utf8")
    const certificates = JSON.parse(fileContents)

    // Return the certificates data as JSON
    return NextResponse.json({ certificates }, { status: 200 })
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return NextResponse.json({ error: "Failed to fetch certificates data" }, { status: 500 })
  }
}
