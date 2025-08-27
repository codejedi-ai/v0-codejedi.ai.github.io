"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ChevronRight, BookOpen } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  author: string
  publishedAt: string
  tags: string[]
  featured: boolean
  readTime: string
  image: string
  category: string
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch("/api/blog")

        if (!response.ok) {
          throw new Error("Failed to fetch blog posts")
        }

        const data = await response.json()
        setBlogPosts(data.blogPosts)
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError("Failed to load blog posts. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(blogPosts.map((post) => post.category)))]

  // Filter posts by category
  const filteredPosts =
    activeCategory === "all" ? blogPosts : blogPosts.filter((post) => post.category === activeCategory)

  const featuredPosts = filteredPosts.filter((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  // Get Hugging Face Journey posts for special section
  const huggingFacePosts = blogPosts.filter((post) => post.category === "Hugging Face Journey")

  return (
    <section id="blog" className="py-20 bg-dark-lighter text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-center mb-4 text-white">BLOG</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sharing insights, experiences, and learnings from my journey in AI, cloud computing, and software
            development.
          </p>
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
          <div className="max-w-6xl mx-auto">
            {/* Hugging Face Journey Section */}
            {huggingFacePosts.length > 0 && (
              <div className="mb-16">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-4xl">🤗</span>
                    <h3 className="text-3xl font-bold text-gradient">Hugging Face Journey</h3>
                  </div>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Documenting my learning journey through the Hugging Face ecosystem, exploring AI agents and
                    cutting-edge ML technologies.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {huggingFacePosts.map((post) => (
                    <article
                      key={post.id}
                      className="gradient-card rounded-lg overflow-hidden shadow-lg border-gradient group hover:shadow-glow transition-all duration-300"
                    >
                      <div className="relative h-32 overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="bg-primary-purple/80 text-white px-2 py-1 rounded text-xs font-semibold">
                            🤗 HF
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-primary-cyan transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="bg-dark text-primary-purple px-1 py-0.5 rounded text-xs border border-primary-purple/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-primary-cyan hover:text-white transition-colors text-sm"
                        >
                          Read More <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="text-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 bg-gradient-primary text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity shadow-glow"
                  >
                    <BookOpen className="h-4 w-4" />
                    View All Hugging Face Posts
                  </Link>
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    activeCategory === category
                      ? "bg-primary-cyan text-dark font-semibold"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {category === "all" ? "All Posts" : category}
                </button>
              ))}
            </div>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold mb-8 text-primary-cyan">Featured Posts</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="gradient-card rounded-lg overflow-hidden shadow-lg border-gradient group hover:shadow-glow transition-all duration-300"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary-cyan text-dark px-2 py-1 rounded text-xs font-semibold">
                            FEATURED
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-dark/80 text-primary-cyan px-2 py-1 rounded text-xs">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary-cyan transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-dark text-primary-purple px-2 py-1 rounded text-xs border border-primary-purple/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-primary-cyan hover:text-white transition-colors"
                        >
                          Read More <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold mb-8 text-white">Recent Posts</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <article
                      key={post.id}
                      className="gradient-card rounded-lg overflow-hidden shadow-lg border-gradient group hover:shadow-glow transition-all duration-300"
                    >
                      <div className="relative h-32 overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="bg-dark/80 text-primary-cyan px-2 py-1 rounded text-xs">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-primary-cyan transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="bg-dark text-primary-purple px-1 py-0.5 rounded text-xs border border-primary-purple/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-primary-cyan hover:text-white transition-colors text-sm"
                        >
                          Read More <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
