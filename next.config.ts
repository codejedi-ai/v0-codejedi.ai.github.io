import type { NextConfig } from "next"

/**
 * Build Mode Configuration
 * Set via BUILD_MODE environment variable:
 * - "static" (default): GitHub Pages static export with basePath
 * - "api": Vercel serverless with API routes
 */
const BUILD_MODE = process.env.BUILD_MODE || process.env.NEXT_BUILD_MODE || "static"
const IS_STATIC_EXPORT = BUILD_MODE === "static"
const IS_API_MODE = BUILD_MODE === "api"

console.log(`\n🔨 Next.js Build Mode: ${BUILD_MODE.toUpperCase()}\n`)

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  ...(IS_STATIC_EXPORT && { output: "export" }),
  // GitHub Pages subdirectory path (only for static mode)
  ...(IS_STATIC_EXPORT && { basePath: "/codejedi.ai.github.io" }),
  trailingSlash: true,
  images: {
    // Disable optimization for static export
    unoptimized: IS_STATIC_EXPORT,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "blob.v0.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
