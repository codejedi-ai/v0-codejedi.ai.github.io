# Build Modes Configuration

This project supports two build modes for different deployment scenarios:

## Overview

| Aspect | Static Mode | API Mode |
|--------|-------------|----------|
| **Use Case** | GitHub Pages static frontend | Vercel with API routes |
| **Build Command** | `pnpm run build:static` | `pnpm run build:api` |
| **Dev Command** | `pnpm run dev:static` | `pnpm run dev:api` |
| **Output** | Static HTML/CSS/JS only | Serverless functions + static files |
| **API Routes** | ❌ Disabled | ✅ Enabled |
| **Middleware** | ✅ Proxy middleware | ✅ Full support |
| **Deployment** | GitHub Pages | Vercel |
| **Database Access** | ❌ Via backend API | ✅ Direct via Notion API |
| **Environment Variables** | `NEXT_PUBLIC_API_URL` | Notion credentials |

---

## Static Mode (GitHub Pages)

**Configuration:** `BUILD_MODE=static`

### Purpose
Frontend-only deployment to GitHub Pages that calls a separate Vercel backend for all API requests.

### Build
```bash
pnpm run build:static
```

### Development
```bash
pnpm run dev:static
```

### Key Configuration
- **next.config.ts:**
  - `output: "export"` - Static export enabled
  - `basePath: "/codejedi.ai.github.io"` - GitHub Pages subdirectory
  - Image optimization disabled

- **Environment:**
  - `NEXT_PUBLIC_API_URL=https://codejedi-ai.vercel.app` - Backend API URL
  - No Notion credentials needed (frontend only)

### Deployment
```bash
# Automatic via GitHub Actions
.github/workflows/nextjs.yml → GitHub Pages
```

### Architecture
```
GitHub Pages (Frontend)     Vercel Backend (API)
    ↓                              ↓
  Static HTML/CSS/JS         API Routes
  Client-side fetches   ←→   Notion Integration
```

---

## API Mode (Vercel)

**Configuration:** `BUILD_MODE=api`

### Purpose
Full-stack deployment to Vercel with both frontend and backend (API routes) running on serverless functions.

### Build
```bash
pnpm run build:api
```

### Development
```bash
pnpm run dev:api
```

### Key Configuration
- **next.config.ts:**
  - `output: "export"` not set - Dynamic rendering enabled
  - No `basePath` - Deployed at root URL
  - Image optimization enabled

- **Environment:**
  - `BUILD_MODE=api` - Enables API routes
  - Notion credentials required (backend processing)
  - `NOTION_INTEGRATION_SECRET`
  - `WORK_EXPERIENCE_DATABASE_ID`, etc.

### Deployment
```bash
# Automatic via Vercel integration
vercel.json → Vercel deployment
```

### Architecture
```
Vercel (All-in-one)
    ↓
Frontend + API Routes
    ↓
  Notion Integration
```

---

## Configuration Files

### next.config.ts
```typescript
const BUILD_MODE = process.env.BUILD_MODE || "static"
const IS_STATIC_EXPORT = BUILD_MODE === "static"

// Conditional exports
...(IS_STATIC_EXPORT && { output: "export" }),
...(IS_STATIC_EXPORT && { basePath: "/codejedi.ai.github.io" }),
```

### package.json Scripts
```json
{
  "scripts": {
    "build": "npm run build:static",
    "build:static": "cross-env BUILD_MODE=static pnpm exec next build",
    "build:api": "cross-env BUILD_MODE=api pnpm exec next build",
    "dev:static": "cross-env BUILD_MODE=static pnpm exec next dev --turbopack",
    "dev:api": "cross-env BUILD_MODE=api pnpm exec next dev --turbopack"
  }
}
```

### vercel.json (API Mode)
```json
{
  "buildCommand": "BUILD_MODE=api pnpm run build:api",
  "devCommand": "BUILD_MODE=api pnpm run dev:api"
}
```

### .github/workflows/nextjs.yml (Static Mode)
```yaml
- name: Build static frontend with Next.js
  run: pnpm run build:static
  env:
    BUILD_MODE: static
```

---

## When to Use Each Mode

### Use **Static Mode** if:
- You want to host frontend on GitHub Pages (free)
- You need a separate backend for API routes (Vercel, AWS, etc.)
- You want minimal deployment complexity for the frontend
- You're okay with client-side API calls and potential CORS issues

### Use **API Mode** if:
- You want everything on one platform (Vercel)
- You need server-side rendering or dynamic routes
- You want API routes colocated with frontend
- You need backend processing before sending data to frontend

---

## Switching Between Modes

### For Development
```bash
# Static mode (calls Vercel backend)
pnpm run dev:static

# vs API mode (everything local)
pnpm run dev:api
```

### For Building
```bash
# Static mode (outputs to ./out)
pnpm run build:static

# vs API mode (Vercel-ready build)
pnpm run build:api
```

### Default Mode
- `pnpm run build` → defaults to `build:static`
- `pnpm run dev` → defaults to `dev:static`

---

## Environment Variables

### Always Required
```bash
NEXT_PUBLIC_API_URL=https://codejedi-ai.vercel.app
```

### Only for API Mode
```bash
NOTION_INTEGRATION_SECRET=your_secret
WORK_EXPERIENCE_DATABASE_ID=your_id
BLOGS_DATABASE_ID=your_id
SIDE_PROJECTS_DATABASE_ID=your_id
IMAGES_DATABASE_ID=your_id
```

---

## Troubleshooting

### Build Error: "API routes not supported"
- **Cause:** Trying to use API routes in static mode
- **Solution:** Use `pnpm run build:api` or switch BUILD_MODE to "api"

### Build Error: "Cannot find module"
- **Cause:** Missing `cross-env` package
- **Solution:** `pnpm add --save-dev cross-env`

### Images not loading in static mode
- **Cause:** Image optimization disabled
- **Solution:** This is expected - images load from remote URLs

### CORS errors when calling API
- **Cause:** Frontend and backend on different domains
- **Cause:** Backend not configured for CORS from github.io
- **Solution:** Check backend CORS configuration in proxy.ts

---

## Performance Considerations

### Static Mode
- ✅ No server overhead (pure static files)
- ✅ Faster edge delivery via GitHub Pages CDN
- ❌ Client-side API calls may be slower
- ❌ Potential CORS issues

### API Mode
- ✅ Server-side rendering possible
- ✅ No CORS issues (same domain)
- ✅ Better data privacy (Notion credentials server-side)
- ❌ Serverless cold starts (first request slower)
- ❌ Pays for compute time

---

## Deployment Checklist

### For Static Mode (GitHub Pages)
- [ ] `BUILD_MODE=static` in GitHub Actions
- [ ] `NEXT_PUBLIC_API_URL` set to Vercel backend
- [ ] Backend CORS configured for github.io domain
- [ ] `pnpm run build:static` produces `./out` directory
- [ ] GitHub Pages points to `./out` directory

### For API Mode (Vercel)
- [ ] `vercel.json` configured with `BUILD_MODE=api`
- [ ] All Notion environment variables set in Vercel dashboard
- [ ] `pnpm run build:api` produces `.next` directory
- [ ] Vercel deployment automatic or manual via `vercel deploy`

---

## See Also

- [DEPLOYMENT.md](DEPLOYMENT.md) - Architecture and deployment guide
- [API-DEBUGGING.md](API-DEBUGGING.md) - Debug API fetch issues
- [next.config.ts](next.config.ts) - Build configuration
- [vercel.json](vercel.json) - Vercel deployment config
