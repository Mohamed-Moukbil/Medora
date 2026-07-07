import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAllProofs } from '@/lib/actions/proofs'
import { getContactSubmissions } from '@/lib/actions/auth'
import { AdminPanel, type AdminPanelProof } from './admin-panel'

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { tab?: string; page?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role === 'USER') redirect('/')

  const activeTab = (searchParams?.tab || 'Pending').toUpperCase()
  const page = parseInt(searchParams?.page || '1')
  const pageSize = 20

  const typeFilter = activeTab === 'ALL' ? undefined : activeTab

  const { data: proofs, total, totalPages } = await getAllProofs({ page, pageSize, type: typeFilter })
  const messages = await getContactSubmissions()

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <p className="mt-2 text-lg text-muted-foreground">Review and manage all proofs on the platform</p>
      </div>

      <AdminPanel proofs={proofs as unknown as AdminPanelProof[]} messages={messages as unknown as { id: string; name: string; email: string; message: string; read: boolean; createdAt: Date }[]} total={total} totalPages={totalPages} currentPage={page} activeTab={activeTab} />
    </div>
  )
}
