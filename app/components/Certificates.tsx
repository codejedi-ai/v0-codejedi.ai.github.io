import * as path from 'path';
import {CERTS_DATABASE_ID, DateResponse, notion} from '../notion-uuid';
import * as NotionAPI from '@notionhq/client/build/src/api-endpoints';
import Image from 'next/image';
import * as fs from 'fs/promises';
interface Certificate {
  image: string;
  alt: string;
  title: string;
  date: DateResponse;
}
async function fetchCertificates(): Promise<Certificate []> {
  try {
    const response = await notion.databases.query({
      database_id: CERTS_DATABASE_ID,
      sorts: [
        {
          property: 'date',
          direction: 'ascending'
        }
      ]
    });
    // Pretty print JSON with 2 space indentation
    // Pretty print JSON with 2 space indentation
    const jsonOutput = JSON.stringify(response, null, 2);

    const folder = path.join(process.cwd(), '.jsons');
    try {
      await fs.access(folder);
    } catch {
      await fs.mkdir(folder, { recursive: true });
    }
    
    const filePath = path.join(folder, 'fetchCertificate.json');
    await fs.writeFile(filePath, jsonOutput, 'utf-8');

    const ret = response.results as NotionAPI.PageObjectResponse[];
    
    
    // make a list of certificates
    const certificates: Certificate[] = ret.map((page) => {
      const properties = page.properties;
      // get the image URL
      // it is possible page.cover is null if such is the case "" is the URL
      // first handle the certificate title
      // it cannot be NULL
      const title = properties.title;
      if (!title) {
        throw new Error('Certificate title is missing');
      }
      if (title.type !== 'title') {
        throw new Error('Certificate title is not a title');
      }
      let titleText = "Untitled"
      if (!title.title.length) {
        titleText = "Untitled"
      }else{
        // join the title
        titleText = title.title.map((element) => element.plain_text).join('');
      }// handle the date
      const date = properties.date;
      if (!date) {
        throw new Error('Certificate date is missing');
      }
      if (date.type !== 'date') {
        throw new Error('Certificate date is not a date');
      }
      if (!date.date) {
        throw new Error('Certificate date is empty');
      }
      const dateValue = date.date
      // handle the image
      const cover = page.cover;
      if (!cover) {
        throw new Error('Certificate cover is missing');
      }
      // cover can be URL or file
      let imageUrl = '';
      if (cover.type === 'external') {
        imageUrl = cover.external.url;
      } else if (cover.type === 'file') {
        imageUrl = cover.file.url;
      } else {
        throw new Error('Certificate cover is not a URL or file');
      }
      // handle the alt text
      const altProperty = properties.alt;
      if (!altProperty) {
        throw new Error('Certificate alt text is missing');
      }
      if (altProperty.type !== 'rich_text') {
        throw new Error('Certificate alt text is not rich text');
      }
      // check if the alt text is empty
      let altText = '';
      if (altProperty.rich_text.length > 0) {
        altText = altProperty.rich_text.map((element) => element.plain_text).join('');
      }

      return {
        image: imageUrl,
        alt: altText,
        title: titleText,
        date: dateValue
      };
    });
    return certificates;
  } catch (error) {
    console.error('Error fetching Notion database:', error);
    return [];
  }
}

export default async function Certificates() {
  const quote_certificates = "The only true wisdom is in knowing you know nothing. -- Socrates";
  const certificates = await fetchCertificates();
  
  return (
    <section id="skills" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Skills</h2>
        <p className="text-center text-gray-600 italic mb-12">
          {quote_certificates}
        </p>

        <div className="flex justify-center">
        <div className="mx-auto grid grid-cols-1 gap-8 max-w-6xl
                sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]
                place-content-center
                place-items-center
                justify-items-center
                content-center
                auto-cols-min">
                
                {certificates.map((cert, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
                  {cert.image ? (
                    <div className="relative w-32 h-32">
                      <Image 
                        src={cert.image} 
                        alt={cert.alt}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-4xl text-gray-400">?</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">{cert.title}</h3>
                  <p className="text-gray-600 text-sm">{cert.date.start}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}