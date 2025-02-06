'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section id="hero" className="">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Hello, I am a CodeJedi
            <br />
            <span className="flex items-center justify-center gap-2 mt-2">
              I <Heart className="text-red-500 animate-pulse" size={32} /> Programming
            </span>
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto my-8" />
          <Link href="#about" className="inline-block px-8 py-3 text-lg font-semibold text-white 
                                    border-2 border-white rounded-full hover:bg-white hover:text-gray-900">
            Who AM I
          </Link>
        </div>
      </div>
    </section>
  );
}