import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getProofBySlug, getSubjects } from '@/lib/actions/proofs'
import { EditProofForm } from './edit-form'

export default async function EditProofPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')

  const proof = await getProofBySlug(params.slug)
  if (!proof) notFound()

  const isOwner = proof.authorId === session.user.id
  const isMod = (session.user as any).role !== 'USER'
  if (!isOwner && !isMod) redirect('/')

  const subjects = await getSubjects()

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Edit Proof</h1>
          <p className="mt-2 text-lg text-muted-foreground">Update your proof</p>
        </div>
        <EditProofForm proof={proof as any} subjects={subjects as any} />
      </div>
    </div>
  )
}