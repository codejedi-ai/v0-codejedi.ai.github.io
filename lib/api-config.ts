/**
 * API Configuration for Frontend
 * GitHub Pages frontend calls Vercel backend APIs
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://codejedi-ai.vercel.app"

export const API_ENDPOINTS = {
  workExperience: `${API_BASE_URL}/api/work-experience/`,
  aboutImages: `${API_BASE_URL}/api/about-images/`,
  skills: `${API_BASE_URL}/api/skills/`,
  projects: `${API_BASE_URL}/api/projects/`,
  certificates: `${API_BASE_URL}/api/certificates/`,
  contacts: `${API_BASE_URL}/api/contacts/`,
  contactsSubmit: `${API_BASE_URL}/api/contacts/submit/`,
  hugginFaceCertificates: `${API_BASE_URL}/api/hugging-face-certificates/`,
  images: `${API_BASE_URL}/api/images/`,
} as const
