import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Get the origin from the request
    const origin = request.headers.get("origin")
    
    // Define allowed origins from environment variable or default list
    const allowedOriginsEnv = process.env.ALLOWED_ORIGINS
    const allowedOrigins = allowedOriginsEnv
      ? allowedOriginsEnv.split(",").map((o) => o.trim())
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://127.0.0.1:3000",
          "http://127.0.0.1:3001",
          "https://bolt-codejedi.ai.github.io",
          "https://codejedi-ai.github.io",
        ]
    
    // Allow all origins in development, or check against allowed list in production
    const allowAllOrigins = process.env.ALLOW_ALL_ORIGINS === "true"
    const isDevelopment = process.env.NODE_ENV === "development"
    const isAllowedOrigin = 
      allowAllOrigins ||
      isDevelopment || 
      !origin || 
      allowedOrigins.includes(origin)
    
    // Create response
    const response = NextResponse.next()
    
    // Set CORS headers - prioritize allowing all origins for better compatibility
    if (allowAllOrigins || isDevelopment) {
      response.headers.set("Access-Control-Allow-Origin", "*")
    } else if (isAllowedOrigin && origin) {
      response.headers.set("Access-Control-Allow-Origin", origin)
      response.headers.set("Vary", "Origin")
    } else {
      // If origin is not allowed, still set a default to prevent CORS errors
      response.headers.set("Access-Control-Allow-Origin", "*")
    }
    
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD"
    )
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Origin, X-HTTP-Method-Override"
    )
    
    // Only set credentials if we have a specific origin (not *)
    if (!allowAllOrigins && !isDevelopment && isAllowedOrigin && origin) {
      response.headers.set("Access-Control-Allow-Credentials", "true")
    }
    
    response.headers.set("Access-Control-Max-Age", "86400")
    response.headers.set("Access-Control-Expose-Headers", "Content-Length, Content-Type")
    
    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      })
    }
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
