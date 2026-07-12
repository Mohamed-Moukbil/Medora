import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSubjectBySlug, getProofs } from '@/lib/actions/proofs'

export const revalidate = 3600

export async function generateStaticParams() {
  const subjects = await prisma.subject.findMany({ select: { slug: true } })
  return subjects.map(s => ({ slug: s.slug }))
}
import { ProofCard, type ProofCardProof } from '@/components/proof/proof-card'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const subject = await getSubjectBySlug(params.slug)
  if (!subject) return {}
  return {
    title: `${subject.name} Proofs`,
    description: subject.description || `Browse proofs in ${subject.name}`,
  }
}

export default async function SubjectPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { page?: string }
}) {
  const subject = await getSubjectBySlug(params.slug)
  if (!subject) notFound()

  const page = parseInt(searchParams.page || '1')
  const { data: proofs, totalPages } = await getProofs({ subject: params.slug, page })

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/subjects" className="text-sm text-muted-foreground hover:text-foreground">Subjects</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">{subject.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: subject.color + '20' }}
          >
            <BookOpen className="h-7 w-7" style={{ color: subject.color }} />
          </div>
          <div>
            <div className="section-label mb-2">SUBJECT</div>
            <h1 className="text-4xl font-bold font-display tracking-wide">{subject.name}</h1>
            {subject.description && <p className="mt-1 text-lg text-muted-foreground font-serif">{subject.description}</p>}
            <p className="mt-1 text-sm text-muted-foreground">{subject._count.proofs} proofs across {subject.subSubjects.length} topics</p>
          </div>
        </div>
      </div>

      {subject.subSubjects.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {subject.subSubjects.map(ss => (
              <Link key={ss.id} href={`/subjects/${subject.slug}/${ss.slug}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  {ss.name}
                  <span className="text-xs text-muted-foreground">({ss._count.proofs})</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Proofs</h2>
      </div>

      {proofs.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proofs.map(proof => (
              <ProofCard key={proof.id} proof={proof as unknown as ProofCardProof} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link key={p} href={`/subjects/${params.slug}?page=${p}`}>
                  <Button variant={p === page ? 'default' : 'outline'} size="sm">{p}</Button>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">No proofs yet in this subject</p>
          <Link href="/submit">
            <Button variant="outline" className="mt-4 gap-2">
              Be the first to submit
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
