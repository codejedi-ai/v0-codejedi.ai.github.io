import { NotionJob } from './types';
import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import * as fs from 'fs/promises';
const NOTION_API_KEY = 'secret_8zGtazmQsLQXewj4QHkqOcwFoATEXDzpswRe1nty8Ca';
const notion = new Client({ auth: NOTION_API_KEY });
const DATABASE_ID = 'ce4d8010744e4fc790d5f1ca4e481955';

function transformToNotionJob(item: PageObjectResponse): NotionJob {
  /*
 {
  Year: { id: 'M_va', type: 'number', number: null },
  'Job Title': { id: 'title', type: 'title', title: [ [Object] ] }
}
  */
  // console.log(item.properties['Tenure']?.date.start );
  // // get the content of the page
  // // mainly need to get the bulletpoints
  // // need to use the notion client to access the page
  // const id = item.id;
  // notion.blocks.children.list({
  //   block_id: id,
  // }).then((block) => {
  //   // block.results is a list
  //   //console.log(block)
  //   const results = block.results;
  //   for (let i = 0; i < results.length; i++) {
  //     
  //     const type = results[i].type;
  //     console.log(`Type ${type}-----------------`);
  //     console.log(results[i][type]);
  //     console.log(results[i][type].rich_text);
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });
  // get the content of the page at id
  // notion.pages.retrieve({ page_id: id }).then((page) => {
  //   console.log(id);
  //   console.log(page);
  // }).catch((error) => {
  //   console.error(error);
  // });
  const tenure = item.properties['Tenure'];
  let tenureDate = null;
  if (tenure?.type === 'date') {
    tenureDate = tenure.date;
  }
  const startDate = tenureDate?.start ?? null;
  const endDate = tenureDate?.end ?? null;
  const ret : NotionJob = {
    jobTitle: 'title' in item.properties['Job Title'] ? ('text' in item.properties['Job Title'].title[0] ? item.properties['Job Title'].title[0].text.content : 'Untitled') : 'Untitled',
    startDate: startDate,
    endDate: endDate,
    emoji: (item.icon?.type === 'emoji') ? item.icon.emoji : null
  };
  return ret;
}

async function fetchNotionDatabase(): Promise<NotionJob[] | null> {
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
    const ret: NotionJob[] = [];
    //const ret = response.results.map(transformToNotionJob);
    for (let i = 0; i < response.results.length; i++) {
      const result: PageObjectResponse  = response.results[i] as PageObjectResponse;
      if ('properties' in result) {
        ret.push(transformToNotionJob(result));
      }
    }
    return ret;
  } catch (error) {
    console.error('Error fetching Notion database:', error);
    return [];
  }
}
function formatDate(dateString: string | null): string {
  if (!dateString) return 'Present';
  
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  // const year = date.getFullYear().toString();
  
  return `${month}.`;
}

function formatDateRange(startDate: string | null, endDate: string | null): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  const yearString = startDate ? new Date(startDate).getFullYear() : '';
  
  return `${start} ~ ${end}, ${yearString}`;
}
export default async function Home() {
  const jobs = await fetchNotionDatabase();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Jobs Database</h1>
      <div className="grid gap-4">
        {jobs && jobs.map((job, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">
              {job.emoji && <span className="mr-2">{job.emoji}</span>}
              {job.jobTitle}
            </h2>
            <p className="text-gray-600 mt-2">
              {formatDateRange(job.startDate, job.endDate)}
            </p>
        </div>
        ))}
      </div>
    </div>
  );
}
