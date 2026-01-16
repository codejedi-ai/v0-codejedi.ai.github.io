# Build Modes Configuration - Implementation Summary

## ✅ What Was Configured

### 1. **next.config.ts** - Dual Build Mode Support
- Detects `BUILD_MODE` environment variable
- **Static Mode** (`BUILD_MODE=static`):
  - Enables `output: "export"` for static site generation
  - Adds `basePath: "/codejedi.ai.github.io"` for GitHub Pages subdirectory
  - Disables image optimization
- **API Mode** (`BUILD_MODE=api`):
  - Disables `output: "export"` for dynamic rendering
  - No basePath (root deployment)
  - Enables image optimization
- Logs build mode on startup: `🔨 Next.js Build Mode: [STATIC|API]`

### 2. **package.json** - Build Scripts
```json
{
  "build": "npm run build:static",                    // Default → static
  "build:static": "cross-env BUILD_MODE=static ...",  // GitHub Pages
  "build:api": "cross-env BUILD_MODE=api ...",        // Vercel
  "dev": "cross-env BUILD_MODE=static ...",           // Default dev
  "dev:static": "cross-env BUILD_MODE=static ...",    // Static dev
  "dev:api": "cross-env BUILD_MODE=api ...",          // API dev
  "start:api": "cross-env BUILD_MODE=api ..."         // API production
}
```

### 3. **GitHub Actions Workflow** - Static Mode Build
- Updated `.github/workflows/nextjs.yml`
- Uses `pnpm run build:static` command
- Sets `BUILD_MODE=static` environment variable
- Deploys `./out` to GitHub Pages

### 4. **vercel.json** - API Mode Config
- Created Vercel deployment configuration
- Build command: `BUILD_MODE=api pnpm run build:api`
- Dev command: `BUILD_MODE=api pnpm run dev:api`
- Includes environment variable references for Notion credentials

### 5. **Dependencies**
- Added `cross-env` for cross-platform environment variable support
- Works on Windows, macOS, and Linux

### 6. **Environment Configuration** - .env.example
- Documented `BUILD_MODE` variable
- Separated GitHub Pages vs Vercel backend configs
- Clear comments for each environment

### 7. **Documentation**
- `BUILD-MODES.md` - Comprehensive guide (tables, architecture, troubleshooting)
- `BUILD-MODES-QUICK.md` - Quick reference (common commands, cheat sheet)

---

## 📦 Current Build Setup

### Package.json Scripts Now Support:

**Build Commands:**
```bash
pnpm run build          # → build:static (default, GitHub Pages)
pnpm run build:static   # Explicit static build for GitHub Pages
pnpm run build:api      # Dynamic build for Vercel with API routes
```

**Development Commands:**
```bash
pnpm run dev            # → dev:static (default, calls Vercel backend)
pnpm run dev:static     # Local dev with static frontend
pnpm run dev:api        # Local dev with full API routes
```

**Production Commands:**
```bash
pnpm run start          # Start API server (Vercel)
pnpm run start:api      # Explicit API server
```

---

## 🎯 How It Works

### Static Mode Flow
```
Dev/Build → BUILD_MODE=static → next.config.ts
  ↓
Sets output: "export"
Sets basePath: "/codejedi.ai.github.io"
Disables API routes
  ↓
Outputs: ./out/
  ↓
Deployed to: GitHub Pages
  ↓
Frontend calls: https://codejedi-ai.vercel.app/api/*
```

### API Mode Flow
```
Dev/Build → BUILD_MODE=api → next.config.ts
  ↓
Skips output: "export"
Skips basePath
Enables API routes
  ↓
Outputs: ./.next/
  ↓
Deployed to: Vercel
  ↓
Everything on: https://codejedi-ai.vercel.app
```

---

## ✅ Verification

Both modes have been tested and work correctly:

### Static Mode Test
```
✓ Compiled successfully in 3.1s
✓ Collecting page data using 19 workers
✓ Generating static pages using 19 workers (3/3)
✓ Finalizing page optimization
Route: ○ / (Static)
Output: ./out/codejedi.ai.github.io/
```

### API Mode Test
```
✓ Compiled successfully in 3.2s
✓ Collecting page data using 19 workers
✓ Generating static pages using 19 workers (3/3)
✓ Finalizing page optimization
Output: ./.next/ (ready for Vercel)
```

---

## 🚀 Usage Examples

### For GitHub Pages (Static)
```bash
# Development
pnpm run dev:static

# Build
pnpm run build:static

# Deploy (automatic via GitHub Actions)
git push origin main
```

### For Vercel (API)
```bash
# Development
pnpm run dev:api

# Build
pnpm run build:api

# Deploy (automatic via Vercel webhook)
git push  # or: pnpm exec vercel deploy
```

### Switch Between Modes
```bash
# Currently running static mode
pnpm run dev:static

# Switch to API mode
pnpm run dev:api

# No configuration changes needed - env var handles it!
```

---

## 📋 Environment Variables

### For Static Mode (GitHub Pages)
```bash
# .env.local
BUILD_MODE=static
NEXT_PUBLIC_API_URL=https://codejedi-ai.vercel.app
```

### For API Mode (Vercel)
```bash
# .env.local or Vercel dashboard
BUILD_MODE=api
NOTION_INTEGRATION_SECRET=...
WORK_EXPERIENCE_DATABASE_ID=...
# ... other Notion credentials
```

---

## 🔄 Default Behavior

- `pnpm run build` → `pnpm run build:static` (GitHub Pages)
- `pnpm run dev` → static mode (calls backend)
- `pnpm run start` → API mode (Vercel)

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Build configuration with mode detection |
| `package.json` | Scripts with cross-env for mode switching |
| `vercel.json` | Vercel deployment config (API mode) |
| `.github/workflows/nextjs.yml` | GitHub Actions for static build |
| `.env.example` | Environment variable documentation |
| `BUILD-MODES.md` | Comprehensive guide |
| `BUILD-MODES-QUICK.md` | Quick reference |

---

## 🎉 What This Enables

✅ Single codebase, two deployment targets
✅ Easy switching between GitHub Pages and Vercel
✅ Automatic configuration based on build mode
✅ Clear, documented build process
✅ Cross-platform support (Windows, macOS, Linux)
✅ Both static and dynamic capabilities

---

## Next Steps

1. **Use Static Mode for GitHub Pages** (current default)
   ```bash
   pnpm run build:static
   ```

2. **Use API Mode for Vercel** (when ready)
   ```bash
   pnpm run build:api
   git push  # Vercel auto-deploys
   ```

3. **Update CI/CD as needed**
   - GitHub Actions already configured for static mode
   - Vercel deployment ready via vercel.json

---

*Build modes configured: 2024-01-16*
*Supports: Static (GitHub Pages) + API Dynamic (Vercel)*
