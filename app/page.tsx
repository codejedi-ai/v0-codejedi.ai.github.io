import WorkExperience from './components/WorkExperience';
import Certificates from './components/Certificates';


// import { JSX } from 'react';



export default async function Home() {

  return (
    <div className="p-8">
      <Certificates />
      <WorkExperience />
    </div>
  );
}
