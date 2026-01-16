# Quick Start - Build Modes

## Available Commands

```bash
# Build
pnpm run build           # Static mode (GitHub Pages) - DEFAULT
pnpm run build:static    # Explicitly static for GitHub Pages
pnpm run build:api       # API mode for Vercel

# Development
pnpm run dev             # Static mode (calls Vercel backend)
pnpm run dev:static      # Explicitly static mode dev server
pnpm run dev:api         # API mode dev server with local APIs

# Production
pnpm run start           # Start API mode server (use with vercel.json)
pnpm run start:api       # Explicitly API mode server
```

## Build Mode Summary

| Command | Mode | Use Case | Output |
|---------|------|----------|--------|
| `pnpm run build` | static | GitHub Pages | `./out/` |
| `pnpm run build:api` | api | Vercel | `./.next/` |
| `pnpm run dev` | static | Local dev (calls backend) | Dev server |
| `pnpm run dev:api` | api | Local dev (full stack) | Dev server |

## Environment Detection

The build mode is detected from:
1. `BUILD_MODE` environment variable (highest priority)
2. `NEXT_BUILD_MODE` environment variable (fallback)
3. Default: `"static"`

## File Structure Output

### Static Mode (`pnpm run build:static`)
```
./out/
├── codejedi.ai.github.io/    (basePath)
│   ├── index.html
│   ├── _next/
│   │   ├── static/
│   │   └── data/
│   └── ...
```

### API Mode (`pnpm run build:api`)
```
./.next/
├── server/
│   ├── app/
│   │   ├── api/              (API routes)
│   │   └── page.js
│   └── chunks/
├── static/
│   └── ...
```

## When Deploying

### To GitHub Pages
```bash
pnpm run build:static
# Commit ./out to gh-pages branch
# or use GitHub Actions (automatic)
```

### To Vercel
```bash
pnpm run build:api
git push  # Vercel auto-builds via webhook
# or: pnpm exec vercel deploy
```

## Environment Variables

### .env.local (for all modes)
```bash
BUILD_MODE=static  # or "api"
NEXT_PUBLIC_API_URL=https://codejedi-ai.vercel.app
```

### .env.local (for API mode only)
```bash
NOTION_INTEGRATION_SECRET=...
WORK_EXPERIENCE_DATABASE_ID=...
BLOGS_DATABASE_ID=...
SIDE_PROJECTS_DATABASE_ID=...
IMAGES_DATABASE_ID=...
```

## Troubleshooting

**Q: How do I know which mode is active?**
```
Watch for: "🔨 Next.js Build Mode: STATIC" or "🔨 Next.js Build Mode: API"
```

**Q: Static build uses all ENV, but API mode ignores them?**
A: Static mode uses only `NEXT_PUBLIC_*` vars (client-safe). API mode needs non-public vars for backend.

**Q: Can I switch modes mid-project?**
A: Yes! Just run the other build command. Config auto-adjusts.

## Related Documentation

- [BUILD-MODES.md](BUILD-MODES.md) - Detailed mode comparison
- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
- [API-DEBUGGING.md](API-DEBUGGING.md) - Debug API issues
