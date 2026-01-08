"use client"
import { useState, useEffect, useRef } from "react"
import { Mail, Send, User, Phone, MessageSquare, Instagram, Twitter, Linkedin, Github, Plus, X } from "lucide-react"

interface FormState {
  success?: boolean
  message?: string
  error?: string
}

interface ContactMethod {
  id: string
  type: string
  label: string
  platform: string
  value: string
  category: string
  placeholder: string
  inputType: string
  icon: React.ComponentType<{ className?: string }>
}

interface ContactFormData {
  name: string
  message: string
  contactMethods: ContactMethod[]
}

const CONTACT_METHOD_OPTIONS = [
  // Email Category
  {
    type: "email",
    label: "Email",
    platform: "Email",
    category: "email",
    placeholder: "your.email@example.com",
    inputType: "email",
    icon: Mail,
    validation: "email"
  },
  
  // Phone Category
  {
    type: "phone",
    label: "Phone Number",
    platform: "Phone",
    category: "phone",
    placeholder: "+1 (555) 123-4567",
    inputType: "tel",
    icon: Phone,
    validation: "phone"
  },
  {
    type: "whatsapp",
    label: "WhatsApp",
    platform: "WhatsApp",
    category: "phone",
    placeholder: "+1 (555) 123-4567",
    inputType: "tel",
    icon: MessageSquare,
    validation: "phone"
  },
  
  // URL Category
  {
    type: "linkedin",
    label: "LinkedIn",
    platform: "LinkedIn",
    category: "url",
    placeholder: "https://linkedin.com/in/yourname",
    inputType: "url",
    icon: Linkedin,
    validation: "linkedin"
  },
  {
    type: "github",
    label: "GitHub",
    platform: "GitHub",
    category: "url",
    placeholder: "https://github.com/yourusername",
    inputType: "url",
    icon: Github,
    validation: "github"
  },
  
  // Social Handle Category
  {
    type: "discord",
    label: "Discord",
    platform: "Discord",
    category: "handle",
    placeholder: "username#1234",
    inputType: "text",
    icon: MessageSquare,
    validation: "discord"
  },
  {
    type: "telegram",
    label: "Telegram",
    platform: "Telegram",
    category: "handle",
    placeholder: "@username",
    inputType: "text",
    icon: MessageSquare,
    validation: "telegram"
  },
  {
    type: "instagram",
    label: "Instagram",
    platform: "Instagram",
    category: "handle",
    placeholder: "@yourusername",
    inputType: "text",
    icon: Instagram,
    validation: "instagram"
  },
  {
    type: "twitter",
    label: "Twitter/X",
    platform: "Twitter",
    category: "handle",
    placeholder: "@yourusername",
    inputType: "text",
    icon: Twitter,
    validation: "twitter"
  },
  {
    type: "wechat",
    label: "WeChat",
    platform: "WeChat",
    category: "handle",
    placeholder: "wechat-id",
    inputType: "text",
    icon: MessageSquare,
    validation: "text"
  },
  
  // Other Category
  {
    type: "other",
    label: "Other",
    platform: "",
    category: "other",
    placeholder: "Contact info",
    inputType: "text",
    icon: MessageSquare,
    validation: "text"
  }
]

