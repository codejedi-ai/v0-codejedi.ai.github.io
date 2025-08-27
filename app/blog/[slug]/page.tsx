"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { NavBar } from "../../components/NavBar"
import Footer from "../../components/Footer"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  featured: boolean
  readTime: string
  image: string
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        const response = await fetch(`/api/blog/${params.slug}`)

        if (!response.ok) {
          throw new Error("Failed to fetch blog post")
        }

        const data = await response.json()
        setPost(data.post)
      } catch (err) {
        console.error("Error fetching blog post:", err)
        setError("Failed to load blog post. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      fetchBlogPost()
    }
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="bg-dark min-h-screen">
        <NavBar />
        <div className="pt-24 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-cyan"></div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-dark min-h-screen">
        <NavBar />
        <div className="pt-24 text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">{error || "The blog post you're looking for doesn't exist."}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-gradient-primary text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark min-h-screen">
      <NavBar />
      <article className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back to blog link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-cyan hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Hero image */}
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1024px"
            />
          </div>

          {/* Post header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary-purple/20 text-primary-purple px-3 py-1 rounded-full text-sm border border-primary-purple/30"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <span>By {post.author}</span>
            </div>
          </header>

          {/* Post content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/\n/g, "<br />")
                  .replace(/## /g, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">')
                  .replace(/### /g, '<h3 class="text-xl font-semibold text-white mt-6 mb-3">')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                  .replace(/- /g, '<li class="ml-4">')
                  .replace(/<li/g, "<ul><li")
                  .replace(/li>/g, "li></ul>"),
              }}
            />
          </div>

          {/* Post footer */}
          <footer className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-gray-400">
                <p>Published on {new Date(post.publishedAt).toLocaleDateString()}</p>
                {post.updatedAt !== post.publishedAt && (
                  <p>Updated on {new Date(post.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
              <Link
                href="/blog"
                className="bg-gradient-primary text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
              >
                More Posts
              </Link>
            </div>
          </footer>
        </div>
      </article>
      <Footer />
    </div>
  )
}
