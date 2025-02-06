'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export function NavBar() {
  const [isFixed, setIsFixed] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const initialPosRef = useRef<number | null>(null);

  useEffect(() => {
    // Store initial position on mount
    if (navRef.current && initialPosRef.current === null) {
      initialPosRef.current = navRef.current.getBoundingClientRect().top + window.scrollY;
    }

    const handleScroll = () => {
      if (!navRef.current || initialPosRef.current === null) return;

      const currentScrollY = window.scrollY;
      const shouldFix = currentScrollY > initialPosRef.current;

      setIsFixed(shouldFix);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      ref={navRef}
      className={`bg-gray-500/80 w-screen z-50 transition-transform duration-300 left-0
        ${isFixed ? 'fixed top-0 translate-y-0 ' : 'absolute -translate-y-full'}`}
      style={{
        top: isFixed ? '0' : initialPosRef.current ? `${initialPosRef.current}px` : 'auto'
      }}
    >
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