export default function Contact() {
  const [formState, setFormState] = useState<FormState>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    message: "",
    contactMethods: []
  })
  const [showContactDropdown, setShowContactDropdown] = useState(false)
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowContactDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactMethodChange = (id: string, field: 'platform' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.map(method =>
        method.id === id ? { ...method, [field]: value } : method
      )
    }))
  }

  const addContactMethod = (type: string) => {
    const option = CONTACT_METHOD_OPTIONS.find(opt => opt.type === type)
    if (!option) return

    const newMethod: ContactMethod = {
      id: `${type}-${Date.now()}`,
      type: option.type,
      label: option.label,
      platform: option.platform,
      value: "",
      category: option.category,
      placeholder: option.placeholder,
      inputType: option.inputType,
      icon: option.icon
    }

    setFormData(prev => ({
      ...prev,
      contactMethods: [...prev.contactMethods, newMethod]
    }))
    setShowContactDropdown(false)
  }

  const removeContactMethod = (id: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.filter(method => method.id !== id)
    }))
  }

  const getAvailableContactMethods = () => {
    const usedTypes = formData.contactMethods.map(method => method.type)
    return CONTACT_METHOD_OPTIONS.filter(option => !usedTypes.includes(option.type))
  }

  const calculateDropdownDirection = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      const dropdownHeight = 400 // max-height of dropdown (96 * 4)
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      
      // If there's not enough space below but enough above, open upward
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownDirection('up')
    } else {
        setDropdownDirection('down')
      }
    }
  }

  const handleDropdownToggle = () => {
    if (!showContactDropdown) {
      calculateDropdownDirection()
    }
    setShowContactDropdown(!showContactDropdown)
  }

  const validateSocialMedia = (platform: string, value: string): string | null => {
    if (!value.trim()) return null // Optional fields
    
    switch (platform) {
      case 'email':
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address."
        }
        break
      
      case 'phone':
        // Basic phone validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          return "Please enter a valid phone number."
        }
        break
      
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
      
      case 'telegram':
        // Telegram username validation
        const telegramRegex = /^@?[a-zA-Z0-9_]{5,32}$/
        if (!telegramRegex.test(value.replace('@', ''))) {
          return "Telegram username must be 5-32 characters and contain only letters, numbers, and underscores."
        }
        break
      
      case 'text':
        // Basic text validation for other platforms
        if (value.trim().length < 2) {
          return "Please enter a valid username/handle."
        }
        break
      
      case 'url':
        // Basic URL validation
        try {
          new URL(value.startsWith('http') ? value : `https://${value}`)
        } catch {
          return "Please enter a valid URL."
        }
        break
    }
    return null
  }

  const validateAtLeastOneContact = (): boolean => {
    return formData.contactMethods.length > 0 && 
           formData.contactMethods.some(method => method.value.trim() !== '')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormState({})

    // Basic validation
    if (!formData.name.trim() || !formData.message.trim()) {
      setFormState({
        error: "Name and message are required fields."
      })
      setIsSubmitting(false)
      return
    }

    // Check if at least one contact method is provided
    if (!validateAtLeastOneContact()) {
      setFormState({
        error: "Please add at least one contact method so I can reach you."
      })
      setIsSubmitting(false)
      return
    }

    // Validate contact methods
    const contactErrors = []
    
    for (const method of formData.contactMethods) {
      // Validate the value if it exists
      if (method.value.trim()) {
        const error = validateSocialMedia(method.type, method.value)
        if (error) {
          contactErrors.push(`${method.label}: ${error}`)
        }
      }
      
      // For "Other" type, ensure platform is filled
      if (method.type === 'other' && !method.platform.trim()) {
        contactErrors.push(`${method.label}: Please specify the platform name`)
      }
    }
    
    if (contactErrors.length > 0) {
      setFormState({
        error: contactErrors.join(' ')
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Convert contact methods to the new API format
      const apiData = {
        name: formData.name,
        message: formData.message,
        contactMethods: formData.contactMethods.map(method => ({
          platform: method.platform || method.label,
          category: method.category,
          value: method.value
        }))
      }

      const response = await fetch("/api/contacts/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
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
          message: "",
          contactMethods: []
        })
      } else {
        setFormState({
          error: result.error || "Failed to send message. Please try again."
        })
      }
    } catch {
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
            Ready to collaborate or have a question? I&apos;d love to hear from you. Send me a message and I&apos;ll get back to you as soon as possible.
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
              {/* Core Required Fields */}
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

              {/* Dynamic Contact Methods */}
              <div className="border-t border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-200">
                    Contact Methods
                  </h4>
                  <p className="text-sm text-gray-400">
                    Add at least one way for me to reach you
            </p>
          </div>
                
                {/* Existing Contact Methods */}
                <div className="space-y-4 mb-4">
                  {formData.contactMethods.map((method) => {
                    const IconComponent = method.icon
                    return (
                      <div key={method.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-5 w-5 text-primary-cyan" />
                            <span className="text-sm font-medium text-gray-200">{method.label}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeContactMethod(method.id)}
                            className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Platform Field - Only show for "Other" */}
                          {method.type === 'other' && (
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-1">Platform *</label>
                              <input
                                type="text"
                                value={method.platform}
                                onChange={(e) => handleContactMethodChange(method.id, 'platform', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none transition-colors"
                                placeholder="Platform name (e.g., Signal, TikTok, etc.)"
                              />
                            </div>
                          )}
                          
                          {/* Single Input Field Based on Category */}
                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">
                              {method.category === 'email' ? 'Email Address' : 
                               method.category === 'phone' ? 'Phone Number' :
                               method.category === 'url' ? 'Profile URL' :
                               method.category === 'handle' ? 'Username/Handle' : 'Contact Info'} *
                            </label>
                            <input
                              type={method.inputType}
                              value={method.value}
                              onChange={(e) => handleContactMethodChange(method.id, 'value', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none transition-colors"
                              placeholder={method.placeholder}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Add Contact Method Button */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={handleDropdownToggle}
                    disabled={getAvailableContactMethods().length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-cyan/10 border border-primary-cyan/30 rounded-lg text-primary-cyan hover:bg-primary-cyan/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                    Add Contact Method
                  </button>

                  {/* Dropdown */}
                  {showContactDropdown && getAvailableContactMethods().length > 0 && (
                    <div 
                      className={`absolute left-0 w-72 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto ${
                        dropdownDirection === 'up' 
                          ? 'bottom-full mb-2' 
                          : 'top-full mt-2'
                      }`}
                    >
                      {/* Group options by category */}
                      {(() => {
                        const availableOptions = getAvailableContactMethods()
                        const categories = {
                          email: availableOptions.filter(opt => opt.category === 'email'),
                          phone: availableOptions.filter(opt => opt.category === 'phone'),
                          url: availableOptions.filter(opt => opt.category === 'url'),
                          handle: availableOptions.filter(opt => opt.category === 'handle'),
                          other: availableOptions.filter(opt => opt.category === 'other')
                        }

                        return (
                          <>
                            {/* Email Category */}
                            {categories.email.length > 0 && (
                              <div>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-750 border-b border-gray-600">
                                  EMAIL
                                </div>
                                {categories.email.map((option) => {
                                  const IconComponent = option.icon
                                  return (
                                    <button
                                      key={option.type}
                                      type="button"
                                      onClick={() => addContactMethod(option.type)}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-200 hover:bg-gray-700 transition-colors"
                                    >
                                      <IconComponent className="h-4 w-4 text-primary-cyan" />
                                      <span>{option.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            )}

                            {/* Phone Category */}
                            {categories.phone.length > 0 && (
                              <div>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-750 border-b border-gray-600">
                                  PHONE
                                </div>
                                {categories.phone.map((option) => {
                                  const IconComponent = option.icon
                                  return (
                                    <button
                                      key={option.type}
                                      type="button"
                                      onClick={() => addContactMethod(option.type)}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-200 hover:bg-gray-700 transition-colors"
                                    >
                                      <IconComponent className="h-4 w-4 text-primary-cyan" />
                                      <span>{option.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            )}

                            {/* URL Category */}
                            {categories.url.length > 0 && (
                              <div>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-750 border-b border-gray-600">
                                  PROFILE LINKS
                                </div>
                                {categories.url.map((option) => {
                                  const IconComponent = option.icon
                                  return (
                                    <button
                                      key={option.type}
                                      type="button"
                                      onClick={() => addContactMethod(option.type)}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-200 hover:bg-gray-700 transition-colors"
                                    >
                                      <IconComponent className="h-4 w-4 text-primary-cyan" />
                                      <span>{option.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            )}

                            {/* Social Handle Category */}
                            {categories.handle.length > 0 && (
                              <div>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-750 border-b border-gray-600">
                                  SOCIAL MEDIA
                                </div>
                                {categories.handle.map((option) => {
                                  const IconComponent = option.icon
                                  return (
                                    <button
                                      key={option.type}
                                      type="button"
                                      onClick={() => addContactMethod(option.type)}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-200 hover:bg-gray-700 transition-colors"
                                    >
                                      <IconComponent className="h-4 w-4 text-primary-cyan" />
                                      <span>{option.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            )}

                            {/* Other Category */}
                            {categories.other.length > 0 && (
                              <div>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-750 border-b border-gray-600">
                                  OTHER
                                </div>
                                {categories.other.map((option) => {
                                  const IconComponent = option.icon
                                  return (
                                    <button
                                      key={option.type}
                                      type="button"
                                      onClick={() => addContactMethod(option.type)}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-200 hover:bg-gray-700 rounded-b-lg transition-colors"
                                    >
                                      <IconComponent className="h-4 w-4 text-primary-cyan" />
                                      <span>{option.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  )}
        </div>
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
