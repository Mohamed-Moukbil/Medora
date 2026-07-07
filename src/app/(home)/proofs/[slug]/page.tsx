import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getProofBySlug, getComments, getRelatedProofs, isProofSaved } from '@/lib/actions/proofs'

export const revalidate = 60
import { MathMarkdown } from '@/components/proof/math-markdown'
import { ProofComments } from './proof-comments'
import { ProofCard, type ProofCardProof } from '@/components/proof/proof-card'
import { SaveButton } from './save-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { Calendar, Eye, MessageSquare, ArrowLeft, ShieldCheck, Users, Pencil, History } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const proof = await getProofBySlug(params.slug)
  if (!proof) return {}
  return {
    title: proof.title,
    description: proof.description || `A ${proof.type.toLowerCase()} proof in ${proof.subject.name}`,
    openGraph: {
      title: proof.title,
      description: proof.description || `A ${proof.type.toLowerCase()} proof in ${proof.subject.name}`,
      type: 'article',
      publishedTime: proof.createdAt.toISOString(),
      tags: proof.tags.map(t => t.name),
    },
  }
}

export default async function ProofPage({ params }: { params: { slug: string } }) {
  const proof = await getProofBySlug(params.slug)
  if (!proof) notFound()

  const session = await getServerSession(authOptions)
  const comments = await getComments(proof.id)
  const currentUserId = session?.user?.id

  const [relatedProofs, saved] = await Promise.all([
    getRelatedProofs(proof.id, proof.subjectId),
    session?.user?.id ? isProofSaved(proof.id) : false,
  ])

  const isOfficial = proof.type === 'OFFICIAL'
  const isCommunity = proof.type === 'COMMUNITY'

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/proofs"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to proofs
        </Link>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge
            variant={isOfficial ? 'default' : 'secondary'}
            className="gap-1.5 px-3 py-1 text-xs"
          >
            {isOfficial ? (
              <ShieldCheck className="h-3.5 w-3.5" />
            ) : (
              <Users className="h-3.5 w-3.5" />
            )}
            {isOfficial ? 'Official Proof' : isCommunity ? 'Community Proof' : 'Pending Review'}
          </Badge>
          <Link href={`/subjects/${proof.subject.slug}`}>
            <Badge variant="outline" className="gap-1">
              {proof.subject.name}
            </Badge>
          </Link>
          {proof.subSubject && (
            <Link href={`/subjects/${proof.subject.slug}/${proof.subSubject.slug}`}>
              <Badge variant="outline">{proof.subSubject.name}</Badge>
            </Link>
          )}
          {proof.tags.map(tag => (
            <Link key={tag.id} href={`/proofs?tag=${tag.slug}`}>
              <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>

        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{proof.title}</h1>

        {proof.description && (
          <p className="mt-4 text-lg text-muted-foreground">{proof.description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {session && (currentUserId === proof.author.id || session.user.role !== 'USER') && (
            <Link href={`/proofs/${proof.slug}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </Link>
          )}
          {session && (
            <SaveButton proofId={proof.id} initialSaved={saved} />
          )}
          <Link href={`/proofs/${proof.slug}/versions`}>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <History className="h-3.5 w-3.5" /> History
            </Button>
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={proof.author.image || undefined} />
              <AvatarFallback>{proof.author.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <Link href={`/users/${proof.author.id}`} className="font-medium text-foreground hover:text-primary">
              {proof.author.name || 'Anonymous'}
            </Link>
          </div>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(proof.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {proof.viewCount} views
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            {proof._count.comments} comments
          </span>
        </div>
      </div>

      <Separator className="mb-8" />

      <article className="prose prose-lg max-w-none">
        <MathMarkdown content={proof.content} />
      </article>

      <Separator className="my-12" />

      <div className="mb-8">
        <ProofComments
          comments={comments}
          proofId={proof.id}
          currentUserId={currentUserId}
        />
      </div>

      {relatedProofs.length > 0 && (
        <>
          <Separator className="my-12" />
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold">Related Proofs</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProofs.map(related => (
                <ProofCard key={related.id} proof={{ ...related, tags: related.tags.map(t => t.tag) } as unknown as ProofCardProof} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
