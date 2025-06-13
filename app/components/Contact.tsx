"use client"
import { useEffect, useState, useRef } from "react"
import { Mail, ExternalLink, QrCode, X } from "lucide-react"
import * as LucideIcons from "lucide-react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { submitContactForm, type ContactFormState } from "../actions/contact"
import { useActionState } from "react"

interface ContactInfo {
  id: string
  name: string
  value: string
  icon: string
  href: string
  color: string
  qr: boolean
}

const initialState: ContactFormState = {}

export default function Contact() {
  const [contacts, setContacts] = useState<ContactInfo[]>([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(true)
  const [contactsError, setContactsError] = useState<string | null>(null)
  const [state, formAction] = useActionState(submitContactForm, initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeQrCodeContactId, setActiveQrCodeContactId] = useState<string | null>(null)
  const qrModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await fetch("/api/contacts")
        if (!response.ok) {
          throw new Error("Failed to fetch contacts")
        }
        const data = await response.json()

        // Sort contacts: QR-enabled contacts first, then others
        const sortedContacts = [...data.contacts].sort((a, b) => {
          if (a.qr && !b.qr) return -1
          if (!a.qr && b.qr) return 1
          return 0
        })

        setContacts(sortedContacts)
      } catch (err) {
        console.error("Error fetching contacts:", err)
        setContactsError("Failed to load contact information. Please try again later.")
      } finally {
        setIsLoadingContacts(false)
      }
    }
    fetchContacts()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (qrModalRef.current && !qrModalRef.current.contains(event.target as Node)) {
        setActiveQrCodeContactId(null)
      }
    }

    if (activeQrCodeContactId) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden" // Prevent background scroll
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [activeQrCodeContactId])

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as Record<string, any>)[iconName]
    return Icon ? <Icon className="h-5 w-5" /> : <Mail className="h-5 w-5" />
  }

  const handleQrCodeButtonClick = (contactId: string) => {
    setActiveQrCodeContactId(contactId)
  }

  const selectedContactForQr = contacts.find((c) => c.id === activeQrCodeContactId)

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-dark-lighter to-dark text-white relative overflow-hidden"
    >

      {/* Background effects */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute top-0 left-0  bg-[radial-gradient(circle_at_30%_30%,rgba(0,210,255,0.2)_0%,rgba(10,10,24,0)_60%)]"></div>
        <div className="absolute top-0 left-0 bg-[radial-gradient(circle_at_70%_70%,rgba(157,78,221,0.2)_0%,rgba(10,10,24,0)_60%)]"></div>
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-center mb-4 text-white">GET IN TOUCH</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with me through various channels. For quick access during in-person meetups, use the QR codes
            provided for select platforms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-3xl font-semibold mb-6 glow-text">Connect With Me</h3>
            {isLoadingContacts ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-cyan"></div>
              </div>
            ) : contactsError ? (
              <div className="text-primary-pink">{contactsError}</div>
            ) : (
              <div className="space-y-6">
                {/* QR-enabled contacts will appear first due to sorting */}
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center group p-4 rounded-lg transition-all duration-300 gradient-card
                      ${
                        contact.qr
                          ? "border-primary-cyan/30 hover:border-primary-cyan/70"
                          : "border-gray-700/30 hover:border-gray-500/70"
                      }`}
                  >
                    <div
                      className={`${contact.color} p-3 rounded-lg mr-4 transform group-hover:scale-110 transition-all duration-300 ${
                        contact.qr ? "shadow-glow" : ""
                      }`}
                    >
                      {getIconComponent(contact.icon)}
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-400 text-sm">{contact.name}</p>
                      <Link
                        href={contact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-lg font-medium transition-colors flex items-center gap-1 ${
                          contact.qr ? "text-primary-cyan hover:text-white" : "text-white hover:text-primary-cyan"
                        }`}
                      >
                        {contact.value}
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </div>
                    {contact.qr && contact.href && contact.href !== "#" && (
                      <button
                        onClick={() => handleQrCodeButtonClick(contact.id)}
                        className="ml-2 p-2 bg-dark rounded-full hover:bg-primary-cyan/20 transition-colors hover:shadow-glow"
                        aria-label={`Show ${contact.name} QR Code`}
                      >
                        <QrCode className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="gradient-card p-8 rounded-lg shadow-lg border-gradient flex flex-col justify-center items-center">
            <div className="w-24 h-24 rounded-full bg-primary-cyan/10 flex items-center justify-center mb-6 shadow-glow animate-pulse-slow">
              <Mail size={48} className="text-primary-cyan" />
            </div>
            <h3 className="text-3xl font-semibold mb-4 text-center glow-text">Let's Connect!</h3>
            <p className="text-gray-300 text-center mb-6">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of something
              great.
            </p>
            <p className="text-gray-400 text-center">
              Use the links on the left to reach out. I look forward to hearing from you!
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedContactForQr && selectedContactForQr.href && selectedContactForQr.href !== "#" && (
        <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div
            ref={qrModalRef}
            className="bg-dark-lighter p-6 rounded-lg shadow-2xl max-w-xs w-full text-center relative border-gradient"
          >
            <button
              onClick={() => setActiveQrCodeContactId(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-white"
              aria-label="Close QR Code"
            >
              <X size={24} />
            </button>
            <h4 className="text-xl font-semibold text-white mb-1 glow-text">{selectedContactForQr.name}</h4>
            <p className="text-sm text-gray-400 mb-4">@{selectedContactForQr.value}</p>
            <div className="p-4 bg-white inline-block rounded-md border-4 border-primary-cyan/30 shadow-glow">
              <QRCodeSVG
                value={selectedContactForQr.href}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={false}
              />
            </div>
            <a
              href={selectedContactForQr.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-gradient-primary text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity text-sm shadow-glow"
            >
              Open {selectedContactForQr.name} Profile
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
