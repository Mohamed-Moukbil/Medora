import { redirect } from 'next/navigation'
import Link from 'next/link'
import { verifyEmail } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, XCircle } from 'lucide-react'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token

  if (!token) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 text-xl font-semibold font-display tracking-wide">Invalid link</h1>
            <p className="mt-2 text-muted-foreground">This verification link is missing or invalid.</p>
            <Link href="/auth/signin">
              <Button className="mt-6">Go to sign in</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const result = await verifyEmail(token)
  if (result?.error) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 text-xl font-semibold font-display tracking-wide">Verification failed</h1>
            <p className="mt-2 text-muted-foreground">
              This link is invalid or has expired. Request a new verification email from the sign-in page.
            </p>
            <Link href="/auth/signin">
              <Button className="mt-6">Go to sign in</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  redirect('/auth/signin?verified=true')
}
