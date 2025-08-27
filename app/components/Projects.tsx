"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Github, ExternalLink, Code, Award } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image: string
  tags: string[]
  link: string
  github: string
  featured: boolean
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")

        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data = await response.json()
        setProjects(data.projects)
        setFilteredProjects(data.projects)
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("Failed to load projects. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Get unique tags from all projects
  const allTags = Array.from(new Set(projects.flatMap((project) => project.tags)))

  // Filter projects by tag
  const filterProjects = (filter: string) => {
    setActiveFilter(filter)
    if (filter === "all") {
      setFilteredProjects(projects)
    } else if (filter === "featured") {
      setFilteredProjects(projects.filter((project) => project.featured))
    } else {
      setFilteredProjects(projects.filter((project) => project.tags.includes(filter)))
    }
  }

  // Open project details modal
  const openProjectDetails = (project: Project) => {
    setSelectedProject(project)
    document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
  }

  // Close project details modal
  const closeProjectDetails = () => {
    setSelectedProject(null)
    document.body.style.overflow = "auto" // Re-enable scrolling
  }

  return (
    <section id="projects" className="py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-center mb-4 text-white">PROJECTS</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore my side projects and personal endeavors that showcase my passion for technology and innovation.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => filterProjects("all")}
            className={`px-4 py-2 rounded-full transition-all ${
              activeFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => filterProjects("featured")}
            className={`px-4 py-2 rounded-full transition-all ${
              activeFilter === "featured" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Featured
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => filterProjects(tag)}
              className={`px-4 py-2 rounded-full transition-all ${
                activeFilter === tag ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 flex flex-col h-full group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg?height=400&width=600&query=project"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      console.warn(`Failed to load image for ${project.title}:`, project.image)
                      e.currentTarget.src = "/project-management-team.png"
                    }}
                  />
                  {project.featured && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={`${project.id}-${tag}`}
                        className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6 pt-0 flex justify-between">
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span>Code</span>
                  </Link>
                  <button
                    onClick={() => openProjectDetails(project)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>Learn More</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No projects found with the selected filter.</p>
          </div>
        )}

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative h-64 md:h-80">
                <Image
                  src={selectedProject.image || "/placeholder.svg?height=400&width=600&query=project"}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  onError={(e) => {
                    console.warn(`Failed to load modal image for ${selectedProject.title}:`, selectedProject.image)
                    e.currentTarget.src = "/project-management-team.png"
                  }}
                />
                <button
                  onClick={closeProjectDetails}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Close details"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-bold">{selectedProject.title}</h3>
                  {selectedProject.featured && (
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <Award className="h-4 w-4" /> Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={`modal-${selectedProject.id}-${tag}`}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="prose prose-invert max-w-none mb-8">
                  {selectedProject.longDescription ? (
                    selectedProject.longDescription.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="mb-4">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p>{selectedProject.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Link
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Visit Project
                  </Link>
                  <Link
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    View Code
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
