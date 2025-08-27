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
      className={`fixed top-0 left-0 w-screen z-50 transition-all duration-300 ${
        scrolled ? "bg-dark-lighter/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="mr-4">
              <Image
                src="/img/CodeJedi.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full object-contain border-2 border-blue-400"
              />
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/#hero" className="text-white hover:text-primary-cyan transition-colors">
                Home
              </Link>
              <Link href="/#about" className="text-white hover:text-primary-cyan transition-colors">
                About
              </Link>
              <Link href="/#skills" className="text-white hover:text-primary-cyan transition-colors">
                Skills
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/#certificates" className="text-white hover:text-primary-cyan transition-colors">
              Certificates
            </Link>
            <Link href="/blog" className="text-white hover:text-primary-cyan transition-colors">
              Blog
            </Link>
            <Link href="/#WorkExperience" className="text-white hover:text-primary-cyan transition-colors">
              Experience
            </Link>
            <Link href="/#projects" className="text-white hover:text-primary-cyan transition-colors">
              Projects
            </Link>
            <Link
              href="/#contact"
              className="text-white hover:text-primary-cyan border border-primary-blue/50 px-4 py-1 rounded-full hover:bg-primary-blue/10 transition-all"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
