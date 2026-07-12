import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { RegisterForm } from './register-form'

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)
  if (session?.user) redirect('/')

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="section-label mb-3">GET STARTED</div>
          <h1 className="text-3xl font-bold font-display tracking-wide">Create an account</h1>
          <p className="mt-2 text-muted-foreground font-serif">Join the community and start sharing proofs</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
