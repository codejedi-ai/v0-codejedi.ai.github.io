# Notion Integration Guide

This guide explains how to set up and configure the Notion integration for your portfolio website. The integration allows you to manage your blog posts, work experience, projects, and images directly from Notion databases.

## 🚀 Quick Start

### 1. Create Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Fill in the details:
   - **Name**: Portfolio Integration
   - **Logo**: Upload your logo (optional)
   - **Associated workspace**: Select your workspace
4. Click "Submit"
5. Copy the **Internal Integration Secret** (starts with `ntn_`)

### 2. Set Up Environment Variables

Add these to your `.env.local` file:

\`\`\`bash
# Notion API Configuration
NOTION_INTEGRATION_SECRET=ntn_your_integration_secret_here
WORK_EXPERIENCE_DATABASE_ID=your-work-experience-database-id
BLOGS_DATABASE_ID=your-blogs-database-id
SIDE_PROJECTS_DATABASE_ID=your-projects-database-id
IMAGES_DATABASE_ID=your-images-database-id
\`\`\`

### 3. Create Notion Databases

Create four databases in your Notion workspace with the following structures:

## 📊 Database Schemas

### Work Experience Database

**Required Properties:**
- **title** (Title) - Title of the position
- **tenure** (Number) - Tenure Length (Days)
- **link** (URL) - Link to the company website
- **Due date** (Date) - Date begin to date end (with start and end dates)
- **location** (Rich Text) - Location of the work
- **company** (Rich Text) - Which company

**Optional Properties:**
- **Description** (Rich Text) - Job description
- **Skills** (Multi-select) - Technologies used
- **Achievements** (Rich Text) - Key accomplishments

### Blog Posts Database

**Required Properties:**
- **Title** (Title) - Blog post title
- **Category** (Select) - Post category (AI & Machine Learning, Certifications, etc.)
- **Tags** (Multi-select) - Post tags
- **Featured** (Checkbox) - Whether to feature the post
- **Read Time** (Rich Text) - Estimated reading time

**Optional Properties:**
- **Image** (Files & Media) - Featured image
- **Published** (Date) - Publication date
- **Status** (Select) - Draft, Published, Archived
- **Author** (Rich Text) - Author name

### Side Projects Database

**Required Properties:**
- **Title** (Title) - Project name
- **Description** (Rich Text) - Short description
- **Tags** (Multi-select) - Technologies used
- **GitHub** (URL) - GitHub repository link
- **Link** (URL) - Live demo link
- **Featured** (Checkbox) - Whether to feature the project

**Optional Properties:**
- **Image** (Files & Media) - Project screenshot
- **Status** (Select) - In Progress, Completed, Archived
- **Start Date** (Date) - Project start date

### Images Database

**Required Properties:**
- **Name** (Title) - Image name/title
- **Type** (Select) - Image category/type (e.g., "Screenshot", "Logo", "Banner", "Icon")

**Optional Properties:**
- **Description** (Rich Text) - Image description
- **Tags** (Multi-select) - Image tags for organization
- **Usage** (Rich Text) - Where/how the image is used
- **Alt Text** (Rich Text) - Alternative text for accessibility

## 🔧 Database Setup Instructions

### Step 1: Create Databases

1. In Notion, create a new page
2. Type `/database` and select "Table - Full page"
3. Name your database (e.g., "Work Experience", "Images")
4. Add the required properties listed above

### Step 2: Share Databases with Integration

For each database:

1. Click the **Share** button in the top-right corner
2. Click **Invite** 
3. Search for your integration name
4. Select your integration and click **Invite**
5. Ensure the integration has **Edit** permissions

### Step 3: Get Database IDs

1. Open each database in Notion
2. Copy the URL - it looks like:
   `https://notion.so/your-workspace/DATABASE_ID?v=VIEW_ID`
3. Extract the DATABASE_ID (32-character string)
4. Format it with hyphens: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## 🔍 Property Mapping

The integration automatically detects and maps properties with flexible naming:

### Work Experience
- **title**: `title`, `Title`, `Job Title`, `Position`
- **company**: `company`, `Company`, `Company Name`
- **location**: `location`, `Location`, `Work Location`
- **Due date**: `Due date`, `date`, `Date`, `Employment Period`, `Tenure`
- **link**: `link`, `Link`, `Company URL`, `Website`
- **tenure**: `tenure`, `Tenure`, `Duration`, `Length`

### Blog Posts
- **Title**: `title`, `Title`, `Name`, `Post Title`
- **Category**: `Category`, `Type`, `Section`
- **Tags**: `Tags`, `Categories`, `Topics`
- **Featured**: `Featured`, `Highlight`, `Important`

### Projects
- **Title**: `title`, `Title`, `Name`, `Project Name`
- **Description**: `Description`, `Summary`, `About`
- **Tags**: `Tags`, `Technologies`, `Skills`
- **GitHub**: `GitHub`, `GitHub URL`, `Source Code`, `Repository`

### Images
- **Name**: `Name`, `title`, `Title`, `Image Name`
- **Type**: `Type`, `Category`, `Kind`

## 🎯 Content Guidelines

### Work Experience
- Use clear, professional job titles
- Include full company names
- Add specific locations (City, State/Province, Country)
- Set accurate employment dates
- Include company website URLs

### Blog Posts
- Write compelling titles
- Use consistent categories
- Add relevant tags for discoverability
- Mark important posts as featured
- Include estimated read times

### Projects
- Use descriptive project names
- Write clear, concise descriptions
- Tag with relevant technologies
- Include working demo links
- Add GitHub repository links

### Images
- Use descriptive names for easy identification
- Categorize with appropriate types (Screenshot, Logo, Banner, etc.)
- Add cover images or upload files to the page
- Use consistent naming conventions
- Include alt text for accessibility

## 🚨 Troubleshooting

### Common Issues

**"Could not find database" Error**
- Verify database ID format (with hyphens)
- Ensure integration has access to the database
- Check that database is shared with integration

**"Could not find sort property" Error**
- The integration will automatically handle this
- Check console logs to see available properties
- Ensure at least one date/time property exists

**Missing Data**
- Verify property names match expected formats
- Check that required properties are filled
- Ensure integration has read permissions

### Debug Mode

Enable detailed logging by checking the browser console or server logs:

\`\`\`javascript
// Look for these log messages:
"Available properties: [...]"
"Using sort property: ..."
"Successfully processed X items"
\`\`\`

## 🔄 Fallback System

The integration includes a robust fallback system:

- **Notion Unavailable**: Uses hardcoded data
- **Missing Properties**: Uses default values
- **API Errors**: Gracefully degrades to static content
- **Network Issues**: Continues with cached/fallback data

## 📝 API Endpoints

The integration provides these API endpoints:

- `/api/work-experience` - Fetch work experience
- `/api/blog` - Fetch blog posts
- `/api/projects` - Fetch projects
- `/api/images` - Fetch images
- `/api/notion/databases` - List database mappings
- `/api/notion/[database]` - Query specific database

## 🔐 Security Notes

- Never commit your integration secret to version control
- Use environment variables for all sensitive data
- Regularly rotate your integration secrets
- Monitor API usage in Notion settings

## 📚 Additional Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Notion Integration Guide](https://developers.notion.com/docs/getting-started)
- [Database Properties Reference](https://developers.notion.com/reference/property-object)

## 🆘 Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify your database structure matches the schemas above
3. Ensure your integration has proper permissions
4. Test with the fallback data first

The integration is designed to be resilient and will continue working even if Notion is temporarily unavailable.
\`\`\`

Finally, let's update the environment variables file:
