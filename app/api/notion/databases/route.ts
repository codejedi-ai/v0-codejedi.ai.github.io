import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Hard-coded database mappings with properly formatted IDs
    const databases = {
      "work-experience": "46fdbe9f-11ca-4f7e-9123-8f2e9025c66d",
      blogs: "311b3a08-1161-4102-b265-b91425edf4df",
      "side-project-technical": "8845d571-4240-4f4d-9e67-e54f552c4e2e",
      images: "911ef9d8-89c2-41ad-bf82-a2a9cc41e231",
    }

    return NextResponse.json({ databases }, { status: 200 })
  } catch (error) {
    console.error("Error fetching database mappings:", error)
    return NextResponse.json({ error: "Failed to fetch database mappings" }, { status: 500 })
  }
}
