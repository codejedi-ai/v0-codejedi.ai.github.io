import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { corsResponse, handleOptions } from "@/lib/cors"

// Removed force-static export for Vercel deployment

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request)
}

export async function GET(request: NextRequest) {
  try {
    // Hard-coded certificates data - AWS certificates only
    const certificates = [
      {
        id: "aws-practitioner",
        name: "AWS Certified Practitioner",
        image: "/images/aws-practitioner.png",
        alt: "AWS Cloud Practitioner Certificate",
        date: "2 January 2021",
      },
      {
        id: "aws-developer",
        name: "AWS Certified Developer",
        image: "/images/aws-developer.png",
        alt: "AWS Developer Associate Certificate",
        date: "29 August 2021",
      },
      {
        id: "aws-devops-prof",
        name: "AWS Certified DevOps Engineer - Professional",
        image: "/images/aws-devops-prof.png",
        alt: "AWS DevOps Engineer Professional Certificate",
        date: "23 August 2024",
      },
    ]

    // Return the certificates data as JSON
    return corsResponse({ certificates }, 200, request)
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return corsResponse({ error: "Failed to fetch certificates data" }, 500, request)
  }
}
