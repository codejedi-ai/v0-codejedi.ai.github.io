import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Hard-coded certificates data - AWS + one featured Hugging Face certificate
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
      {
        id: "hugging-face-agents-course",
        name: "Hugging Face AI Agents Course",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hugging%20Face%20Agents%20Course%20Certificate-h7by0WgWsn0t2ppzw1UJSwuqagcWUR.webp",
        alt: "Hugging Face Agents Course Certificate of Excellence",
        date: "19 June 2025",
      },
    ]

    // Return the certificates data as JSON
    return NextResponse.json({ certificates }, { status: 200 })
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return NextResponse.json({ error: "Failed to fetch certificates data" }, { status: 500 })
  }
}
