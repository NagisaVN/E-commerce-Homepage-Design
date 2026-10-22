export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 sm:py-14 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-4 w-3 bg-gray-200 rounded"></div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
        </div>

        {/* Hero / Banner Skeleton */}
        <div className="mb-10 rounded-2xl bg-gray-200/80 p-8 h-44 sm:h-52 flex flex-col justify-center">
          <div className="h-4 w-24 bg-gray-300 rounded mb-3"></div>
          <div className="h-8 w-72 max-w-full bg-gray-300 rounded mb-3"></div>
          <div className="h-4 w-96 max-w-full bg-gray-300 rounded"></div>
        </div>

        {/* Card Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Image placeholder */}
                <div className="h-48 w-full bg-gray-100 rounded-xl mb-4"></div>
                {/* Brand & tag */}
                <div className="flex items-center justify-between mb-2">
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded-full"></div>
                </div>
                {/* Title */}
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
              </div>

              {/* Price & button */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
