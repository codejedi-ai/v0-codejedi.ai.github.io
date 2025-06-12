"use server"

import { z } from "zod"

// Define a schema for form validation
const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

export type ContactFormState = {
  errors?: {
    name?: string[]
    email?: string[]
    subject?: string[]
    message?: string[]
    _form?: string[]
  }
  success?: boolean
  message?: string
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  // Validate form data
  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  })

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: "Please fix the errors in the form.",
    }
  }

  // Get validated data
  const { name, email, subject, message } = validatedFields.data

  try {
    // In a real implementation, you would send an email or save to a database
    // For now, we'll just log the data and simulate a successful submission
    console.log("Contact form submission:", { name, email, subject, message })

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return success state
    return {
      success: true,
      message: "Your message has been sent! I'll get back to you soon.",
    }
  } catch (error) {
    // Handle errors
    console.error("Error submitting contact form:", error)
    return {
      errors: {
        _form: ["Failed to send message. Please try again later."],
      },
      success: false,
      message: "An error occurred while sending your message.",
    }
  }
}
