'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-md text-center">
        <AlertTriangle className="mx-auto mb-6 h-16 w-16 text-destructive" />
        <h1 className="mb-2 text-4xl font-bold">Something went wrong</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} size="lg">
          Try again
        </Button>
      </div>
    </div>
  )
}
