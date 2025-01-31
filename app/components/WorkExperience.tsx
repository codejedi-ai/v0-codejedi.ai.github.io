import React from 'react';
import { Clock } from 'lucide-react';
import { YearGroup, Position } from './types';
import * as NotionAPI from '@notionhq/client/build/src/api-endpoints';
import {WORK_EXPERIANCE_DATABASE_ID, DateResponse, notion} from '../notion-uuid';
import * as fs from 'fs/promises';
//  {
//    year: '2023',
//    positions: [
//      {
//        title: 'Site Reliability Engineer Intern (Remote)',
//        company: 'OANDA (Canada) Corporation',
//        location: 'Toronto, ON, Canada',
//        date: 'Jan.9 ~ Apr.21, 2023 (4 Months)',
//        link: 'https://oanda.com/ca-en/',
//        isLeft: true
//      }
//    ]
//  }



async function fetchWorkExperiance(): Promise<NotionAPI.PageObjectResponse [] | null> {
  try {
    const response = await notion.databases.query({
      database_id: WORK_EXPERIANCE_DATABASE_ID,
      sorts: [
        {
          property: 'date',
          direction: 'descending'
        }
      ]
    });
    // Pretty print JSON with 2 space indentation
    const jsonOutput = JSON.stringify(response, null, 2);

    // Log to console
    // console.log('Fetched Notion database:', jsonOutput);
        // Save to file
    await fs.writeFile('notion-response.json', jsonOutput, 'utf-8');

    const ret = response.results as NotionAPI.PageObjectResponse[];
    return ret;
  } catch (error) {
    console.error('Error fetching Notion database:', error);
    return [];
  }
}



// function renderRichText(richTextList: NotionAPI.RichTextItemResponse[]) {
//   if (!richTextList || richTextList.length === 0) {
//     return <span className="text-gray-400">No content</span>;
//   }
// 
//   return (
//     <>
//       {richTextList.map((textItem, index) => {
//         const { annotations, type } = textItem;
//         let className = '';
//         
//         if (type !== 'text') {
//           throw new Error(`Unsupported text type: ${type}`);
//         }
//         
//         const text = textItem.text;
//         if (annotations.bold) className += ' font-bold';
//         if (annotations.italic) className += ' italic';
//         if (annotations.strikethrough) className += ' line-through';
//         if (annotations.underline) className += ' underline';
//         if (annotations.code) className += ' font-mono bg-gray-100 rounded px-1';
//         
//         return (
//           <span key={index} className={className.trim()}>
//             {text.link ? (
//               <a href={text.link.url} className="text-blue-600 hover:underline">
//                 {text.content}
//               </a>
//             ) : (
//               text.content
//             )}
//           </span>
//         );
//       })}
//     </>
//   );
// }

// // render the date
function renderDate(date_response: DateResponse | null) : string{
  
  if (!date_response) {
    return "No date";
  }

  const start_date = date_response.start ? new Date(date_response.start) : null;
  const end_date = date_response.end ? new Date(date_response.end) : null;

  if (!start_date) {
    return "No start date";
  }

  const start_month = start_date.toLocaleString('default', { month: 'short' });
  const start_year = start_date.getFullYear();
  
  if (!end_date) {
    return start_month + ". " + start_year + " ~ Present";
  }

  const end_month = end_date.toLocaleString('default', { month: 'short' });
  const end_year = end_date.getFullYear();

  if (start_year === end_year) {
    // console.log(start_month);
     return start_month+ " ~ " + end_month + ", " + end_year;
  }
  return start_month + ". " + start_year + " ~ " + end_month + ". " + end_year;
}
// get string from Array<RichTextItemResponse> I want the plaintext appended

