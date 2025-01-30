import { NotionJob } from './types';
import { Client } from '@notionhq/client';

const NOTION_API_KEY = 'secret_8zGtazmQsLQXewj4QHkqOcwFoATEXDzpswRe1nty8Ca';
const notion = new Client({ auth: NOTION_API_KEY });
const DATABASE_ID = 'ce4d8010744e4fc790d5f1ca4e481955';

function transformToNotionJob(item: any): NotionJob {
  /*
 {
  Year: { id: 'M_va', type: 'number', number: null },
  'Job Title': { id: 'title', type: 'title', title: [ [Object] ] }
}
  */
  console.log(item.properties['Tenure']?.date.start );
  // get the content of the page
  // mainly need to get the bulletpoints
  // need to use the notion client to access the page
  const id = item.id;
  notion.blocks.children.list({
    block_id: id,
  }).then((block) => {
    // block.results is a list
    //console.log(block)
    const results = block.results;
    for (let i = 0; i < results.length; i++) {
      
      const type = results[i].type;
      console.log(`Type ${type}-----------------`);
      console.log(results[i][type]);
      console.log(results[i][type].rich_text);
    }
  }).catch((error) => {
    console.error(error);
  });
  // get the content of the page at id
  // notion.pages.retrieve({ page_id: id }).then((page) => {
  //   console.log(id);
  //   console.log(page);
  // }).catch((error) => {
  //   console.error(error);
  // });
  return {
    jobTitle: item.properties['Job Title']?.title[0]?.text.content || 'Untitled',
    startDate: item.properties['Tenure']?.date.start || null,
    endDate: item.properties['Tenure']?.date.end || null,
    emoji: item.icon?.emoji || null
  };
}

async function fetchNotionDatabase(): Promise<NotionJob[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
    });
    console.log('Fetched Notion database:', response['results']);
    return response.results.map(transformToNotionJob);
  } catch (error) {
    console.error('Error fetching Notion database:', error);
    return [];
  }
}
function formatDate(dateString: string | null): string {
  if (!dateString) return 'Present';
  
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear().toString();
  
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
        {jobs.map((job, index) => (
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
