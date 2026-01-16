# Deployment Architecture

This project uses a **split deployment** approach:

## Frontend - GitHub Pages
- **Deployment**: GitHub Pages (static site)
- **Build**: Next.js static export (`output: export`)
- **Content**: 
  - Homepage, portfolio pages
  - Components (no API routes)
  - Static assets
- **GitHub Actions**: Runs on every push to `main` branch
- **URL**: https://codejedi-ai.github.io/

## Backend - Vercel
- **Deployment**: Vercel (serverless)
- **Content**:
  - All API routes (`/api/...`)
  - Notion integration
  - Backend logic
- **URL**: https://codejedi-ai.vercel.app/

## How It Works

1. **Frontend (GitHub Pages)** is a static site that the user downloads and views
2. **Frontend makes API calls** to the Vercel backend at `https://codejedi-ai.vercel.app/api/...`
3. **Vercel backend** handles database queries, Notion integration, and business logic
4. **Frontend displays** the data returned from the backend

## Configuration

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=https://codejedi-ai.vercel.app
```

### Backend Environment Variables (Vercel only)
- `NOTION_INTEGRATION_SECRET` - Notion API credentials
- Database IDs for Notion databases

## Directory Structure

```
/app                    # Frontend components (static pages)
/public                 # Static assets
/lib                    # Utilities, API config, CORS helpers
/.github/workflows/     # GitHub Actions (static build)

# Note: /app/api no longer exists (used only in Vercel deployment)
```

## Local Development

### Development Mode
```bash
pnpm install
pnpm dev
```
- Runs on `http://localhost:3000`
- Calls Vercel backend APIs: `https://codejedi-ai.vercel.app/api/...`

### Production Build (Static Export)
```bash
pnpm build
pnpm export  # or: next export
ls out/      # Static HTML files for GitHub Pages
```

## Deployment

### GitHub Pages
- Automatically deployed via GitHub Actions
- Triggers on push to `main` branch
- Builds static site and uploads to GitHub Pages

### Vercel (Backend)
- Connect via Vercel dashboard
- Needs `.env` with `NOTION_INTEGRATION_SECRET` and database IDs
- Handles all API routes

## Benefits

✅ **Cost**: GitHub Pages is free for static hosting  
✅ **Performance**: Static frontend = fast loads  
✅ **Scalability**: Vercel serverless scales automatically  
✅ **Separation**: Frontend and backend independently deployable  
✅ **Security**: API secrets only on Vercel backend  

## Important Notes

- ❌ No API routes in frontend (GitHub Pages can't run Node.js)
- ✅ All API calls go to Vercel backend
- ✅ Frontend calls are client-side (CORS enabled on backend)
- ✅ Static files cached forever, backend updates immediately
