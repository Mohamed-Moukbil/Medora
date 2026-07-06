import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/dashboard/settings')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true },
  })
  if (!user) redirect('/')

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="mt-2 text-lg text-muted-foreground">Update your profile information</p>
        </div>
        <SettingsForm user={user} />
      </div>
    </div>
  )
}