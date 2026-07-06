import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSubSubject, getProofs } from '@/lib/actions/proofs'
import { ProofCard } from '@/components/proof/proof-card'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'

export default async function SubSubjectPage({
  params,
  searchParams,
}: {
  params: { slug: string; subSlug: string }
  searchParams: { page?: string }
}) {
  const subSubject = await getSubSubject(params.slug, params.subSlug)
  if (!subSubject) notFound()

  const page = parseInt(searchParams.page || '1')
  const { data: proofs, totalPages } = await getProofs({
    subject: params.slug,
    subSubject: params.subSlug,
    page,
  })

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          <Link href="/subjects" className="hover:text-foreground">Subjects</Link>
          <span>/</span>
          <Link href={`/subjects/${params.slug}`} className="hover:text-foreground">{subSubject.subject.name}</Link>
          <span>/</span>
          <span className="font-medium text-foreground">{subSubject.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: subSubject.subject.color + '20' }}
          >
            <BookOpen className="h-7 w-7" style={{ color: subSubject.subject.color }} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{subSubject.name}</h1>
            {subSubject.description && <p className="mt-1 text-lg text-muted-foreground">{subSubject.description}</p>}
            <p className="mt-1 text-sm text-muted-foreground">
              {subSubject._count.proofs} proof{subSubject._count.proofs !== 1 ? 's' : ''} in {subSubject.subject.name}
            </p>
          </div>
        </div>
      </div>

      {proofs.length > 0 ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Proofs</h2>
            <Link href={`/submit?subject=${params.slug}&subSubject=${params.subSlug}`}>
              <Button size="sm">Submit Proof</Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proofs.map(proof => (
              <ProofCard key={proof.id} proof={proof as any} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link key={p} href={`/subjects/${params.slug}/${params.subSlug}?page=${p}`}>
                  <Button variant={p === page ? 'default' : 'outline'} size="sm">{p}</Button>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">No proofs yet in this topic</p>
          <Link href={`/submit?subject=${params.slug}&subSubject=${params.subSlug}`}>
            <Button className="mt-4 gap-2">Submit the first proof</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
