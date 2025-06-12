"use client"

import { useState, useEffect } from "react"
import { Code, type LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface Skill {
  id: string
  title: string
  icon: string
  skills: string[]
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch("/api/skills")

        if (!response.ok) {
          throw new Error("Failed to fetch skills")
        }

        const data = await response.json()
        setSkills(data.skills)
      } catch (err) {
        console.error("Error fetching skills:", err)
        setError("Failed to load skills. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkills()
  }, [])

  // Function to dynamically get icon component
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as Record<string, LucideIcon>)[iconName]
    return Icon ? (
      <Icon className="h-8 w-8 text-primary-cyan mr-4" />
    ) : (
      <Code className="h-8 w-8 text-primary-cyan mr-4" />
    )
  }

  return (
    <section id="skills" className="py-20 bg-dark-lighter text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-white">SKILLS</h2>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="gradient-card p-8 rounded-lg shadow-lg border-gradient hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  {getIconComponent(skill.icon)}
                  <h3 className="text-2xl font-semibold">{skill.title}</h3>
                </div>
                <ul className="space-y-3">
                  {skill.skills.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-purple rounded-full" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
