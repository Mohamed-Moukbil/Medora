import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getSubjects } from '@/lib/actions/proofs'
import { SubmitProofForm } from './submit-form'

export const metadata: Metadata = { title: 'Submit a Proof', description: 'Share your mathematical or physics proof with the community using LaTeX.' }

export default async function SubmitPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin?callbackUrl=/submit')

  const subjects = await getSubjects()

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <div className="section-label mb-3">CONTRIBUTE</div>
          <h1 className="text-4xl font-bold font-display tracking-wide">Submit a Proof</h1>
          <p className="mt-2 text-lg text-muted-foreground font-serif">
            Share your mathematical or physics proof with the community. Use LaTeX notation for beautiful formatting.
          </p>
        </div>
        <SubmitProofForm subjects={subjects as unknown as { id: string; name: string; slug: string; subSubjects: { id: string; name: string; slug: string; _count: { proofs: number } }[] }[]} />
      </div>
    </div>
  )
}
