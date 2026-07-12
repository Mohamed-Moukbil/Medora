import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { SignInForm } from './signin-form'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { verified?: string }
}) {
  const session = await getServerSession(authOptions)
  if (session?.user) redirect('/')

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {searchParams.verified === 'true' && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Email verified successfully! You can now sign in.
          </div>
        )}
        <div className="mb-8 text-center">
          <div className="section-label mb-3">AUTHENTICATION</div>
          <h1 className="text-3xl font-bold font-display tracking-wide">Welcome back</h1>
          <p className="mt-2 text-muted-foreground font-serif">Sign in to your account to continue</p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}
