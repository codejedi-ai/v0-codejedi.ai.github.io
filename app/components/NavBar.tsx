"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 w-screen z-50 transition-all duration-300 ${scrolled ? "bg-dark-lighter/80 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo as Home Link */}
          <Link href="/#hero" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/CodeJedi.png"
              alt="CodeJedi Logo"
              width={40}
              height={40}
              className="rounded-full object-contain border-2 border-blue-400"
            />
            <span className="ml-2 text-white font-semibold text-lg">CodeJedi</span>
          </Link>

          {/* Navigation Links - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-6">
              <Link href="/#about" className="text-white hover:text-primary-cyan transition-colors">
                About
              </Link>
              <Link href="/#skills" className="text-white hover:text-primary-cyan transition-colors">
                Skills
              </Link>
              <Link href="/#WorkExperience" className="text-white hover:text-primary-cyan transition-colors">
                Experience
              </Link>
              <Link href="/#certificates" className="text-white hover:text-primary-cyan transition-colors">
                Certificates
              </Link>
              <Link href="/#projects" className="text-white hover:text-primary-cyan transition-colors">
                Projects
              </Link>
              <Link
                href="/#contact"
                className="text-white hover:text-primary-cyan transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Spacer to balance the logo */}
          <div className="w-[180px]"></div>
        </div>
      </div>
    </nav>
  )
}
