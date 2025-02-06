import WorkExperience from './components/WorkExperience';
import Certificates from './components/Certificates';
import AboutMe from './components/WhoAmI';
import MatrixRain from './components/MatrixRain';
import Header from './components/Header';
// import { JSX } from 'react';



export default async function Home() {

  return (
    <div className="p-8">
      <MatrixRain />
      <Header />
      <AboutMe />
      <Certificates />
      <WorkExperience />
    </div>
  );
}
