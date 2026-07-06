import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAllProofs } from '@/lib/actions/proofs'
import { getContactSubmissions } from '@/lib/actions/auth'
import { AdminPanel } from './admin-panel'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role === 'USER') redirect('/')

  const proofs = await getAllProofs()
  const messages = await getContactSubmissions()

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <p className="mt-2 text-lg text-muted-foreground">Review and manage all proofs on the platform</p>
      </div>

      <AdminPanel proofs={proofs as any} messages={messages as any} />
    </div>
  )
}
