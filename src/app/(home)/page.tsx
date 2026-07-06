import Link from 'next/link'
import { getFeaturedProofs, getSubjects } from '@/lib/actions/proofs'
import { ProofCard } from '@/components/proof/proof-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeroEquations } from '@/components/hero-equations'
import { ScrollReveal } from '@/components/scroll-reveal'
import { ArrowRight, BookOpen, Users, Sparkles, Sigma, Atom, Library } from 'lucide-react'

export default async function HomePage() {
  const [featured, subjects] = await Promise.all([
    getFeaturedProofs(),
    getSubjects(),
  ])

  const mathSubjects = subjects.filter(s => s.category === 'MATHEMATICS')
  const physicsSubjects = subjects.filter(s => s.category === 'PHYSICS')

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden pb-16 pt-20 md:pb-24 md:pt-28 bg-gradient-to-b from-primary/[0.03] via-transparent to-accent/[0.03]">
        <HeroEquations />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Discover the beauty of mathematical reasoning
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Where{' '}
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl scale-150" />
                <span className="relative bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">Proofs</span>
              </span>{' '}
              Come to Life
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              A beautiful platform for sharing, discovering, and discussing mathematical and physics proofs
              with stunning LaTeX rendering. From fundamental theorems to advanced research.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/proofs">
                <Button size="lg" className="gap-2 text-base shadow-lg shadow-foreground/10">
                  <Library className="h-5 w-5" />
                  Browse Proofs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/submit">
                <Button variant="outline" size="lg" className="gap-2 text-base">
                  <Sparkles className="h-5 w-5" />
                  Submit Your Proof
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-foreground" />
                Official Proofs
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 border border-foreground/50" />
                Community Proofs
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Open Discussions
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal>
        <section className="relative border-y bg-gradient-to-br from-primary/5 via-transparent to-accent/5 py-16 overflow-hidden">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold">Explore by Subject</h2>
              <p className="mt-2 text-muted-foreground">Dive into mathematics or physics and discover proofs organized by topic</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Link href="/subjects?category=MATHEMATICS" className="group">
                <Card className="relative overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="relative p-8">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:scale-110 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                      <Sigma className="h-8 w-8" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold">Mathematics</h3>
                    <p className="mb-4 text-muted-foreground">
                      {mathSubjects.length} subjects &middot; {mathSubjects.reduce((a, s) => a + s._count.proofs, 0)} proofs
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mathSubjects.slice(0, 6).map(s => (
                        <span key={s.id} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                          {s.name}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Browse Mathematics <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/subjects?category=PHYSICS" className="group">
                <Card className="relative overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="relative p-8">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent-foreground group-hover:scale-110 group-hover:from-accent/30 group-hover:to-accent/10 transition-all duration-300">
                      <Atom className="h-8 w-8" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold">Physics</h3>
                    <p className="mb-4 text-muted-foreground">
                      {physicsSubjects.length} subjects &middot; {physicsSubjects.reduce((a, s) => a + s._count.proofs, 0)} proofs
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {physicsSubjects.slice(0, 6).map(s => (
                        <span key={s.id} className="rounded-full bg-accent/15 text-accent-foreground px-3 py-1 text-xs font-medium">
                          {s.name}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      Browse Physics <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {featured.length > 0 && (
        <ScrollReveal delay={100}>
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Featured Proofs</h2>
                  <p className="mt-1 text-muted-foreground">Most popular and recent proofs from our community</p>
                </div>
                <Link href="/proofs">
                  <Button variant="ghost" className="gap-2">
                    View all <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map(proof => (
                  <ProofCard key={proof.id} proof={proof as any} />
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal delay={100}>
        <section className="border-y bg-gradient-to-l from-primary/5 via-transparent to-accent/5 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="mt-2 text-muted-foreground">A simple process for sharing and verifying mathematical knowledge</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { icon: BookOpen, title: 'Explore', desc: 'Browse a growing collection of proofs across mathematics and physics, organized by subject and topic.', color: 'from-primary/20 to-primary/5 text-primary' },
                { icon: Sparkles, title: 'Submit', desc: 'Share your own proofs with the community. Use LaTeX for beautiful mathematical notation.', color: 'from-accent/30 to-accent/10 text-accent-foreground' },
                { icon: Users, title: 'Discuss', desc: 'Engage with proofs through comments and replies. Help improve and verify community submissions.', color: 'from-primary/20 to-accent/10 text-primary' },
              ].map((item) => (
                <Card key={item.title} className="border-0 bg-transparent text-center shadow-none group">
                  <CardContent className="p-6">
                    <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-primary/5 via-background to-accent/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
              <CardContent className="relative flex flex-col items-center justify-between gap-6 p-10 md:flex-row">
                <div>
                  <h2 className="text-2xl font-bold">Ready to contribute?</h2>
                  <p className="mt-1 text-muted-foreground">Share your knowledge with the community and help advance mathematical understanding.</p>
                </div>
                <Link href="/submit">
                  <Button size="lg" className="gap-2 shrink-0 shadow-lg shadow-primary/20">
                    <Sparkles className="h-5 w-5" />
                    Submit a Proof
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
