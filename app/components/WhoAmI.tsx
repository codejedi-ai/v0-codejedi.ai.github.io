'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  '/img/about1.jpg',
  '/img/about2.jpeg', 
  '/img/about3.jpeg',
  '/img/about4.jpeg'
];

export default function AboutMe() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  const quote = "\"Let each person examine his own work, and then he can take pride in himself alone, and not compare himself with someone else.\" -- Galatians 6:4"
  return (
    <section id="about" className="py-20 text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-16 p-8  from-gray-900 to-gray-800 rounded-lg shadow-2xl">
  <div className="max-w-2xl">
    <h2 className="text-5xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
      Who Am I
    </h2>
    <p className="text-gray-300 italic text-lg">
    {quote}
    </p>
  </div>
  <div className="w-32 h-32 relative">
    <Image 
      src="/img/CodeJedi.png"
      alt="CodeJedi"
      fill
      className="rounded-full object-cover border-4 border-blue-400 shadow-lg"
    />
  </div>
</div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Slideshow */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 relative">
              <Image 
                src={slides[currentSlide]}
                alt="About me slide"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            
            <button 
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextSlide} 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
            >
              <ChevronRight />
            </button>

            <div className="flex justify-center space-x-2 mt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Majoring in Honours Bachelor of Computer Science with AI Specialization
              (2020-2025), University of Waterloo, Canada
            </h3>
            
            <p className="text-white mb-6">
              Embarking on the sacred path to AI mastery, my passion and curiosity guide me
              through uncharted territories—exploring the vast realms of cloud computing,
              neuroscience, computer vision, and the evolving art of AI, akin to a wise seeker
              in the realm of knowledge.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                <span>Programming languages: C, C++, C#, Java, R and Python</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                <span>Developer Tools: Pycharm, Eclipse, Jupyter Notebook, XCode, Visual studio, VSCode, Code Blocks, Robot Framework</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                <span>Libraries: OpenCV, Tensorflow, PyTorch, Scikit-learn, Seaborn, Selenium, Pandas, Numpy, MatplotLib, PyTorch, OpenAIGym, Nengo</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                <span>DevOps: CI/CD, GitHub, CodeCommit, CodePipeline, Jenkins, Ansible, Docker, Kubernetes</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                <span>Database: PostgreSQL, MySQL, Aurora, MongoDB, DynamoDB</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                <span>Cloud: AWS, GCP</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}