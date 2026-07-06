import Link from 'next/link'
import { getProofs, getSubjects, getAllTags } from '@/lib/actions/proofs'
import { ProofCard } from '@/components/proof/proof-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal, Sparkles, Library } from 'lucide-react'

export default async function ProofsPage({
  searchParams,
}: {
  searchParams: {
    subject?: string
    subSubject?: string
    type?: string
    sort?: string
    page?: string
    search?: string
    tag?: string
  }
}) {
  const page = parseInt(searchParams.page || '1')
  const { data: proofs, totalPages, total } = await getProofs({
    subject: searchParams.subject,
    subSubject: searchParams.subSubject,
    type: searchParams.type,
    sort: searchParams.sort,
    page,
    search: searchParams.search,
    tag: searchParams.tag,
  })

  const subjects = await getSubjects()
  const allTags = await getAllTags()

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Proofs</h1>
        <p className="mt-2 text-lg text-muted-foreground">Browse all proofs from official sources and the community</p>
      </div>

      <div className="mb-8 space-y-4">
        <form className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search proofs..."
            defaultValue={searchParams.search}
            className="pl-9"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/proofs">
            <Button variant={!searchParams.subject && !searchParams.type && !searchParams.sort ? 'default' : 'outline'} size="sm">All</Button>
          </Link>
          {subjects.map(s => (
            <Link key={s.id} href={`/proofs?subject=${s.slug}`}>
              <Button variant={searchParams.subject === s.slug ? 'default' : 'outline'} size="sm">{s.name}</Button>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Type:</span>
          <Link href={`/proofs?${new URLSearchParams({ ...searchParams, type: 'OFFICIAL', page: '1' } as Record<string, string>)}`}>
            <Button variant={searchParams.type === 'OFFICIAL' ? 'default' : 'outline'} size="sm">Official</Button>
          </Link>
          <Link href={`/proofs?${new URLSearchParams({ ...searchParams, type: 'COMMUNITY', page: '1' } as Record<string, string>)}`}>
            <Button variant={searchParams.type === 'COMMUNITY' ? 'default' : 'outline'} size="sm">Community</Button>
          </Link>
          <Link href={`/proofs?${new URLSearchParams({ ...searchParams, type: 'PENDING', page: '1' } as Record<string, string>)}`}>
            <Button variant={searchParams.type === 'PENDING' ? 'default' : 'outline'} size="sm">Pending</Button>
          </Link>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Tag:</span>
            <Link
              href={`/proofs?${new URLSearchParams(
                Object.fromEntries(Object.entries(searchParams).filter(([k]) => k !== 'tag' && k !== 'page')) as any
              )}`}
            >
              <Button variant={!searchParams.tag ? 'default' : 'outline'} size="sm">All</Button>
            </Link>
            {allTags.map(t => (
              <Link
                key={t.id}
                href={`/proofs?${new URLSearchParams({ ...searchParams, tag: t.slug, page: '1' } as Record<string, string>)}`}
              >
                <Button variant={searchParams.tag === t.slug ? 'default' : 'outline'} size="sm">{t.name}</Button>
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sort:</span>
          <Link href={`/proofs?${new URLSearchParams({ ...searchParams, sort: 'newest', page: '1' } as Record<string, string>)}`}>
            <Button variant={(!searchParams.sort || searchParams.sort === 'newest') ? 'secondary' : 'ghost'} size="sm">Newest</Button>
          </Link>
          <Link href={`/proofs?${new URLSearchParams({ ...searchParams, sort: 'popular', page: '1' } as Record<string, string>)}`}>
            <Button variant={searchParams.sort === 'popular' ? 'secondary' : 'ghost'} size="sm">Most Viewed</Button>
          </Link>
          <Link href={`/proofs?${new URLSearchParams({ ...searchParams, sort: 'oldest', page: '1' } as Record<string, string>)}`}>
            <Button variant={searchParams.sort === 'oldest' ? 'secondary' : 'ghost'} size="sm">Oldest</Button>
          </Link>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{total} proof{total !== 1 ? 's' : ''} found</p>
        <Link href="/submit">
          <Button size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Submit Proof
          </Button>
        </Link>
      </div>

      {proofs.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proofs.map(proof => (
              <ProofCard key={proof.id} proof={proof as any} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={`/proofs?${new URLSearchParams({ ...searchParams, page: String(p) } as Record<string, string>)}`}
                >
                  <Button variant={p === page ? 'default' : 'outline'} size="sm">{p}</Button>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <Library className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">No proofs found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or submit a new proof</p>
          <Link href="/submit">
            <Button className="mt-4 gap-2">
              <Sparkles className="h-4 w-4" />
              Submit a Proof
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
