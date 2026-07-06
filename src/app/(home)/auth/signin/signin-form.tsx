'use client'

import { useState, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { resendVerificationEmail, checkEmailStatus } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Github, MailCheck } from 'lucide-react'
import Link from 'next/link'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [resending, setResending] = useState<string | null>(null)
  const detailsRef = useRef<HTMLDetailsElement>(null)

  async function handleResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email') as string
    if (!email) return
    setResending(email)
    try {
      await resendVerificationEmail(email)
      toast.success('Verification email sent! Check your inbox.')
    } catch (err: any) {
      toast.error(err.message || 'Could not send verification email')
    } finally {
      setResending(null)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const result = await signIn('credentials', {
        email,
        password: formData.get('password'),
        redirect: false,
      })

      if (result?.error) {
        let status
        try {
          status = await checkEmailStatus(email)
        } catch {
          toast.error('Unable to verify account status. Please try again.')
          setIsLoading(false)
          return
        }
        if (status.exists && !status.verified) {
          toast.error('Please verify your email before signing in', {
            action: { label: 'Resend', onClick: () => { detailsRef.current && (detailsRef.current.open = true) } },
          })
        } else {
          toast.error('Invalid email or password')
        }
        setIsLoading(false)
        return
      }

      const callbackUrl = searchParams.get('callbackUrl') || '/'
      router.push(callbackUrl)
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="email" type="email" placeholder="you@example.com" required className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="password" type="password" placeholder="••••••••" required className="pl-9" />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign in
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full" onClick={() => signIn('github', { callbackUrl: searchParams.get('callbackUrl') || '/' })}>
            <Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
          <Button variant="outline" className="w-full" onClick={() => signIn('google', { callbackUrl: searchParams.get('callbackUrl') || '/' })}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>

        <details ref={detailsRef} className="mt-4">
          <summary className="cursor-pointer text-center text-xs text-muted-foreground hover:text-foreground">
            Resend verification email
          </summary>
          <form onSubmit={handleResend} className="mt-3 flex gap-2">
            <Input name="email" type="email" placeholder="you@example.com" required className="flex-1" />
            <Button type="submit" variant="outline" size="sm" disabled={!!resending} className="gap-1.5">
              {resending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MailCheck className="h-3.5 w-3.5" />}
              Send
            </Button>
          </form>
        </details>
      </CardContent>
    </Card>
  )
}
