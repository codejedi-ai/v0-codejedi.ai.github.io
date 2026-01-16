# API Fetch Issues - Debugging Guide

## Summary of Changes

All React components have been updated to use centralized API endpoint configuration instead of hardcoded URLs.

### Updated Components:
- **Skills.tsx** - Now fetches from `API_ENDPOINTS.skills`
- **WhoAmI.tsx** - Now fetches from `API_ENDPOINTS.aboutImages`
- **WorkExperience.tsx** - Now fetches from `API_ENDPOINTS.workExperience`
- **Certificates.tsx** - Now fetches from `API_ENDPOINTS.certificates`
- **Projects.tsx** - Now fetches from `API_ENDPOINTS.projects`

## API Endpoint Configuration

Located in [lib/api-config.ts](lib/api-config.ts):

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://codejedi-ai.vercel.app"

export const API_ENDPOINTS = {
  workExperience: `${API_BASE_URL}/api/work-experience/`,
  aboutImages: `${API_BASE_URL}/api/about-images/`,
  skills: `${API_BASE_URL}/api/skills/`,
  projects: `${API_BASE_URL}/api/projects/`,
  certificates: `${API_BASE_URL}/api/certificates/`,
  // ... other endpoints
}
```

## Environment Configuration

**GitHub Pages Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=https://codejedi-ai.vercel.app
```

**GitHub Pages Deployment:**
- URL: `https://codejedi-ai.github.io/codejedi.ai.github.io/`
- basePath: `/codejedi.ai.github.io`

## Debugging Steps

If API calls are still failing from the github.io domain:

### 1. Check Browser Console (F12)
Open the deployed site and check for:
- **CORS Errors**: Cross-Origin Resource Sharing issues
- **Network Errors**: Failed fetch requests
- **Mixed Content**: http/https issues

### 2. Verify Network Requests
In Browser DevTools Network tab:
- Check if requests are being made to `https://codejedi-ai.vercel.app/api/*`
- Look for status codes (200 = success, 401/403 = auth, 404 = not found, 5xx = server error)
- Check response headers for CORS headers: `Access-Control-Allow-Origin`

### 3. Check Console Logs
All components now log their fetch URLs:
```
"Fetching skills from: https://codejedi-ai.vercel.app/api/skills/"
"Fetching about images from: https://codejedi-ai.vercel.app/api/about-images/"
```

### 4. Verify CORS on Vercel Backend
The backend needs to allow requests from github.io:

**In proxy.ts (Vercel backend):**
```typescript
export default async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // or specific domain
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  
  // ... rest of CORS logic
}
```

### 5. Test with curl
```bash
curl -i https://codejedi-ai.vercel.app/api/skills/
```

Look for:
- 200 response code
- CORS headers in response
- Valid JSON body

## Common Issues & Solutions

### Issue: 404 Not Found
- Verify API route exists on Vercel backend
- Check trailing slashes (endpoints include `/` at end)

### Issue: CORS Blocked
- Browser shows: "Cross-Origin Request Blocked"
- Solution: Verify Vercel backend CORS headers include github.io origin

### Issue: Mixed Content Error
- GitHub Pages serves over HTTPS
- Ensure all API calls use HTTPS (they do: `https://codejedi-ai.vercel.app`)

### Issue: Timeout or No Response
- Vercel deployment might be cold-started
- First request may take 5-10 seconds
- Check if requests appear in Network tab

## Quick Verification Checklist

- [ ] Build compiles successfully (`pnpm exec next build`)
- [ ] All components import `API_ENDPOINTS` from `@/lib/api-config`
- [ ] `.env.local` has `NEXT_PUBLIC_API_URL` set
- [ ] `next.config.ts` has correct `basePath`
- [ ] Browser console shows correct API URLs in logs
- [ ] Network tab shows requests to Vercel backend
- [ ] Vercel backend returns 200 status with CORS headers

## Next Steps

1. **Deploy to GitHub Pages** with `pnpm exec next build && npm run deploy`
2. **Check deployed site** at: `https://codejedi-ai.github.io/codejedi.ai.github.io/`
3. **Open browser DevTools** (F12) and monitor Network/Console
4. **Trigger data fetches** by navigating to sections that load data
5. **Check for errors** in both Network tab and Console
6. **Review Vercel logs** at vercel.com for backend errors

## Build Status

✅ Last successful build:
```
✓ Compiled successfully in 3.7s
✓ Collecting page data using 19 workers
✓ Generating static pages using 19 workers
✓ Finalizing page optimization
```

All components updated and configured for API endpoint centralization.
