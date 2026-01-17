# Notion Portfolio Databases - Complete Schema Documentation

**Generated:** January 17, 2026  
**Portfolio Workspace:** [darcy-liu/portfolio-databases](https://www.notion.so/darcy-liu/portfolio-databases-42ba51e735c6425282891f116d7c2e3f)

---

## Table of Contents

1. [Primary Portfolio Databases](#primary-portfolio-databases)
2. [Support Databases](#support-databases)
3. [Academic & Coursework Databases](#academic--coursework-databases)
4. [Personal Projects & Content](#personal-projects--content)
5. [Miscellaneous Databases](#miscellaneous-databases)

---

## Primary Portfolio Databases

### 1. **Projects** ⚙️
**ID:** `8845d571-4240-4f4d-9e67-e54f552c4e2e`  
**Description:** The database for all technical side projects  
**Last Modified:** January 17, 2026

#### Properties:

| Property | Type | Options/Details |
|----------|------|-----------------|
| **Title** | Title | Primary identifier for the project |
| **Description** | Rich Text | Detailed description of the project |
| **url** | URL | Direct link to project (used for project card clicks) |
| **GitHub** | URL | GitHub repository link |
| **Featured** | Checkbox | Mark project as featured on portfolio |
| **Tags** | Multi-Select | Options: AI, SWE, Quant, CS |
| **Tech** | Multi-Select | 40+ options including: Python, JavaScript, React, TypeScript, C++, AI/ML, LLMs, Computer Vision, Cryptography, and many more |

#### Key Usage:
- Used in portfolio to display project cards
- The `url` property is what gets linked when clicking a project card
- If no `url` is set, falls back to Notion page URL
- Supports cover images and page icons (emoji or file-based)

---

### 2. **Non-technical side projects** 👪
**ID:** `977b4bc7-08df-45ca-8895-1f0a75c5d343`  
**Description:** Track non-technical side projects and experiences  
**Last Modified:** January 4, 2026

#### Properties:

| Property | Type | Details |
|----------|------|---------|
| **Name** | Title | Project/experience name |
| **position** | Rich Text | Position or role held |
| **location** | Rich Text | Geographic location |
| **Start Date** | Date | Project start date |
| **End Date** | Date | Project end date |
| **Projects** | Relation | Links to technical projects database (single_property) |

---

### 3. **Skills Connection Database** 🤖
**ID:** `c99565e6-695a-4870-9536-b72d0417f028`  
**Description:** A bidirectional graph of technologically similar terms and skills  
**Last Modified:** January 13, 2026

#### Properties:

| Property | Type | Details |
|----------|------|---------|
| **Type** | Title | Name of the skill/concept pair |
| **skill_1** | Rich Text | First skill in the similarity relationship |
| **skill_2** | Rich Text | Second skill in the similarity relationship |
| **similarity** | Number | Percentage match/similarity score (0-100%) |
| **lock-in** | Checkbox | Lock relationship from editing |

#### Usage:
Maps equivalent skills across domains (e.g., PyTorch ↔ TensorFlow, AWS ↔ GCP, etc.)  
Supports comprehensive technical skill taxonomy including:
- Cloud Platforms, Databases, Languages, Frameworks
- DevOps tools, Testing frameworks, Storage solutions
- Authentication methods, APIs, ML frameworks

---

## Support Databases

### 4. **AuraFlow** 🎨
**ID:** `f4c13b3e-2932-454a-8a31-abdd36d61ebd`  
**Description:** Calendar/Event management system  
**Last Modified:** January 13, 2026

#### Properties:
- **Name** (Title)
- **Date** (Date range)
- **Status** (Status: Not started, In progress, Done)
- **Event Status** (Select: Confirmed, Tentative, Cancelled)
- **Type** (Select: Standup, Weekly Sync, Design Systems, Ad Hoc)
- **Location** (Rich text)
- **Attendees** (Rich text)
- **Conference Call Link** (URL)
- **Calendar Name** (Select)
- **Source** (Select: Google Calendar, Todoist, Email)

---

### 5. **Blogs** ✏️
**ID:** `311b3a08-1161-4102-b265-b91425edf4df`  
**Description:** Blog post and written content tracker  
**Last Modified:** January 13, 2026

#### Properties:
- **Title** (Title)
- **Model** (Rich text)
- **Width, Height** (Number - dimensions)
- **seed** (Number)

---

### 6. **Iris Minecraft Tokens** ✏️
**ID:** `b30d62dc-c834-401f-bac1-aa47744f6eac`  
**Description:** Minecraft token tracking  
**Last Modified:** January 13, 2026

#### Properties:
- **Name** (Title)
- **Minutes** (Number)
- **Done** (Checkbox)

---

### 7. **Populate-With-Github** 🧬
**ID:** `4b2191de-9774-4122-9c06-bbcc3552cfdc`  
**Description:** GitHub synchronization database  
**Last Modified:** January 13, 2026

#### Properties:
- **Title** (Title)
- **Type 2** (Select: Lecture, Club, Quiz, Essay, Test)
- **N2, N3, N4** (Checkboxes)
- **seed** (Number)

---

## Academic & Coursework Databases

### 8. **Data Governance Grades** 
**ID:** `9ca697e3-db34-4a11-8b1c-a611d2e14509`  
**Description:** Grade tracking for Data Governance course

#### Properties:
- **Assignment** (Title)
- **Raw Score** (Number)
- **Due** (Date)
- **Submitted** (Date)
- **Final Grade** (Formula) - Calculates with late penalties
- **Weighted Grade** (Formula)
- **Days Late** (Formula)
- **Late Penalty** (Number %)
- **Excused** (Checkbox)
- **Weighting** (Number %)

---

### 9. **K3 Clock Server Implementation**
**ID:** `2440226f-c222-4fd4-b23f-7fb8a472cfa9`  
**Description:** CS452 Assignment tracking  
**Last Modified:** October 19, 2023

#### Properties:
- **Name** (Title)
- **Language** (Select - 100+ programming languages)
- **Event Date** (Date)
- **Event Leaders** (Status: Not started, In progress, Done)

---

### 10. **Assignment K3 Task board and Send Map**
**ID:** `0507f623-c8a8-4b3a-9bf3-dd84f5740028`  
**Description:** K3 assignment task management  
**Last Modified:** October 18, 2023

#### Properties:
- **Name** (Title)
- **Status** (Status options)
- **Type** (Select: Book, Article, TV Series, Film, Podcast, Academic Journal, Essay Resource)
- **Score** (Select: 1-5 stars or TBD)
- **Link** (URL)
- **Completed** (Date)
- **Author** (Rich text)
- **Create / Send** (Bidirectional relations)

---

## Personal Projects & Content

### 11. **"It Is Pure to Rise Up" Blog** 📖
**ID:** `6d770d78-10c8-4537-afc9-a71a6df214e3`  
**Description:** Personal blog exploring resilience, identity, and self-discovery  
**Last Modified:** January 13, 2026

#### Properties:
- **Name** (Title)
- **Published Date** (Date)
- **Author** (People)
- **Article #** (Number)
- **Series** (Select: Showerthoughts, Exploring the Dichotomy, Path to Success, A Quest for Identity, Country Exploration)
- **Tags** (Multi-select: Identity, Countries, Lifestyle, Tech, Career, Finance, Love, Shower-thoughts, Philosophy)
- **Last edited time** (Last edited timestamp)

---

### 12. **Shower thoughts & Reflections** 🤭
**ID:** `8f6cd3a4-e8e1-4a62-93ca-3e7d29ab4e22`  
**Description:** Personal reflections and philosophical musings

#### Properties:
- **Name** (Title)
- **Tags 1** (Status: Not started, In progress, Done)
- **Series** (Select: Showerthoughts, Exploring the Dichotomy, Path to Success, A Quest for Identity)
- **Type** (Select: Quiz, Test, Exam, Assignment, Club)
- **Unit** (Number)
- **Urgency** (Select: High, Low)
- **Tags** (Multi-select: 9+ topic tags)
- **uuid, user-uuid** (Rich text)

---

### 13. **Magic.quill** 📊
**ID:** `87ae5d35-95af-47b7-b111-941e0711bfb0`  
**Description:** Statistical analysis project  
**Last Modified:** January 13, 2026

#### Properties:
- **Name** (Title)
- **Estimate** (Number)
- **t value** (Number)
- **Std. Error** (Number)
- **Pr(> |t|)** (Rich text)

---

## Miscellaneous Databases

### 14. **Goals** 🥅
**ID:** `809f5c6b-4a29-4d9b-bcfb-3dba61988de1`  
**Description:** Personal goal tracking  
**Last Modified:** January 30, 2025

#### Properties:
- **Name** (Title)
- **Reviewed** (Checkbox)

---

### 15. **Marklin Commands** 🎯
**ID:** `83157f37-c38f-4bf2-bac7-1b758baefcb7`  
**Description:** Command reference (possibly for model train control)  
**Last Modified:** June 4, 2024

#### Properties:
- **Title** (Title)
- **Byte1, Byte2** (Rich text)

---

### 16. **OKRs (Objectives + Key Results)**
**ID:** `193a9ae1-b608-81a2-b140-f1898c445038`  
**Description:** OKR tracking organized by quarter

#### Properties:
- **Objective + Key Results** (Title)
- **Quarter** (Select: Q1, Q2, Q3, Q4)
- **Status** (Select: Upcoming, In Progress, Complete, Archived)
- **Added By** (People)

---

### 17. **Reading List** 📚
**ID:** `32abdf77-5c85-460e-b772-792925f14e8e`  
**Description:** Track books, articles, podcasts, and videos

#### Properties:
- **Name** (Title)
- **Type** (Select: Documentary, Book, Article, TV Series, Film, Podcast, Academic Journal, Essay Resource)
- **Status** (Status: Not started, In progress, Done)
- **Score** (Select: 1-5 stars or TBD)
- **Link** (URL)
- **Author** (Rich text)
- **Completed** (Date)

---

### 18. **CS452 Lecture Notes**
**ID:** `8a45c2b7-16b3-4f03-91ee-eedf98e9a409`  
**Description:** Course lecture reference material

#### Properties:
- **Title** (Title)
- **Link** (URL)

---

### 19. **Companies List** 💼
**ID:** `313a012b-9ef7-45a8-955f-d9f218a96638`  
**Description:** Interesting companies to follow

#### Properties:
- **Name** (Title)
- **URL** (URL)
- **Founder** (Rich text)
- **Industry** (Rich text)

---

## Key Relationships & Connections

### Database Links:
- **Projects** → **Non-technical side projects** (One-to-many relation)
- **Skills Connection Database** → Bidirectional skill similarity mapping
- **OKRs** → Status tracking across quarters

### Cross-Portfolio Usage:
- The **Projects** database is the primary source for portfolio display
- The `url` property in Projects is what gets opened on card click
- Falls back to Notion page URL if no custom URL is provided
- **Skills Connection Database** could be used for skill matching and resume optimization

---

## Database Statistics

| Category | Count |
|----------|-------|
| **Portfolio-focused** | 3 |
| **Academic/Course** | 6 |
| **Personal Projects** | 5 |
| **Other/Support** | 10 |
| **Total Databases** | 24+ |

---

## Notes for API Integration

### For Project Retrieval:
- Query **Projects** database with filters on Featured or Tags
- Extract: Title, Description, url, GitHub, Featured status, Tech stack
- Images: Check page cover and icon properties
- Fallback: If url is empty, construct Notion page URL

### For Skill Matching:
- Use **Skills Connection Database** to normalize skill names
- Apply similarity percentages for matching variations
- Example: "PyTorch" matches "TensorFlow" at ~95% similarity

### Available Properties by Type:
- **Rich Text:** Flexible text fields for descriptions
- **Multi-Select:** Good for tags and categorization
- **Relations:** Link between databases
- **Formulas:** Automated calculations (e.g., grade calculations)
- **Dates:** For project timelines and deadlines

---

**Last Updated:** January 17, 2026  
**Total Properties Documented:** 150+  
**API-Ready:** Yes - All databases accessible via Notion API
