import { Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white py-10 relative overflow-hidden">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-primary"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center">
            <Image
              src="/CodeJedi.png"
              alt="Logo"
              width={40}
              height={40}
              className="mr-3 rounded-full"
            />
            <div>
              <h3 className="text-2xl font-bold text-gradient">CodeJedi</h3>
              <p className="text-gray-400 mt-2">Crafting digital experiences with code</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              <Link
                href="#hero"
                className="text-gray-400 hover:text-primary-cyan transition-colors"
                aria-label="Back to top"
              >
                Home
              </Link>
              <Link
                href="#about"
                className="text-gray-400 hover:text-primary-cyan transition-colors"
                aria-label="About section"
              >
                About
              </Link>
              <Link
                href="#skills"
                className="text-gray-400 hover:text-primary-cyan transition-colors"
                aria-label="Skills section"
              >
                Skills
              </Link>
              <Link
                href="#certificates"
                className="text-gray-400 hover:text-primary-cyan transition-colors"
                aria-label="Certificates section"
              >
                Certificates
              </Link>
            </div>
            <p className="text-gray-500 text-sm flex items-center">
              &copy; {currentYear} CodeJedi. Made with <Heart className="h-4 w-4 text-primary-pink mx-1" /> and Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
