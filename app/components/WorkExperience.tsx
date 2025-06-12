"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import type { YearGroup, Position } from "../types/types"

export default function WorkExperience() {
  const [experiences, setExperiences] = useState<YearGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const quote_work_experience = "Knowledge = Experience x Sensitivity -- Yuval Noah Harari"

  useEffect(() => {
    async function fetchWorkExperience() {
      try {
        const response = await fetch("/api/work-experience")

        if (!response.ok) {
          throw new Error("Failed to fetch work experience")
        }

        const data = await response.json()

        // Group work experience by year
        const groupedByYear = data.workExperience.reduce((acc: Record<string, Position[]>, job: any) => {
          const year = job.year

          if (!acc[year]) {
            acc[year] = []
          }

          // Format the date string
          const startDate = new Date(job.startDate)
          const endDate = new Date(job.endDate)
          const startMonth = startDate.toLocaleString("default", { month: "short" })
          const endMonth = endDate.toLocaleString("default", { month: "short" })

          const formattedDate = `${startMonth} ~ ${endMonth}, ${startDate.getFullYear()}`

          acc[year].push({
            emoji: job.emoji,
            title: job.title,
            company: job.company,
            location: job.location,
            date: formattedDate,
            link: job.link,
            isLeft: Number.parseInt(year) % 2 === 1, // Alternate left/right based on odd/even year
          })

          return acc
        }, {})

        // Convert to array of YearGroup objects and sort by year (descending)
        const yearGroups = Object.entries(groupedByYear)
          .map(([year, positions]) => ({
            year,
            positions,
          }))
          .sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year))

        setExperiences(yearGroups)
      } catch (err) {
        console.error("Error fetching work experience:", err)
        setError("Failed to load work experience. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkExperience()
  }, [])

  function TimelineItem({ position }: { position: Position }) {
    return (
      <div className={`flex w-full ${position.isLeft ? "justify-start" : "justify-end"}`}>
        <div className={`w-5/12 ${position.isLeft ? "pr-8" : "pl-8"}`}>
          <div
            className="bg-white p-6 rounded-lg shadow-md
                        hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] 
                        hover:shadow-blue-500/50
                        hover:scale-105
                        hover:border-blue-500
                        border-2 border-transparent
                        transition-all duration-300 ease-in-out"
          >
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span>{position.emoji}</span>
              <span>{position.title}</span>
            </h3>
            <a
              href={position.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {position.company}
            </a>
            <p className="text-gray-600">{position.location}</p>
            <p className="text-sm text-gray-500 mt-2">{position.date}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="WorkExperience" className="py-16 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Work Experience</h2>
          <p className="italic">{quote_work_experience}</p>
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 mb-8">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
            <div className="flex justify-center">
              <div className="bg-blue-500 text-white rounded-full p-3 z-10">
                <Clock className="h-6 w-6" />
              </div>
            </div>

            {experiences.map((yearGroup, index) => (
              <div key={yearGroup.year} className="mb-0">
                <input type="hidden" name="index" value={index} />

                {/* Year marker */}
                <div className="flex justify-center mb-8">
                  <div className="absolute bg-white px-4 py-1 rounded-full shadow-sm transform">
                    <span className="text-gray-800 font-semibold">{yearGroup.year}</span>
                  </div>
                </div>

                {/* Experience items */}
                <div className="space-y-10">
                  {yearGroup.positions.map((position, posIndex) => (
                    <TimelineItem key={posIndex} position={position} />
                  ))}
                </div>
                <div className="flex items-center w-full my-4">
                  <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
