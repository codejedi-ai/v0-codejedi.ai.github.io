import {DATABASE_ID, DateResponse, notion} from './notion-uuid';
import { NotionJob } from './types';
import WorkExperience from './components/WorkExperience';
import * as NotionAPI from '@notionhq/client/build/src/api-endpoints';
import * as fs from 'fs/promises';
import { JSX } from 'react';

async function fetchNotionDatabase(): Promise<NotionAPI.PageObjectResponse [] | null> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
    });
    // Pretty print JSON with 2 space indentation
    const jsonOutput = JSON.stringify(response, null, 2);

    // Log to console
    console.log('Fetched Notion database:', jsonOutput);
        // Save to file
    await fs.writeFile('notion-response.json', jsonOutput, 'utf-8');

    const ret = response.results as NotionAPI.PageObjectResponse[];
    return ret;
  } catch (error) {
    console.error('Error fetching Notion database:', error);
    return [];
  }
}



function renderRichText(richTextList: NotionAPI.RichTextItemResponse[]) {
  if (!richTextList || richTextList.length === 0) {
    return <span className="text-gray-400">No content</span>;
  }

  return (
    <>
      {richTextList.map((textItem, index) => {
        const { annotations, type } = textItem;
        let className = '';
        
        if (type !== 'text') {
          throw new Error(`Unsupported text type: ${type}`);
        }
        
        const text = textItem.text;
        if (annotations.bold) className += ' font-bold';
        if (annotations.italic) className += ' italic';
        if (annotations.strikethrough) className += ' line-through';
        if (annotations.underline) className += ' underline';
        if (annotations.code) className += ' font-mono bg-gray-100 rounded px-1';
        
        return (
          <span key={index} className={className.trim()}>
            {text.link ? (
              <a href={text.link.url} className="text-blue-600 hover:underline">
                {text.content}
              </a>
            ) : (
              text.content
            )}
          </span>
        );
      })}
    </>
  );
}

// render the date
function renderDate(date_response: DateResponse | null) {
  
  if (!date_response) {
    return <span className="text-gray-400">No date</span>;
  }

  const start_date = date_response.start ? new Date(date_response.start) : null;
  const end_date = date_response.end ? new Date(date_response.end) : null;

  if (!start_date) {
    return <span className="text-gray-400">No date</span>;
  }

  const start_month = start_date.toLocaleString('default', { month: 'short' });
  const start_year = start_date.getFullYear();
  
  if (!end_date) {
    return <span>{start_month}. {start_year} ~ Present</span>;
  }

  const end_month = end_date.toLocaleString('default', { month: 'short' });
  const end_year = end_date.getFullYear();

  if (start_year === end_year) {
    return <span>{start_month} ~ {end_month}, {end_year}</span>;
  }

  return <span>{start_month}. {start_year} ~ {end_month}. {end_year}</span>;
}

export function renderNotionPage(page: NotionAPI.PageObjectResponse) {
  let emoji = '📄';
  if (page.icon && page.icon.type === 'emoji') {
    emoji = page.icon.emoji;
  }

  let titleContent = null;
  let tenure = null;
  const richTextContents: JSX.Element[] = [];

  // Collect all properties
  if (!page.properties) {
    throw new Error('Page does not have properties');
  }

  for (const [key, value] of Object.entries(page.properties)) {
    if (value.type === 'title') {
      titleContent = renderRichText(value.title);
    } else if (value.type === 'rich_text') {
      const renderedText = renderRichText(value.rich_text);
      richTextContents.push(
        <div key={key} className="mt-2">
          <span className="text-lg font-semibold pr-2">{key}:</span>
          {renderedText}
        </div>
      );
    }else if (value.type === 'date') {

      tenure = renderDate(value.date)
    
    }
  }

  return (
    <div key={page.id} className="border rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">{emoji}</span>
        <span className="text-xl">{titleContent}</span>
        <span className="text-gray-400 text-sm">{tenure}</span>
      </div>
      <div className="ml-8">
        {richTextContents}
      </div>
    </div>
  );
}





export default async function Home() {
  const jobs = await fetchNotionDatabase();

  return (
    <div className="p-8">



    <WorkExperience />
      <h1 className="text-3xl font-bold mb-6">Jobs Database</h1>
      <div className="grid gap-4">
        {jobs && jobs.map((job) => (
          <div key={job.id}>
            {/* Render job details here */}
            <pre>{renderNotionPage(job)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
