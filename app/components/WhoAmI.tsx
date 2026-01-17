"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, Pause } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/api-config"

interface SlideData {
  id: string
  src: string
  alt: string
}

// Countdown Pie Clock Component
function CountdownPieClock({ duration = 5000, onComplete }: { duration?: number; onComplete?: () => void }) {
  const [progress, setProgress] = useState(100)
  const startTimeRef = useRef(Date.now())
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    startTimeRef.current = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current
      const remaining = Math.max(0, duration - elapsed)
      const newProgress = (remaining / duration) * 100

      setProgress(newProgress)

      if (newProgress > 0) {
        animationFrameRef.current = requestAnimationFrame(updateProgress)
      } else {
        // When countdown reaches zero, call the onComplete callback
        if (onComplete) {
          onComplete()
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(updateProgress)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [duration, onComplete])

  // Calculate SVG parameters for the pie/circle
  const size = 40
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(0,210,255,0.8)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Pause className="h-4 w-4 text-white" />
      </div>
    </div>
  )
}

export default function AboutMe() {
  const [slidesData, setSlidesData] = useState<SlideData[]>([])
  const [isLoadingSlides, setIsLoadingSlides] = useState(true)
  const [slidesError, setSlidesError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pauseDuration = 5000 // 5 seconds pause duration

  // Fetch slides data from API
  useEffect(() => {
    async function fetchAboutImages() {
      try {
        console.log("Fetching about images from:", API_ENDPOINTS.aboutImages)
        const response = await fetch(API_ENDPOINTS.aboutImages)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch about images: ${response.status}`)
        }

        const data = await response.json()
        setSlidesData(data.aboutImages)
      } catch (err) {
        console.error("Error fetching about images:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to load images. Please try again later."
        setSlidesError(errorMessage)
      } finally {
        setIsLoadingSlides(false)
      }
    }

    fetchAboutImages()
  }, [])

  // Function to advance to the next slide
  const nextSlide = useCallback(() => {
    setSlidesData((current) => {
      if (!current || current.length === 0) return current
      setCurrentSlide((prev) => (prev + 1) % current.length)
      return current
    })
  }, [])

  // Function to go to the previous slide
  const prevSlide = useCallback(() => {
    setSlidesData((current) => {
      if (!current || current.length === 0) return current
      setCurrentSlide((prev) => (prev - 1 + current.length) % current.length)
      return current
    })
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

    // Set a new pause timer to resume after the pause duration
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false)
    }, pauseDuration)
  }, [])

  // Set up automatic slide cycling
  useEffect(() => {
    // Clear any existing interval
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current)
    }

    // Only set up interval if not paused and we have slides
    if (!isPaused && slidesData && slidesData.length > 0) {
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
    <section id="about" className="py-20 bg-dark-lighter text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-16 p-8 from-gray-900 to-gray-800 rounded-lg">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold mb-4 text-white">I believe ...</h2>
            <p className="text-gray-300 italic text-lg">{quote}</p>
          </div>
          <div className="w-32 h-32 relative">
            <Image
              src="/CodeJedi.png"
              alt="CodeJedi"
              fill
              className="rounded-full object-cover border-4 border-blue-400 shadow-lg"
              sizes="128px"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Slideshow */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 relative h-[400px] group">
              {isLoadingSlides ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-cyan"></div>
                </div>
              ) : slidesError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                  <p className="text-primary-pink">{slidesError}</p>
                </div>
              ) : slidesData.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                  <p className="text-gray-400">No images available</p>
                </div>
              ) : (
                <>
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

                  {/* Countdown Pie Clock instead of "Paused" text */}
                  {isPaused && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-lg">
                      <CountdownPieClock
                        duration={pauseDuration}
                        onComplete={() => {
                          // Ensure the slideshow resumes when the countdown completes
                          if (pauseTimerRef.current) {
                            clearTimeout(pauseTimerRef.current)
                            pauseTimerRef.current = null
                          }
                          setIsPaused(false)
                        }}
                      />
                    </div>
                  )}

                  {/* Hover overlay with additional info */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <p className="text-white text-lg font-medium">
                        {slidesData[currentSlide]?.alt || "Image description"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Only show navigation controls if we have slides */}
            {!isLoadingSlides && !slidesError && slidesData.length > 0 && (
              <>
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
              </>
            )}
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
