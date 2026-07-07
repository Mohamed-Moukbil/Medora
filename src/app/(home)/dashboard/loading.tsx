import { Skeleton } from '@/components/ui/skeleton'
import { StatCardsSkeleton } from '@/components/loading-skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="mb-2 h-10 w-56" />
      <Skeleton className="mb-10 h-5 w-72" />
      <StatCardsSkeleton />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border">
          <div className="border-b p-6"><Skeleton className="h-6 w-36" /></div>
          <div className="space-y-3 p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <Skeleton className="mb-1 h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="ml-2 h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border">
          <div className="border-b p-6"><Skeleton className="h-6 w-24" /></div>
          <div className="space-y-3 p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
