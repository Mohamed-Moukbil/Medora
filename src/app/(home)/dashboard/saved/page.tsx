import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getSavedProofs } from '@/lib/actions/proofs'
import { ProofCard, type ProofCardProof } from '@/components/proof/proof-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Bookmark, Sparkles } from 'lucide-react'

export default async function SavedProofsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin?callbackUrl=/dashboard/saved')

  const saved = await getSavedProofs()

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Saved Proofs</h1>
          <p className="mt-2 text-lg text-muted-foreground">Proofs you have bookmarked</p>
        </div>
        <Link href="/proofs">
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" /> Browse Proofs
          </Button>
        </Link>
      </div>

      {saved.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((s: { id: string; proof: { tags: { tag: { id: string; name: string; slug: string } }[] } & Record<string, unknown> }) => (
            <ProofCard key={s.id} proof={{ ...s.proof, tags: s.proof.tags.map(t => t.tag) } as unknown as ProofCardProof} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <Bookmark className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">No saved proofs</p>
          <p className="mt-1 text-sm text-muted-foreground">Bookmark proofs you find interesting to read them later</p>
          <Link href="/proofs">
            <Button className="mt-4 gap-2">
              <Sparkles className="h-4 w-4" /> Browse Proofs
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
