# Projects Database - Property ID Reference

**Database ID:** `8845d571-4240-4f4d-9e67-e54f552c4e2e`  
**URL:** https://www.notion.so/8845d57142404f4d9e67e54f552c4e2e  
**Last Updated:** January 17, 2026

---

## Property IDs Mapping

| Property Name | Type | Property ID | URL Encoded |
|---------------|------|-------------|-------------|
| **Title** | Title | `title` | `title` |
| **Description** | Rich Text | `e4bb3d99-05fa-428e-a00d-f587995e1488` | `e4bb3d99-05fa-428e-a00d-f587995e1488` |
| **url** | URL | `%7Dsuo` | `}suo` |
| **GitHub** | URL | `%3D%40X%3A` | `=@X:` |
| **Featured** | Checkbox | `JAfr` | `JAfr` |
| **Tags** | Multi-Select | `%3BrXv` | `;rXv` |
| **Tech** | Multi-Select | `g%7D%3BV` | `g};V` |

---

## Usage Examples

### Query Projects with Filters

```javascript
// Fetch all projects
const response = await fetch('https://api.notion.com/v1/databases/8845d571-4240-4f4d-9e67-e54f552c4e2e/query', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28'
  },
  body: JSON.stringify({
    filter: {
      property: 'Featured',
      checkbox: {
        equals: true
      }
    }
  })
});
```

### Access Specific Properties

```javascript
// Extract project data
const project = response.results[0];
const title = project.properties.Title.title[0]?.plain_text;
const description = project.properties.Description.rich_text[0]?.plain_text;
const projectUrl = project.properties.url.url;
const githubUrl = project.properties.GitHub.url;
const isFeatured = project.properties.Featured.checkbox;
const tags = project.properties.Tags.multi_select.map(t => t.name);
const tech = project.properties.Tech.multi_select.map(t => t.name);
```

---

## Tech Stack Options

The **Tech** multi-select property contains 40+ predefined options:

### Languages & Frameworks
- Python
- JavaScript
- TypeScript
- React
- C++17
- Java
- Go
- Rust

### AI/ML & Data Science
- AI/ML
- LLMs
- Computer Vision
- Diffusion Models
- Image Segmentation
- Time Series Analysis
- ARIMA
- LSTM
- XGBoost
- NLP

### Cryptography & Security
- Cryptography
- DH Key Exchange
- AES-256-CBC
- HMAC-SHA256

### Algorithms & CS Concepts
- A* Algorithm
- Graph Theory
- DFA/LR(1) Parsing
- AST Parsing
- Route Planning
- Optimization

### Tools & DevOps
- VS Code Extension
- CMake
- Docker
- Kubernetes

### Specialized Tech
- Cohere API
- Code Visualization
- Educational Technology
- HTTP/Socket Programming
- MIPS Assembly
- Repository Analysis
- AI Code Review

---

## Tag Options

The **Tags** multi-select property has 4 categories:

- **AI** (green)
- **SWE** (blue)
- **Quant** (yellow)
- **CS** (default)

---

## API Integration Notes

### For `/api/projects` Endpoint

The Next.js route at `app/api/projects/route.ts` extracts:
- Title → `properties.Title.title[0].plain_text`
- Description → `properties.Description.rich_text[0].plain_text`
- Link (fallback chain):
  1. `properties.Link.url`
  2. `properties.URL.url`
  3. `properties["Live URL"].url`
  4. `properties["Demo URL"].url`
  5. Fallback: `https://www.notion.so/{pageId}`
- GitHub → `properties.GitHub.url`
- Featured → `properties.Featured.checkbox`
- Tech → `properties.Tech.multi_select[].name`
- Tags → `properties.Tags.multi_select[].name`
- Images → `page.cover.external.url` or `page.cover.file.url`
- Icons → `page.icon.emoji` or `page.icon.file.url`

### Important: URL Property Chain

The current implementation looks for project links in this order:
1. **Link** property (not in current schema)
2. **URL** property (not in current schema)
3. **Live URL** property (not in current schema)
4. **Demo URL** property (not in current schema)
5. **url** property ✅ (exists in schema)
6. Falls back to Notion page URL

**Currently, only the `url` property exists**, so ensure all projects have this filled in for proper linking.

---

## Page Properties

Additional properties available from Notion pages:

| Property | Type | Notes |
|----------|------|-------|
| `page.id` | String | UUID format |
| `page.cover` | Object | Can be external URL or file URL |
| `page.icon` | Object | Type can be "emoji", "file", or "external" |
| `page.created_time` | ISO 8601 | Project creation date |
| `page.last_edited_time` | ISO 8601 | Last modification date |

---

## Enum/Option IDs for Multi-Select

### Tech Multi-Select Options (Sample)
- Python: `bf3892cb-a9e2-4c83-86dd-12af5fb78d12`
- JavaScript: `a3576b6a-36fd-4dd3-8b05-5ea747a4260c`
- React: `90a347f3-1134-49c1-b084-9a3ce30947dd`
- TypeScript: `508b864c-164a-423b-9f68-41cb0ca9c9b8`
- C++17: `81f961b0-b7ab-4e69-b009-c29246cd9a36`
- AI/ML: `e07088ea-2c9c-4dc9-8e2c-e72eed61cb5d`
- LLMs: `d8c1ca98-a53c-4990-8e7d-a9bbd4b564db`

### Tags Multi-Select Options
- AI: `d4c018b1-4cb8-411e-8235-ceb8bd99eb69`
- SWE: `b23a3e96-3d50-4efb-a391-23e2aa5fa16e`
- Quant: `9c6ae7ab-0f67-47b9-b3f6-1014c6993b6a`
- CS: `e205c6bb-877a-4395-b05e-dc870cfcc3e8`

---

## Troubleshooting

### 404 on Project Click
- **Cause:** `url` property is empty
- **Solution:** Fill in the `url` property for each project, or use Link/URL/Live URL/Demo URL properties
- **Fallback:** Clicking will open the Notion page if no URL is set

### Missing Tech/Tag Values
- **Cause:** Multi-select option doesn't exist
- **Solution:** Check the available options in the database or add new options via Notion UI
- **API:** Create via PATCH request to update database schema

---

**Generated:** January 17, 2026  
**Notion API Version:** 2022-06-28
