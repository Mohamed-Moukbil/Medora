import { Skeleton } from '@/components/ui/skeleton'
import { CardGridSkeleton } from '@/components/loading-skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center gap-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div>
          <Skeleton className="mb-1 h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <CardGridSkeleton count={6} />
    </div>
  )
}
