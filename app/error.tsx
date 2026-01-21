"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log for debugging; details in browser console
    console.error("Application error on codejedi-ai.vercel.app:", error)
  }, [error])

  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-dark text-white px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <AlertTriangle className="h-10 w-10 text-primary-pink" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Application error</h1>
        <p className="text-gray-300 mb-6">
          A client-side exception occurred while loading codejedi-ai.vercel.app.
          Check the browser console for more information.
        </p>
        {error?.digest && (
          <p className="text-xs text-gray-500 mb-6">Error reference: {error.digest}</p>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-primary-blue hover:bg-primary-cyan text-white px-5 py-3 rounded-md flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Try again
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>If the issue persists, please refresh the page or contact support.</p>
        </div>
      </div>
    </section>
  )
}