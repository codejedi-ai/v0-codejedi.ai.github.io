"use client"
import { useState } from "react"
import { Mail, Send, User, Phone, MessageSquare, Instagram, Twitter, Linkedin, Github } from "lucide-react"

interface FormState {
  success?: boolean
  message?: string
  error?: string
}

interface ContactFormData {
  name: string
  email: string
  phone: string
  instagram: string
  twitter: string
  discord: string
  linkedin: string
  github: string
  message: string
}

export default function Contact() {
  const [formState, setFormState] = useState<FormState>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    twitter: "",
    discord: "",
    linkedin: "",
    github: "",
    message: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateSocialMedia = (platform: string, value: string): string | null => {
    if (!value.trim()) return null // Optional fields
    
    switch (platform) {
      case 'instagram':
        // Instagram username validation: alphanumeric, dots, underscores, 1-30 chars
        const instagramRegex = /^@?[a-zA-Z0-9._]{1,30}$/
        if (!instagramRegex.test(value.replace('@', ''))) {
          return "Instagram username must be 1-30 characters and contain only letters, numbers, dots, and underscores."
        }
        break
      
      case 'twitter':
        // Twitter/X username validation: alphanumeric, underscores, 1-15 chars
        const twitterRegex = /^@?[a-zA-Z0-9_]{1,15}$/
        if (!twitterRegex.test(value.replace('@', ''))) {
          return "Twitter/X username must be 1-15 characters and contain only letters, numbers, and underscores."
        }
        break
      
      case 'discord':
        // Discord validation: username#discriminator or new username format
        const discordOldRegex = /^[a-zA-Z0-9._]{2,32}#[0-9]{4}$/
        const discordNewRegex = /^[a-zA-Z0-9._]{2,32}$/
        if (!discordOldRegex.test(value) && !discordNewRegex.test(value)) {
          return "Discord username should be either 'username#1234' format or new username format (2-32 characters)."
        }
        break
      
      case 'linkedin':
        // LinkedIn URL validation
        const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|profile)\/[a-zA-Z0-9-]+\/?$/
        if (!linkedinRegex.test(value)) {
          return "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)."
        }
        break
      
      case 'github':
        // GitHub URL validation
        const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/
        if (!githubRegex.test(value)) {
          return "Please enter a valid GitHub profile URL (e.g., https://github.com/yourusername)."
        }
        break
    }
    return null
  }

  const validateAtLeastOneSocial = (): boolean => {
    const socialFields = [
      formData.instagram,
      formData.twitter,
      formData.discord,
      formData.linkedin,
      formData.github
    ]
    return socialFields.some(field => field.trim() !== '')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormState({})

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormState({
        error: "Name, email, and message are required fields."
      })
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setFormState({
        error: "Please enter a valid email address."
      })
      setIsSubmitting(false)
      return
    }

    // Check if at least one social media contact is provided
    if (!validateAtLeastOneSocial()) {
      setFormState({
        error: "Please provide at least one social media contact (Instagram, Twitter, Discord, LinkedIn, or GitHub)."
      })
      setIsSubmitting(false)
      return
    }

    // Social media validation
    const socialMediaErrors = []
    
    const instagramError = validateSocialMedia('instagram', formData.instagram)
    if (instagramError) socialMediaErrors.push(`Instagram: ${instagramError}`)
    
    const twitterError = validateSocialMedia('twitter', formData.twitter)
    if (twitterError) socialMediaErrors.push(`Twitter: ${twitterError}`)
    
    const discordError = validateSocialMedia('discord', formData.discord)
    if (discordError) socialMediaErrors.push(`Discord: ${discordError}`)
    
    const linkedinError = validateSocialMedia('linkedin', formData.linkedin)
    if (linkedinError) socialMediaErrors.push(`LinkedIn: ${linkedinError}`)
    
    const githubError = validateSocialMedia('github', formData.github)
    if (githubError) socialMediaErrors.push(`GitHub: ${githubError}`)
    
    if (socialMediaErrors.length > 0) {
      setFormState({
        error: socialMediaErrors.join(' ')
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/contacts/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setFormState({
          success: true,
          message: "Thank you for your message! I'll get back to you soon."
        })
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          instagram: "",
          twitter: "",
          discord: "",
          linkedin: "",
          github: "",
          message: ""
        })
      } else {
        setFormState({
          error: result.error || "Failed to send message. Please try again."
        })
      }
    } catch (error) {
      setFormState({
        error: "Network error. Please check your connection and try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-dark-lighter to-dark text-white relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(0,210,255,0.2)_0%,rgba(10,10,24,0)_60%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(157,78,221,0.2)_0%,rgba(10,10,24,0)_60%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-center mb-4 text-white">CONTACT</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to collaborate or have a question? I'd love to hear from you. Send me a message and I'll get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="gradient-card rounded-2xl p-8 border-gradient shadow-glow">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Mail className="h-8 w-8 text-primary-cyan" />
              <h3 className="text-2xl font-bold text-white">Get In Touch</h3>
            </div>

            {/* Success/Error Messages */}
            {formState.success && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400">{formState.message}</p>
              </div>
            )}

            {formState.error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400">{formState.error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Required Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none transition-colors"
                    placeholder="Your full name"
                  />
          </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
            </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Social Media Section */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-gray-200 mb-2">
                  Social Media Contacts
                </h4>
                <p className="text-sm text-gray-400 mb-4">
                  Please provide at least one social media contact so I can connect with you.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">

                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-200 mb-2">
                      <Instagram className="h-4 w-4 inline mr-2" />
                      Instagram
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none transition-colors"
                      placeholder="@yourusername"
                    />
                  </div>

                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-200 mb-2">
                      <Twitter className="h-4 w-4 inline mr-2" />
                      Twitter/X
                    </label>
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none transition-colors"
                      placeholder="@yourusername"
                    />
                  </div>

                  <div>
                    <label htmlFor="discord" className="block text-sm font-medium text-gray-200 mb-2">
                      <MessageSquare className="h-4 w-4 inline mr-2" />
                      Discord
                    </label>
                    <input
                      type="text"
                      id="discord"
                      name="discord"
                      value={formData.discord}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none transition-colors"
                      placeholder="username#1234"
                    />
                  </div>

                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-200 mb-2">
                      <Linkedin className="h-4 w-4 inline mr-2" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none transition-colors"
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>

                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-200 mb-2">
                      <Github className="h-4 w-4 inline mr-2" />
                      GitHub
                    </label>
                    <input
                      type="url"
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none transition-colors"
                      placeholder="https://github.com/yourusername"
                    />
          </div>
        </div>
      </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none transition-colors resize-vertical"
                  placeholder="Tell me about your project, ask a question, or just say hello..."
              />
            </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-3 bg-gradient-primary text-white px-8 py-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-glow text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}