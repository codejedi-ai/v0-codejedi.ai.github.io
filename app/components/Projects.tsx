"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Github, ExternalLink, Code, Award } from "lucide-react"
import ProjectCard from "./ProjectCard"
import { API_ENDPOINTS } from "@/lib/api-config"

interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image: string
  tags: string[]
  tech: string[]
  link: string
  github: string
  featured: boolean
  technical: boolean
  icon?: string | null
  iconType?: string | null
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})
  const [modalImageLoading, setModalImageLoading] = useState(false)

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Make GET request to fetch projects
        console.log("Fetching projects from:", API_ENDPOINTS.projects)
        const getResponse = await fetch(API_ENDPOINTS.projects, {
          method: "GET",
        })

        if (!getResponse.ok) {
          const errorData = await getResponse.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch projects: ${getResponse.status}`)
        }

        const getData = await getResponse.json()
        console.log("GET request successful:", getData.projects?.length || 0, "projects")

        // Use GET data
        const projectsData = getData.projects || []
        setProjects(projectsData)
        setFilteredProjects(projectsData)

        // Initialize loading states for all projects
        const initialLoadingStates = projectsData.reduce((acc: Record<string, boolean>, project: Project) => {
          acc[project.id] = true
          return acc
        }, {})
        setImageLoadingStates(initialLoadingStates)
      } catch (err) {
        console.error("Error fetching projects:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to load projects. Please try again later."
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Helper function to generate unique tags from projects
  const getAllTags = (projectsList: Project[]): string[] => {
    const allTagsList: string[] = []
    for (let i = 0; i < projectsList.length; i++) {
      const project = projectsList[i]
      for (let j = 0; j < project.tags.length; j++) {
        allTagsList.push(project.tags[j])
      }
    }
    return Array.from(new Set(allTagsList))
  }

  // Get unique tags from all projects
  const allTags = getAllTags(projects)

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

  // Render filter buttons
  const renderFilterButtons = () => {
    return (
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
    )
  }

  // Handle image loading
  const handleImageLoad = (projectId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [projectId]: false }))
  }

  const handleImageError = (projectId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [projectId]: false }))
  }

  // Open project details modal
  const openProjectDetails = (project: Project) => {
    setSelectedProject(project)
    setModalImageLoading(true)
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
        {renderFilterButtons()}

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
              <ProjectCard
                key={project.id}
                project={project}
                imageLoading={imageLoadingStates[project.id] || false}
                onImageLoad={handleImageLoad}
                onImageError={handleImageError}
                onLearnMore={openProjectDetails}
              />
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
                {modalImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
                <Image
                  src={selectedProject.image || "/placeholder.svg?height=400&width=600&query=project"}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  onLoad={() => setModalImageLoading(false)}
                  onError={(e) => {
                    console.warn(`Failed to load modal image for ${selectedProject.title}:`, selectedProject.image)
                    e.currentTarget.src = "/project-management-team.png"
                    setModalImageLoading(false)
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
                  <h3 className="text-3xl font-bold flex items-center gap-3">
                    {selectedProject.icon && selectedProject.iconType === "emoji" && (
                      <span className="text-4xl">{selectedProject.icon}</span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {selectedProject.icon && selectedProject.iconType !== "emoji" && (
                      <img src={selectedProject.icon} alt="Project icon" className="w-8 h-8 object-contain" />
                    )}
                    <span>{selectedProject.title}</span>
                  </h3>
                  {selectedProject.featured && (
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <Award className="h-4 w-4" /> Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tech && selectedProject.tech.length > 0 ? (
                    selectedProject.tech.map((techItem) => (
                      <span
                        key={`modal-${selectedProject.id}-tech-${techItem}`}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {techItem}
                      </span>
                    ))
                  ) : (
                    // Fallback to tags if tech is not available (for backward compatibility)
                    selectedProject.tags.map((tag) => (
                      <span
                        key={`modal-${selectedProject.id}-tag-${tag}`}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))
                  )}
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
