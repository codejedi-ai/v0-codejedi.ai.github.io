import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Get CORS headers for API responses
 */
export function getCorsHeaders(request?: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin, X-HTTP-Method-Override",
    "Access-Control-Max-Age": "86400",
    "Access-Control-Expose-Headers": "Content-Length, Content-Type",
  }

  if (request) {
    const origin = request.headers.get("origin")
    const allowAllOrigins = process.env.ALLOW_ALL_ORIGINS === "true"
    const isDevelopment = process.env.NODE_ENV === "development"
    
    if (allowAllOrigins || isDevelopment) {
      headers["Access-Control-Allow-Origin"] = "*"
    } else if (origin) {
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
            "https://codejedi.ai",
            "https://www.codejedi.ai",
          ]
      
      if (allowedOrigins.includes(origin)) {
        headers["Access-Control-Allow-Origin"] = origin
        headers["Vary"] = "Origin"
        headers["Access-Control-Allow-Credentials"] = "true"
      } else {
        headers["Access-Control-Allow-Origin"] = "*"
      }
    } else {
      headers["Access-Control-Allow-Origin"] = "*"
    }
  } else {
    // Default to allow all if no request context
    headers["Access-Control-Allow-Origin"] = "*"
  }

  return headers
}

/**
 * Create a CORS-enabled response
 */
export function corsResponse(
  data: unknown,
  status: number = 200,
  request?: NextRequest
): NextResponse {
  const headers = getCorsHeaders(request)
  return NextResponse.json(data, { status, headers })
}

/**
 * Handle OPTIONS preflight request
 */
export function handleOptions(request: NextRequest): NextResponse {
  const headers = getCorsHeaders(request)
  return new NextResponse(null, { status: 200, headers })
}
