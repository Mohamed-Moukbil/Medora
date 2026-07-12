import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProofBySlug, getProofVersions } from '@/lib/actions/proofs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, History, FileText } from 'lucide-react'

export default async function VersionsPage({ params }: { params: { slug: string } }) {
  const proof = await getProofBySlug(params.slug)
  if (!proof) notFound()

  const versions = await getProofVersions(proof.id)

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href={`/proofs/${proof.slug}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to proof
        </Link>
      </div>

      <div className="mb-10">
        <div className="section-label mb-3">HISTORY</div>
        <h1 className="text-4xl font-bold font-display tracking-wide">Version History</h1>
        <p className="mt-2 text-lg text-muted-foreground font-serif">{proof.title}</p>
      </div>

      {versions.length > 0 ? (
        <div className="space-y-4">
          {versions.map((v: any) => (
            <Card key={v.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Version {v.version}</p>
                    <p className="text-sm text-muted-foreground">
                      Saved on {formatDate(v.createdAt)}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">v{v.version}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <History className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">No version history yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Versions are created automatically when you edit a proof</p>
          <Link href={`/proofs/${proof.slug}/edit`}>
            <Button className="mt-4">Edit Proof</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
