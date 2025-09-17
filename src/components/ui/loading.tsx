export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="flex space-x-1">
        <div className="w-3 h-8 bg-[#007a7f] rounded-sm animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-8 bg-[#007a7f] rounded-sm animate-pulse" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-8 bg-[#007a7f] rounded-sm animate-pulse" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  )
}