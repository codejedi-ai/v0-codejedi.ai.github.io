"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Certificate {
  id: string
  name: string
  image: string
  alt: string
  date: string
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const quote =
    '"The greatest scientific discovery was the discovery of ignorance."-- Yuval Noah Harari, Homo Deus: A History of Tomorrow'
  const backgroundImage =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/spacexRocket-lXq09XQLJNEDmBHyBJiKM864evBAA4.webp"

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const response = await fetch("/api/certificates")

        if (!response.ok) {
          throw new Error("Failed to fetch certificates")
        }

        const data = await response.json()
        setCertificates(data.certificates)
      } catch (err) {
        console.error("Error fetching certificates:", err)
        setError("Failed to load certificates. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  return (
    <section id="certificates" className="relative w-full">
      {/* Full-width background image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          zIndex: -1,
        }}
      >
        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 py-24 text-white">
        <h2 className="text-5xl font-bold text-center mb-4 text-white">CERTIFICATES</h2>
        <p className="text-center text-white italic mb-16 max-w-4xl mx-auto">{quote}</p>

        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 mb-8">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex flex-col items-center">
                {/* Certificate badge */}
                <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
                  <div className="relative w-40 h-40">
                    <Image src={cert.image || "/placeholder.svg"} alt={cert.alt} fill className="object-contain" />
                  </div>
                </div>

                {/* Certificate title and date */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{cert.name}</h3>
                  <p className="text-gray-300">{cert.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
