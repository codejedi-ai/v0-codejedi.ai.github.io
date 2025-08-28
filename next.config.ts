import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Removed static export for Vercel deployment with dynamic API routes
  trailingSlash: true,
  images: {
    // Re-enable optimization for Vercel
    unoptimized: false,
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
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

}

export default nextConfig
