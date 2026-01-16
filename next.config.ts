import type { NextConfig } from "next"

// Auto-detect build mode:
// - If BUILD_MODE is provided, respect it.
// - Otherwise, infer: presence of NOTION_INTEGRATION_SECRET => "api" (dynamic);
//   absence => "static" (export for GitHub Pages).
const explicitMode = process.env.BUILD_MODE
const hasNotionSecret = !!process.env.NOTION_INTEGRATION_SECRET
const inferredMode = hasNotionSecret ? "api" : "static"
const buildMode = explicitMode ?? inferredMode

const isStatic = buildMode === "static"

const nextConfig: NextConfig = {
  trailingSlash: true,
  // In static mode we must export and disable image optimization.
  ...(isStatic
    ? {
        output: "export",
        // Base path for GitHub Pages; override via NEXT_PUBLIC_BASE_PATH if needed.
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/codejedi.ai.github.io",
        images: { unoptimized: true },
      }
    : {
        images: {
          unoptimized: false,
          remotePatterns: [
            { protocol: "https", hostname: "prod-files-secure.s3.*.amazonaws.com", port: "", pathname: "/**" },
            { protocol: "https", hostname: "www.notion.so", port: "", pathname: "/**" },
            { protocol: "https", hostname: "blob.v0.dev", port: "", pathname: "/**" },
            { protocol: "https", hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com", port: "", pathname: "/**" },
            { protocol: "https", hostname: "images.unsplash.com", port: "", pathname: "/**" },
            { protocol: "https", hostname: "unsplash.com", port: "", pathname: "/**" },
            { protocol: "https", hostname: "cdn.jsdelivr.net", port: "", pathname: "/**" },
            { protocol: "https", hostname: "raw.githubusercontent.com", port: "", pathname: "/**" },
          ],
        },
      }),
  typescript: { ignoreBuildErrors: true },
}

// Helpful build-time log (won't leak secrets)
console.log(`[next.config] buildMode=${buildMode} (hasNotionSecret=${hasNotionSecret})`)

export default nextConfig
