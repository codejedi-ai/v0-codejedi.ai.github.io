"use client"

import { Component } from "react"
import Image from "next/image"
import Link from "next/link"
import { Github, ExternalLink } from "lucide-react"

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

interface ProjectCardProps {
  project: Project
  imageLoading: boolean
  onImageLoad: (projectId: string) => void
  onImageError: (projectId: string) => void
  onLearnMore: (project: Project) => void
}

export default class ProjectCard extends Component<ProjectCardProps> {
  render() {
    const { project, imageLoading, onImageLoad, onImageError, onLearnMore } = this.props

    return (
      <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 flex flex-col h-full group">
        <div className="relative h-48 overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          <Image
            src={project.image || "/placeholder.svg?height=400&width=600&query=project"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => onImageLoad(project.id)}
            onError={(e) => {
              console.warn(`Failed to load image for ${project.title}:`, project.image)
              e.currentTarget.src = "/project-management-team.png"
              onImageError(project.id)
            }}
          />
          {project.featured && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
        <div className="p-6 flex-grow">
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            {project.icon && project.iconType === "emoji" && (
              <span className="text-2xl">{project.icon}</span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {project.icon && project.iconType !== "emoji" && (
              <img src={project.icon} alt="Project icon" className="w-6 h-6 object-contain" />
            )}
            <span>{project.title}</span>
          </h3>
          <p className="text-gray-300 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech && project.tech.length > 0 ? (
              project.tech.map((techItem) => (
                <span
                  key={`${project.id}-tech-${techItem}`}
                  className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                >
                  {techItem}
                </span>
              ))
            ) : (
              // Fallback to tags if tech is not available (for backward compatibility)
              project.tags.map((tag) => (
                <span
                  key={`${project.id}-tag-${tag}`}
                  className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))
            )}
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
            onClick={() => onLearnMore(project)}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Learn More</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }
}
