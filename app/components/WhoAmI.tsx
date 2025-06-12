"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Define the slides directly in the component to ensure they're loaded
const slidesData = [
  {
    id: "about1",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about1.jpg-TbfdbEe1niYCAR6Fqv7JYcqm2zeKO9.jpeg",
    alt: "Kayaking with a Star Wars Rebel Alliance cap",
  },
  {
    id: "about2",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about2-X48rWZdpV4Q7RxVbbD5F7xRy5JhQdO.jpeg",
    alt: "Sailing at the beach with life vest",
  },
  {
    id: "about3",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about3-9AFwiFVEdtKGJqM9LmWvBQWHcfyyC2.jpeg",
    alt: "Building a sand castle on the beach",
  },
  {
    id: "about4",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about4-Vpsom9WTaJ93mBOvtKEjXoCSR1QzC5.jpeg",
    alt: "Kayaking in a blue Hydro-Force inflatable kayak",
  },
]

export default function AboutMe() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Function to advance to the next slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slidesData.length)
  }, [])

  // Function to go to the previous slide
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length)
  }, [])

  // Function to handle user interaction
  const handleUserInteraction = useCallback((newSlideIndex?: number) => {
    // If a specific slide index is provided, set it
    if (typeof newSlideIndex === "number") {
      setCurrentSlide(newSlideIndex)
    }

    // Pause the automatic cycling
    setIsPaused(true)

    // Clear any existing pause timer
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current)
    }

    // Set a new pause timer to resume after 5 seconds
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 5000)
  }, [])

  // Set up automatic slide cycling
  useEffect(() => {
    // Clear any existing interval
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current)
    }

    // Only set up interval if not paused
    if (!isPaused) {
      slideIntervalRef.current = setInterval(() => {
        nextSlide()
      }, 3000) // Change slide every 3 seconds
    }

    // Cleanup function
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current)
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current)
      }
    }
  }, [isPaused, nextSlide])

  const quote =
    '"Let each person examine his own work, and then he can take pride in himself alone, and not compare himself with someone else." -- Galatians 6:4'

  return (
    <section id="about" className="py-20 text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-16 p-8 from-gray-900 to-gray-800 rounded-lg shadow-2xl">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Who Am I
            </h2>
            <p className="text-gray-300 italic text-lg">{quote}</p>
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
            <div className="aspect-w-16 aspect-h-9 relative h-[400px] group">
              {/* Fade transition for images */}
              {slidesData.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    currentSlide === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={slide.src || "/placeholder.svg"}
                    alt={slide.alt}
                    fill
                    className="object-cover rounded-lg"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}

              {/* Pause indicator */}
              {isPaused && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">Paused</div>
              )}

              {/* Hover overlay with additional info */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full">
                  <p className="text-white text-lg font-medium">{slidesData[currentSlide].alt}</p>
                </div>
              </div>
            </div>

            {/* Navigation buttons with enhanced styling */}
            <button
              onClick={() => {
                prevSlide()
                handleUserInteraction()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white transition-all duration-300 transform hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => {
                nextSlide()
                handleUserInteraction()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white transition-all duration-300 transform hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Enhanced indicator dots */}
            <div className="flex justify-center space-x-3 mt-6">
              {slidesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleUserInteraction(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-blue-500 scale-110" : "bg-gray-400 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Slide counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentSlide + 1} / {slidesData.length}
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Majoring in Honours Bachelor of Computer Science with AI Specialization (2020-2025), University of
              Waterloo, Canada
            </h3>

            <p className="text-white mb-6">
              Embarking on the sacred path to AI mastery, my passion and curiosity guide me through uncharted
              territories—exploring the vast realms of cloud computing, neuroscience, computer vision, and the evolving
              art of AI, akin to a wise seeker in the realm of knowledge.
            </p>

            <p className="text-white">
              As a dedicated computer science student with a focus on artificial intelligence, I blend technical
              expertise with creative problem-solving. My journey in technology is driven by a passion for innovation
              and a commitment to creating solutions that make a meaningful impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
