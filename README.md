# CodeJedi Portfolio

A modern, responsive portfolio website showcasing my work, skills, and experience. Built with Next.js and hosted on Vercel.

🌐 **Live Site**: [https://codejedi-ai.github.io/](https://codejedi-ai.github.io/)

## 🚀 Features

- **Modern UI/UX**: Clean, dark-themed design with smooth animations and transitions
- **Dynamic Content**: Integrated with Notion API for easy content management
- **Responsive Design**: Fully responsive across all devices and screen sizes
- **Performance Optimized**: Built with Next.js 16 for optimal performance
- **CORS Enabled**: API routes configured with CORS for cross-origin requests
- **Interactive Sections**:
  - About Me with personal introduction
  - Skills showcase with categorized technologies
  - Work Experience timeline
  - Certificates gallery
  - Projects portfolio with filtering
  - Contact form with multiple contact methods

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Content Management**: Notion API
- **Deployment**: Vercel
- **QR Code Generation**: qrcode.react

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes for fetching data from Notion
│   │   ├── blog/
│   │   ├── projects/
│   │   ├── skills/
│   │   ├── work-experience/
│   │   ├── certificates/
│   │   └── contacts/
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── WhoAmI.tsx
│   │   ├── Skills.tsx
│   │   ├── WorkExperience.tsx
│   │   ├── Certificates.tsx
│   │   ├── Projects.tsx
│   │   └── Contact.tsx
│   ├── admin/            # Admin panel for content management
│   └── page.tsx          # Main page
├── lib/
│   ├── cors.ts           # CORS utility functions
│   └── utils.ts          # Helper utilities
├── middleware.ts         # Next.js middleware for CORS
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Notion API integration token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/codejedi-ai/bolt-codejedi.ai.github.io.git
cd bolt-codejedi.ai.github.io
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```env
NOTION_INTEGRATION_SECRET=your_notion_integration_secret
ALLOWED_ORIGINS=https://codejedi-ai.github.io,https://codejedi.ai
# Optional: Set to "true" to allow all origins
ALLOW_ALL_ORIGINS=false
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NOTION_INTEGRATION_SECRET` | Notion API integration secret token | Yes |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | No |
| `ALLOW_ALL_ORIGINS` | Set to "true" to allow all origins (development only) | No |

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 API Routes

All API routes are located in `app/api/` and support CORS:

- `/api/blog` - Fetch blog posts from Notion
- `/api/projects` - Fetch projects from Notion
- `/api/skills` - Fetch skills from Notion
- `/api/work-experience` - Fetch work experience from Notion
- `/api/certificates` - Fetch certificates
- `/api/about-images` - Fetch about section images
- `/api/images` - Fetch general images
- `/api/contacts` - Get contact information
- `/api/contacts/submit` - Submit contact form

All routes handle OPTIONS preflight requests and include proper CORS headers.

## 🎨 Customization

### Updating Content

Content is managed through Notion databases. Update the database IDs in the respective API route files:

- `app/api/blog/route.ts` - Blog posts database
- `app/api/projects/route.ts` - Projects database
- `app/api/skills/route.ts` - Skills database
- `app/api/work-experience/route.ts` - Work experience database

### Styling

The project uses Tailwind CSS. Customize colors and styles in:
- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - Global styles

### CORS Configuration

CORS is configured in two places:
- `middleware.ts` - Middleware-level CORS handling
- `lib/cors.ts` - Utility functions for API routes

To add allowed origins, update the `allowedOrigins` array in both files.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

The site will be automatically deployed on every push to the main branch.

### Environment Variables on Vercel

Make sure to add all required environment variables in the Vercel dashboard:
- `NOTION_INTEGRATION_SECRET`
- `ALLOWED_ORIGINS` (optional)
- `ALLOW_ALL_ORIGINS` (optional)

## 📄 License

This project is private and proprietary.

## 👤 Author

**Darcy Liu (CodeJedi)**

- Portfolio: [https://codejedi-ai.github.io/](https://codejedi-ai.github.io/)
- LinkedIn: [codejediatuw](https://www.linkedin.com/in/codejediatuw/)
- Email: d273liu@uwaterloo.ca

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Deployed on [Vercel](https://vercel.com)
- Content managed with [Notion](https://notion.so)
- Icons by [Lucide](https://lucide.dev)

---

Made with ❤️ and Next.js