function getPlainText(richTextList: NotionAPI.RichTextItemResponse[]): string {
  return richTextList.map((richText) => richText.plain_text).join('');
}
function pageToPosition(page: NotionAPI.PageObjectResponse): Position {
  let emoji = '📄';
  if (page.icon && page.icon.type === 'emoji') {
    emoji = page.icon.emoji;
  }
  const titleProperty = page.properties.title;
  // Title Exist
  if (!titleProperty) {
    throw new Error('No title property found');
  }
  // is of correct type
  if (titleProperty.type !== 'title') {
    throw new Error('Title property is not a title');
  }
  // Company Exist
  const companyProperty = page.properties.company;
  if (!companyProperty) {
    throw new Error('No company property found');
  }
  // is of correct type
  if (companyProperty.type !== 'rich_text') {
    throw new Error('Company property is not rich text');
  }
  const locationProperty = page.properties.location;
  // Location Exist
  if (!locationProperty) {
    throw new Error('No location property found');
  }
  // is of correct type
  if (locationProperty.type !== 'rich_text') {
    throw new Error('Location property is not rich text');
  }
  const dateProperty = page.properties.date;
  // Date Exist
  if(!dateProperty) {
    throw new Error('No date property found');
  }
  if(dateProperty.type !== 'date') {
    throw new Error('Date property is not a date');
  }
  if(!dateProperty.date) {
    throw new Error('No date found in date property');
  }
  const linkProperty = page.properties.link;
  // Link Exist
  if(!linkProperty) {
    throw new Error('No link property found');
  }
  if(linkProperty.type !== 'url') {
    throw new Error('Link property is not a url');
  }
  // URL is a string
  if(typeof linkProperty.url !== 'string') {
    throw new Error('Link property is not a string');
  }
  const titleString = getPlainText(titleProperty.title);
  const companyString = getPlainText(companyProperty.rich_text);
  const locationString = getPlainText(locationProperty.rich_text);
  const dateString = renderDate(dateProperty.date);
  const linkString = linkProperty.url;
  // log the dateString json fully
  //console.log(JSON.stringify(dateString));
  const getYear = new Date(dateProperty.date.start).getFullYear();
  return {
    emoji: emoji,
    title: titleString,
    company: companyString,
    location: locationString,
    date: dateString,
    link: linkString,
    isLeft: getYear % 2 === 1
  };
}



function groupByYear(pages: NotionAPI.PageObjectResponse[]): Record<string, Position[]> {
  const yearGroups: Record<string, Position[]> = {};
  
  pages.forEach(page => {
    const dateProperty = page.properties.date;
    if (!dateProperty || dateProperty.type !== 'date' || !dateProperty.date?.start) {
      throw new Error('Invalid date property');
    }

    const year = new Date(dateProperty.date.start).getFullYear().toString();
    if (!yearGroups[year]) {
      yearGroups[year] = [];
    }

    const position: Position = pageToPosition(page);

    yearGroups[year].push(position);
  });

  return yearGroups;
}

function createYearGroups(pages: NotionAPI.PageObjectResponse[]): YearGroup[] {
  const yearGroups = groupByYear(pages);
  
  return Object.entries(yearGroups)
    .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
    .map(([year, positions]) => ({
      year,
      positions: positions.sort((a, b) => {
        const dateA = new Date(a.date.split('~')[0]);
        const dateB = new Date(b.date.split('~')[0]);
        return dateB.getTime() - dateA.getTime();
      })
    }));
}
function TimelineItem({ position }: { position: Position }) {
  return (
    <div className={`flex w-full ${position.isLeft ? 'justify-start' : 'justify-end'}`}>
      <div className={`w-5/12 ${position.isLeft ? 'pr-8' : 'pl-8'}`}>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span>{position.emoji}</span>
            <span>{position.title}</span>
          </h3>
          <a href={position.link} target="_blank" rel="noopener noreferrer" 
             className="text-blue-600 hover:text-blue-800 font-medium">
            {position.company}
          </a>
          <p className="text-gray-600">{position.location}</p>
          <p className="text-sm text-gray-500 mt-2">{position.date}</p>
        </div>
      </div>
    </div>
  );
}
export interface WorkExperienceProps {
  experiences: YearGroup[];
}

async function WorkExperience() {
  const quote_work_experience = "Knowledge = Experience x Sensitivity -- Yuval Noah Harari";
  
  const jobs = await fetchWorkExperiance();
  if (!jobs) {
    return <div>Failed to fetch data</div>;
  }
  const experiences = createYearGroups(jobs);
  
  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Work Experience</h2>
        <p className="italic">
          {quote_work_experience}
        </p>
      </div>

      <div className="relative">
        {/* Center line */}
        
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
        <div className="flex justify-center">
              <div className="bg-blue-500 text-white rounded-full p-3 z-10">
                <Clock className="h-6 w-6" />
              </div>
            </div>
        {experiences.map((yearGroup, index) => (
          <div key={yearGroup.year} className="mb-0">
            <input type="hidden" name="index" value={index} />

            {/* Year marker */}
            <div className="flex justify-center mb-8">
            <div className=" absolute bg-white px-4 py-1 rounded-full shadow-sm transform ">
                <span className="text-gray-800 font-semibold">{yearGroup.year}</span>
                </div>
            </div>

            {/* Experience items */}
            <div className="space-y-10">
            {yearGroup.positions.map((position, posIndex) => (
              <TimelineItem key={posIndex} position={position} />
            ))}
          </div>
          <div className="flex items-center w-full my-4">
  <div className="w-full border-t-2 border-dashed border-gray-300"></div>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkExperience;
