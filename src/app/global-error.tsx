'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>
            
            <button
              onClick={reset}
              className="bg-[#007a7f] text-white px-6 py-3 rounded-lg hover:bg-[#006a6f] transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}