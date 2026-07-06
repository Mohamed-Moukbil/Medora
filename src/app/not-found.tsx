import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-md text-center">
        <FileQuestion className="mx-auto mb-6 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-4xl font-bold">Page not found</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg">Go home</Button>
        </Link>
      </div>
    </div>
  )
}
