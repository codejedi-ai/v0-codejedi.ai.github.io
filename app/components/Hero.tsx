"use client"

import { Heart } from "lucide-react"
import Link from "next/link"
//w-full h-full from the background gradient effects
export function Hero() {
  return (
    <section id="hero" className="pt-24 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,210,255,0.3)_0%,rgba(10,10,24,0)_60%)]"></div>
        <div className="absolute top-0 left-0  bg-[radial-gradient(circle_at_70%_80%,rgba(157,78,221,0.3)_0%,rgba(10,10,24,0)_60%)]"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="text-center">

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 glow-text">
            Hello, my name is
            <br />
            <span className="flex items-center justify-center gap-2 mt-2">
              Darcy <Heart className="text-primary-pink animate-pulse" size={32} /> Liu
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
