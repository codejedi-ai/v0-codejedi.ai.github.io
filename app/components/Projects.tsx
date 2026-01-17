"use client"

import { useState, useEffect } from "react"
import { Code } from "lucide-react"
import ProjectCard from "./ProjectCard"

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
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Make GET request to fetch projects
        const getResponse = await fetch("/api/projects", {
          method: "GET",
        })

        if (!getResponse.ok) {
          const errorData = await getResponse.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch projects (GET): ${getResponse.status}`)
        }

        const getData = await getResponse.json()
        console.log("GET request successful:", getData.projects?.length || 0, "projects")

        // Make POST request to fetch projects (with optional query body)
        const postResponse = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Empty body for now, can add filters later
        })

        if (!postResponse.ok) {
          const errorData = await postResponse.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch projects (POST): ${postResponse.status}`)
        }

        const postData = await postResponse.json()
        console.log("POST request successful:", postData.projects?.length || 0, "projects")
        console.log("Schema info from POST:", postData)

        // Use POST data (or fallback to GET data)
        const projectsData = postData.projects || getData.projects || []
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

  // Modal removed: Learn More now navigates directly via ProjectCard link

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

        
      </div>
    </section>
  )
}
