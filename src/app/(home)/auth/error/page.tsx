'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const errorMessages: Record<string, { title: string; message: string }> = {
  OAuthSignin: { title: 'OAuth Sign In Error', message: 'There was a problem starting your OAuth sign in. Please try again.' },
  OAuthCallback: { title: 'OAuth Callback Error', message: 'There was a problem processing your OAuth sign in. Please try again.' },
  OAuthCreateAccount: { title: 'Account Creation Error', message: 'Could not create an account with that provider.' },
  EmailCreateAccount: { title: 'Account Creation Error', message: 'Could not create an account with that email.' },
  Callback: { title: 'Callback Error', message: 'There was a problem during the authentication callback.' },
  OAuthAccountNotLinked: { title: 'Account Not Linked', message: 'This email is already associated with another sign-in method.' },
  EmailSignin: { title: 'Email Sign In Error', message: 'The verification email could not be sent.' },
  CredentialsSignin: { title: 'Invalid Credentials', message: 'The email or password you entered is incorrect.' },
  SessionRequired: { title: 'Session Required', message: 'Please sign in to access this page.' },
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'default'
  const { title, message } = errorMessages[error] || { title: 'Authentication Error', message: 'An unexpected authentication error occurred.' }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-center text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-muted-foreground">{message}</p>
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
