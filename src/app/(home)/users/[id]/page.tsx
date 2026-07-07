import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getUserById, getUserProfileProofs } from '@/lib/actions/proofs'
import { ProofCard, type ProofCardProof } from '@/components/proof/proof-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Calendar, BookOpen, MessageSquare, ArrowLeft } from 'lucide-react'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const user = await getUserById(params.id)
  if (!user) return {}
  return { title: `${user.name || 'Anonymous'}'s Profile`, description: `Proofs and activity by ${user.name || 'Anonymous'}` }
}

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id)
  if (!user) notFound()

  const proofs = await getUserProfileProofs(params.id)

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/proofs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      <Card className="mb-10 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background" />
        <CardContent className="relative px-6 pb-6">
          <div className="-mt-16 mb-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="text-2xl">{user.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-2xl font-bold">{user.name || 'Anonymous'}</h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Joined {formatDate(user.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> {user._count.proofs} proofs
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> {user._count.comments} comments
            </span>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-6 text-2xl font-bold">Published Proofs</h2>
      {proofs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {proofs.map(proof => (
            <ProofCard key={proof.id} proof={proof as unknown as ProofCardProof} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">No published proofs yet</p>
        </div>
      )}
    </div>
  )
}
