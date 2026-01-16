"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import type { YearGroup, Position } from "../types/types"
import { API_ENDPOINTS } from "@/lib/api-config"

export default function WorkExperience() {
  const [experiences, setExperiences] = useState<YearGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const quote_work_experience = "Knowledge = Experience x Sensitivity -- Yuval Noah Harari"

  useEffect(() => {
    async function fetchWorkExperience() {
      try {
        console.log("Fetching work experience from:", API_ENDPOINTS.workExperience)
        const response = await fetch(API_ENDPOINTS.workExperience)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch work experience: ${response.status}`)
        }

        const data = await response.json()

        // Group work experience by year
        const groupedByYear = data.workExperience.reduce((acc: Record<string, Position[]>, job: { year: string; startDate: string; endDate: string; emoji: string; title: string; company: string; location: string; link: string }) => {
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
            positions: positions as Position[],
          }))
          .sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year))

        setExperiences(yearGroups)
      } catch (err) {
        console.error("Error fetching work experience:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to load work experience. Please try again later."
        setError(errorMessage)
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
            className="gradient-card p-6 rounded-lg shadow-lg border-gradient
                      hover:shadow-glow transition-all duration-300
                      transform hover:scale-105"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>{position.emoji}</span>
              <span>{position.title}</span>
            </h3>
            <a
              href={position.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-cyan hover:text-white font-medium transition-colors"
            >
              {position.company}
            </a>
            <p className="text-gray-300">{position.location}</p>
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary-cyan" />
              {position.date}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="WorkExperience" className="py-20 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-center mb-4 text-white">WORK EXPERIENCE</h2>
          <p className="italic text-gray-300">{quote_work_experience}</p>
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-cyan"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-primary-pink mb-8">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-blue via-primary-cyan to-primary-purple"></div>

            {/* Clock icon at the top */}
            <div className="flex justify-center">
              <div className="bg-primary-blue text-white rounded-full p-3 z-10 shadow-glow">
                <Clock className="h-6 w-6" />
              </div>
            </div>

            {experiences.map((yearGroup, index) => (
              <div key={yearGroup.year} className="mb-0">
                <input type="hidden" name="index" value={index} />

                {/* Year marker */}
                <div className="flex justify-center mb-8 mt-8">
                  <div className="bg-primary-blue text-white px-4 py-1 rounded-full shadow-glow z-10">
                    <span className="font-semibold">{yearGroup.year}</span>
                  </div>
                </div>

                {/* Experience items */}
                <div className="space-y-10">
                  {yearGroup.positions.map((position, posIndex) => (
                    <TimelineItem key={posIndex} position={position} />
                  ))}
                </div>

                {/* Only add divider if not the last group */}
                {index < experiences.length - 1 && (
                  <div className="flex items-center w-full my-4">
                    <div className="w-full border-t-2 border-dashed border-gray-700 opacity-50"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
