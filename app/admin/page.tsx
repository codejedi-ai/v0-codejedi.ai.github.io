"use client"

import { useState } from "react"
import { NavBar } from "../components/NavBar"
import Footer from "../components/Footer"
import { Database, Briefcase, BookOpen, Code, ImageIcon } from "lucide-react"

interface WorkExperienceData {
  workExperience: any[]
}

interface BlogData {
  blogPosts: any[]
}

interface ProjectsData {
  projects: any[]
}

interface ImagesData {
  images: any[]
}

type DatabaseType = "work-experience" | "blog" | "projects" | "images"

export default function AdminPage() {
  const [activeDatabase, setActiveDatabase] = useState<DatabaseType>("work-experience")
  const [workExperienceData, setWorkExperienceData] = useState<WorkExperienceData | null>(null)
  const [blogData, setBlogData] = useState<BlogData | null>(null)
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null)
  const [imagesData, setImagesData] = useState<ImagesData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rawResponse, setRawResponse] = useState<string>("")

  const databases = [
    {
      id: "work-experience" as DatabaseType,
      name: "Work Experience",
      icon: Briefcase,
      endpoint: "/api/work-experience",
      description: "Fetch work experience from Notion",
    },
    {
      id: "blog" as DatabaseType,
      name: "Blog Posts",
      icon: BookOpen,
      endpoint: "/api/blog",
      description: "Fetch blog posts from Notion",
    },
    {
      id: "projects" as DatabaseType,
      name: "Projects",
      icon: Code,
      endpoint: "/api/projects",
      description: "Fetch projects from Notion",
    },
    {
      id: "images" as DatabaseType,
      name: "Images",
      icon: ImageIcon,
      endpoint: "/api/images",
      description: "Fetch images from Notion",
    },
  ]

  const fetchData = async (databaseType: DatabaseType) => {
    setIsLoading(true)
    setError(null)

    const database = databases.find((db) => db.id === databaseType)
    if (!database) return

    try {
      console.log(`🚀 Starting ${database.name} fetch...`)
      const response = await fetch(database.endpoint)

      console.log("📡 Response status:", response.status)
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(`📊 ${database.name} Data (Full Response):`, data)

      // Set data based on database type
      switch (databaseType) {
        case "work-experience":
          console.log("📊 Number of work experience entries:", data.workExperience?.length || 0)
          if (data.workExperience) {
            data.workExperience.forEach((item: any, index: number) => {
              console.log(`📋 Work Experience Entry ${index + 1}:`, item)
            })
          }
          setWorkExperienceData(data)
          break
        case "blog":
          console.log("📊 Number of blog posts:", data.blogPosts?.length || 0)
          if (data.blogPosts) {
            data.blogPosts.forEach((item: any, index: number) => {
              console.log(`📋 Blog Post ${index + 1}:`, item)
            })
          }
          setBlogData(data)
          break
        case "projects":
          console.log("📊 Number of projects:", data.projects?.length || 0)
          if (data.projects) {
            data.projects.forEach((item: any, index: number) => {
              console.log(`📋 Project ${index + 1}:`, item)
            })
          }
          setProjectsData(data)
          break
        case "images":
          console.log("📊 Number of images:", data.images?.length || 0)
          if (data.images) {
            data.images.forEach((item: any, index: number) => {
              console.log(`📋 Image ${index + 1}:`, item)
            })
          }
          setImagesData(data)
          break
      }

      setRawResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      console.error(`❌ Error fetching ${database.name}:`, err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert("Copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy:", err)
      alert("Failed to copy to clipboard")
    }
  }

  const getCurrentData = () => {
    switch (activeDatabase) {
      case "work-experience":
        return workExperienceData
      case "blog":
        return blogData
      case "projects":
        return projectsData
      case "images":
        return imagesData
      default:
        return null
    }
  }

  const getCurrentDataArray = () => {
    const data = getCurrentData()
    if (!data) return []

    switch (activeDatabase) {
      case "work-experience":
        return data.workExperience || []
      case "blog":
        return (data as BlogData).blogPosts || []
      case "projects":
        return (data as ProjectsData).projects || []
      case "images":
        return (data as ImagesData).images || []
      default:
        return []
    }
  }

  const renderWorkExperienceItem = (item: any, index: number) => (
    <div key={item.id || index} className="bg-dark-lighter/50 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Title</p>
          <p className="text-white font-medium">{item.title || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Company</p>
          <p className="text-white">{item.company || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Location</p>
          <p className="text-white">{item.location || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Year</p>
          <p className="text-white">{item.year || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Start Date</p>
          <p className="text-white">{item.startDate || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">End Date</p>
          <p className="text-white">{item.endDate || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Tenure (Days)</p>
          <p className="text-white">{item.tenure || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Link</p>
          <p className="text-white break-all">{item.link || "N/A"}</p>
        </div>
      </div>
    </div>
  )

  const renderBlogItem = (item: any, index: number) => (
    <div key={item.id || index} className="bg-dark-lighter/50 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Title</p>
          <p className="text-white font-medium">{item.title || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Category</p>
          <p className="text-white">{item.category || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Published At</p>
          <p className="text-white">{item.publishedAt || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Featured</p>
          <p className="text-white">{item.featured ? "Yes" : "No"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-gray-400 text-sm">Excerpt</p>
          <p className="text-white">{item.excerpt || "N/A"}</p>
        </div>
      </div>
    </div>
  )

  const renderProjectItem = (item: any, index: number) => (
    <div key={item.id || index} className="bg-dark-lighter/50 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Title</p>
          <p className="text-white font-medium">{item.title || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Featured</p>
          <p className="text-white">{item.featured ? "Yes" : "No"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">GitHub</p>
          <p className="text-white break-all">{item.github || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Live Link</p>
          <p className="text-white break-all">{item.link || "N/A"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-gray-400 text-sm">Description</p>
          <p className="text-white">{item.description || "N/A"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-gray-400 text-sm">Tags</p>
          <p className="text-white">{item.tags?.join(", ") || "N/A"}</p>
        </div>
      </div>
    </div>
  )

  const renderImageItem = (item: any, index: number) => (
    <div key={item.id || index} className="bg-dark-lighter/50 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Name</p>
          <p className="text-white font-medium">{item.name || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Type</p>
          <p className="text-white">{item.type || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Created Time</p>
          <p className="text-white">{item.createdTime ? new Date(item.createdTime).toLocaleDateString() : "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Last Edited</p>
          <p className="text-white">
            {item.lastEditedTime ? new Date(item.lastEditedTime).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-gray-400 text-sm">Image URL</p>
          <p className="text-white break-all">{item.imageUrl || "N/A"}</p>
        </div>
        {item.imageUrl && (
          <div className="md:col-span-2">
            <p className="text-gray-400 text-sm mb-2">Preview</p>
            <img
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.name}
              className="max-w-xs max-h-32 object-cover rounded border border-gray-600"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </div>
        )}
      </div>
    </div>
  )

  const renderFormattedItem = (item: any, index: number) => {
    switch (activeDatabase) {
      case "work-experience":
        return renderWorkExperienceItem(item, index)
      case "blog":
        return renderBlogItem(item, index)
      case "projects":
        return renderProjectItem(item, index)
      case "images":
        return renderImageItem(item, index)
      default:
        return null
    }
  }

  const activeDb = databases.find((db) => db.id === activeDatabase)
  const currentData = getCurrentData()
  const currentDataArray = getCurrentDataArray()

  return (
    <div className="bg-dark min-h-screen">
      <NavBar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
            <p className="text-gray-300">Debug and inspect API responses</p>
          </div>

          {/* Table of Contents Navigation */}
          <div className="gradient-card p-6 rounded-lg shadow-lg border-gradient mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary-cyan" />
              <h2 className="text-lg font-semibold text-white">Database Navigation</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {databases.map((database) => {
                const Icon = database.icon
                const isActive = activeDatabase === database.id
                return (
                  <button
                    key={database.id}
                    onClick={() => setActiveDatabase(database.id)}
                    className={`flex items-center gap-3 p-4 rounded-lg transition-all text-left ${
                      isActive
                        ? "bg-primary-cyan/20 text-primary-cyan border-2 border-primary-cyan/50 shadow-glow"
                        : "bg-dark-lighter/30 text-gray-300 hover:bg-dark-lighter/50 hover:text-white border-2 border-transparent"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{database.name}</h3>
                      <p className="text-sm opacity-80">{database.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="gradient-card p-8 rounded-lg shadow-lg border-gradient">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">{activeDb?.name} Notion Fetch Verbatim</h2>
                <p className="text-gray-400 mt-1">{activeDb?.description}</p>
              </div>
              <button
                onClick={() => fetchData(activeDatabase)}
                disabled={isLoading}
                className="bg-primary-cyan text-dark px-6 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 shadow-glow"
              >
                {isLoading ? "Fetching..." : `Fetch ${activeDb?.name}`}
              </button>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <h3 className="text-red-400 font-semibold mb-2">Error:</h3>
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {currentData && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-dark-lighter/50 rounded-lg p-4">
                  <h3 className="text-primary-cyan font-semibold mb-2">Summary</h3>
                  <p className="text-gray-300">
                    Found {currentDataArray.length} {activeDb?.name.toLowerCase()} entries
                  </p>
                </div>

                {/* Raw JSON Response */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-primary-cyan font-semibold">Raw JSON Response</h3>
                    <button
                      onClick={() => copyToClipboard(rawResponse)}
                      className="bg-primary-purple text-white px-4 py-1 rounded text-sm hover:opacity-90 transition-opacity"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <div className="bg-dark-lighter rounded-lg p-4 overflow-auto max-h-96">
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{rawResponse}</pre>
                  </div>
                </div>

                {/* Formatted Display */}
                {currentDataArray.length > 0 && (
                  <div>
                    <h3 className="text-primary-cyan font-semibold mb-4">Formatted Display</h3>
                    <div className="space-y-4">{currentDataArray.map(renderFormattedItem)}</div>
                  </div>
                )}
              </div>
            )}

            {!currentData && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-400">Click "Fetch {activeDb?.name}" to load data</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="gradient-card p-6 rounded-lg shadow-lg border-gradient mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Instructions</h3>
            <div className="text-gray-300 space-y-2">
              <p>• Select a database from the navigation cards above</p>
              <p>• Click "Fetch [Database Name]" to query your Notion database</p>
              <p>• Check the browser console (F12) for detailed logs</p>
              <p>• Use "Copy JSON" to copy the raw response for debugging</p>
              <p>• The formatted display shows how the data will appear in your portfolio</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
