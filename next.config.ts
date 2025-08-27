import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config for GitHub Pages deployment */
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
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
  // GitHub Pages specific configuration
  basePath: process.env.NODE_ENV === "production" ? "/codejedi.ai.github.io-v2" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/codejedi.ai.github.io-v2/" : "",
}

export default nextConfig
