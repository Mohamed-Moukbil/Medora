import { Skeleton } from '@/components/ui/skeleton'
import { CardGridSkeleton } from '@/components/loading-skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="mb-4 h-10 w-48" />
      <Skeleton className="mb-8 h-5 w-96" />
      <Skeleton className="mb-8 h-10 w-80 rounded-md" />
      <CardGridSkeleton count={12} />
    </div>
  )
}
