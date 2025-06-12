"use client"

import { Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section id="hero" className="pt-24 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,210,255,0.3)_0%,rgba(10,10,24,0)_60%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(157,78,221,0.3)_0%,rgba(10,10,24,0)_60%)]"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="text-center">
          <div className="mb-8 relative w-40 h-40 mx-auto">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-nobg-6VRcp31i5tVIDRZnNmb2gTF55EQSi1.png"
              alt="Logo"
              width={160}
              height={160}
              className="object-contain animate-float"
            />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 glow-text">
            Hello, I am a CodeJedi
            <br />
            <span className="flex items-center justify-center gap-2 mt-2">
              I <Heart className="text-primary-pink animate-pulse" size={32} /> Programming
            </span>
          </h2>

          <div className="divider w-24 mx-auto my-8" />

          <Link
            href="#contact"
            className="inline-block px-8 py-3 text-lg font-semibold text-white 
                      border-2 border-primary-cyan rounded-full hover:bg-primary-cyan/20 hover:shadow-glow
                      transition-all duration-300"
            aria-label="Go to contact section"
          >
            Connect
          </Link>
        </div>
      </div>
    </section>
  )
}
