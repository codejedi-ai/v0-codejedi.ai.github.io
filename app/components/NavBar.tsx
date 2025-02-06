'use client';

import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 bg-gray-500/80 w-screen z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href="#hero" className="text-white hover:text-blue-400">Home</Link>
            <Link href="#about" className="text-white hover:text-blue-400">About</Link>
            <Link href="#skills" className="text-white hover:text-blue-400">Skills</Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="#experience" className="text-white hover:text-blue-400">Experience</Link>
            <Link href="#projects" className="text-white hover:text-blue-400">Projects</Link>
            <Link href="#contact" className="text-white hover:text-blue-400">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}