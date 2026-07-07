import type { Metadata } from 'next'
import Link from 'next/link'
import { getSubjects } from '@/lib/actions/proofs'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Subjects', description: 'Browse mathematical and physics proofs organized by subject.' }
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sigma, Atom, ArrowRight, BookOpen } from 'lucide-react'

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const subjects = await getSubjects(searchParams.category)
  const mathSubjects = subjects.filter(s => s.category === 'MATHEMATICS')
  const physicsSubjects = subjects.filter(s => s.category === 'PHYSICS')

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Subjects</h1>
        <p className="mt-2 text-lg text-muted-foreground">Browse proofs organized by mathematical and physics disciplines</p>
      </div>

      <div className="mb-8 flex gap-2">
        <Link href="/subjects">
          <Button variant={!searchParams.category ? 'default' : 'outline'} size="sm">All</Button>
        </Link>
        <Link href="/subjects?category=MATHEMATICS">
          <Button variant={searchParams.category === 'MATHEMATICS' ? 'default' : 'outline'} size="sm">Mathematics</Button>
        </Link>
        <Link href="/subjects?category=PHYSICS">
          <Button variant={searchParams.category === 'PHYSICS' ? 'default' : 'outline'} size="sm">Physics</Button>
        </Link>
      </div>

      {([
        ['Mathematics', mathSubjects, Sigma],
        ['Physics', physicsSubjects, Atom],
      ] as const)
        .filter(([_, subs]) => subs.length > 0)
        .map(([name, subs, Icon]) => (
        <div key={name} className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold">{name}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subs.map(subject => (
              <Link key={subject.id} href={`/subjects/${subject.slug}`} className="group">
                <Card className="h-full border-2 border-transparent transition-all hover:border-primary/50 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: subject.color + '20', color: subject.color }}
                      >
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {subject._count.proofs} proof{subject._count.proofs !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <h3 className="mb-1 text-lg font-semibold group-hover:text-primary transition-colors">{subject.name}</h3>
                    {subject.description && (
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{subject.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {subject.subSubjects.map(ss => (
                        <span
                          key={ss.id}
                          className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                          {ss.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
