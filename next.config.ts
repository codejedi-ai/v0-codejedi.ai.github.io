import type { NextConfig } from "next"

// Static export for GitHub Pages frontend
// For Vercel deployment, remove output: "export"
const IS_STATIC_EXPORT = true

const nextConfig: NextConfig = {
  ...(IS_STATIC_EXPORT && { output: "export" }),
  basePath: "/codejedi.ai.github.io",
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
