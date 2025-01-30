import React from 'react';
import { Clock } from 'lucide-react';
import { YearGroup, Position } from './types';
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




function TimelineItem({ position }: { position: Position }) {
  return (
    <div className={`flex w-full ${position.isLeft ? 'justify-start' : 'justify-end'}`}>
      <div className={`w-5/12 ${position.isLeft ? 'pr-8' : 'pl-8'}`}>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800">{position.title}</h3>
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

function WorkExperience({ experiences }: WorkExperienceProps) {
  const quote_work_experience = "Knowledge = Experience x Sensitivity -- Yuval Noah Harari";
  
  
  
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

        {experiences.map((yearGroup, index) => (
          <div key={yearGroup.year} className="mb-16">
            <input type="hidden" name="index" value={index} />
            {/* Year marker */}
            <div className="flex justify-center mb-8">
              <div className="bg-blue-500 text-white rounded-full p-3 z-10">
                <Clock className="h-6 w-6" />
              </div>
              <div className="absolute bg-white px-4 py-1 rounded-full shadow-sm transform translate-y-12">
                <span className="text-gray-800 font-semibold">{yearGroup.year}</span>
              </div>
            </div>

            {/* Experience items */}
            <div className="space-y-12">
            {yearGroup.positions.map((position, posIndex) => (
              <TimelineItem key={posIndex} position={position} />
            ))}
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkExperience;
