import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ResetPasswordForm } from './reset-password-form'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const session = await getServerSession(authOptions)
  if (session?.user) redirect('/')

  const token = searchParams.token

  if (!token) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="section-label mb-3">ERROR</div>
          <h1 className="text-3xl font-bold font-display tracking-wide">Invalid link</h1>
          <p className="mt-2 text-muted-foreground font-serif">
            This password reset link is invalid or missing a token.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="section-label mb-3">ACCOUNT</div>
          <h1 className="text-3xl font-bold font-display tracking-wide">Set new password</h1>
          <p className="mt-2 text-muted-foreground font-serif">
            Enter your new password below
          </p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
