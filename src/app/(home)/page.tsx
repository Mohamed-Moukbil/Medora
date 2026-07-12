import Link from 'next/link'
import { getFeaturedProofs, getSubjects } from '@/lib/actions/proofs'

export const revalidate = 300
import { ProofCard, type ProofCardProof } from '@/components/proof/proof-card'
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
      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-24 md:pb-28 md:pt-32 bg-gradient-to-b from-primary/[0.03] via-transparent to-background">
        <HeroEquations />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 section-label">Discover &middot; Share &middot; Discuss</div>
            <h1 className="font-display text-5xl font-bold tracking-wide sm:text-6xl md:text-7xl lg:text-8xl">
              Where{' '}
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-violet-500 opacity-25 blur-3xl scale-150" />
                <span className="relative bg-gradient-to-r from-primary via-primary to-violet-400 bg-clip-text text-transparent">Proofs</span>
              </span>{' '}
              Come to Life
            </h1>
            <p className="mt-6 text-lg text-muted-foreground/90 md:text-xl max-w-2xl mx-auto font-serif leading-relaxed">
              A beautiful platform for sharing, discovering, and discussing mathematical and physics proofs
              with stunning LaTeX rendering. From fundamental theorems to advanced research.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/proofs">
                <Button size="lg" className="gap-2 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                  <Library className="h-5 w-5" />
                  Browse Proofs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/submit">
                <Button variant="outline" size="lg" className="gap-2 text-base border-primary/20 hover:border-primary/40">
                  <Sparkles className="h-5 w-5" />
                  Submit Your Proof
                </Button>
              </Link>
            </div>
            <div className="mt-14 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Official Proofs
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full border border-primary/50 bg-primary/10" />
                Community Proofs
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary/60" />
                Open Discussions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Subject */}
      <ScrollReveal>
        <section className="relative border-y bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.02] py-20 overflow-hidden">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="section-label mb-4">EXPLORE SUBJECTS</div>
              <h2 className="text-3xl font-bold sm:text-4xl font-display tracking-wide">Choose Your Path</h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto font-serif">
                Dive into mathematics or physics and discover proofs organized by topic
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              <Link href="/subjects?category=MATHEMATICS" className="group">
                <Card className="relative overflow-hidden border border-primary/10 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/[0.04] blur-3xl group-hover:bg-primary/[0.08] transition-all duration-500" />
                  <CardContent className="relative p-8">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                      <Sigma className="h-8 w-8" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold font-display tracking-wide">Mathematics</h3>
                    <p className="mb-4 text-muted-foreground font-serif">
                      {mathSubjects.length} subjects &middot; {mathSubjects.reduce((a, s) => a + s._count.proofs, 0)} proofs
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mathSubjects.slice(0, 6).map(s => (
                        <span key={s.id} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                          {s.name}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                      Browse Mathematics <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/subjects?category=PHYSICS" className="group">
                <Card className="relative overflow-hidden border border-primary/10 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/[0.04] blur-3xl group-hover:bg-primary/[0.08] transition-all duration-500" />
                  <CardContent className="relative p-8">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                      <Atom className="h-8 w-8" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold font-display tracking-wide">Physics</h3>
                    <p className="mb-4 text-muted-foreground font-serif">
                      {physicsSubjects.length} subjects &middot; {physicsSubjects.reduce((a, s) => a + s._count.proofs, 0)} proofs
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {physicsSubjects.slice(0, 6).map(s => (
                        <span key={s.id} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                          {s.name}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                      Browse Physics <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Proofs */}
      {featured.length > 0 && (
        <ScrollReveal delay={100}>
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12 flex items-end justify-between">
                <div>
                  <div className="section-label mb-3">FEATURED PROOFS</div>
                  <h2 className="text-3xl font-bold sm:text-4xl font-display tracking-wide">Popular &amp; Recent</h2>
                  <p className="mt-2 text-muted-foreground font-serif">Most popular and recent proofs from our community</p>
                </div>
                <Link href="/proofs">
                  <Button variant="ghost" className="gap-2 group">
                    View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map(proof => (
                  <ProofCard key={proof.id} proof={proof as unknown as ProofCardProof} />
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* How It Works */}
      <ScrollReveal delay={100}>
        <section className="border-y bg-gradient-to-l from-primary/[0.02] via-transparent to-primary/[0.01] py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="section-label mb-4">HOW IT WORKS</div>
              <h2 className="text-3xl font-bold sm:text-4xl font-display tracking-wide">Simple Three-Step Process</h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto font-serif">
                A simple process for sharing and verifying mathematical knowledge
              </p>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {[
                { icon: BookOpen, title: 'Explore', desc: 'Browse a growing collection of proofs across mathematics and physics, organized by subject and topic.' },
                { icon: Sparkles, title: 'Submit', desc: 'Share your own proofs with the community. Use LaTeX for beautiful mathematical notation.' },
                { icon: Users, title: 'Discuss', desc: 'Engage with proofs through comments and replies. Help improve and verify community submissions.' },
              ].map((item, i) => (
                <Card key={item.title} className="relative border-0 bg-transparent text-center shadow-none group">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <div className="mx-auto mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </div>
                    <h3 className="mb-2 text-xl font-bold font-display tracking-wide">{item.title}</h3>
                    <p className="text-muted-foreground font-serif leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={200}>
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden border-primary/10 bg-gradient-to-br from-primary/[0.04] via-background to-primary/[0.02]">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/[0.08] to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-primary/[0.08] to-transparent rounded-full blur-3xl" />
              <CardContent className="relative flex flex-col items-center justify-between gap-8 p-12 md:flex-row">
                <div>
                  <div className="section-label mb-3">GET INVOLVED</div>
                  <h2 className="text-2xl font-bold font-display tracking-wide">Ready to contribute?</h2>
                  <p className="mt-2 text-muted-foreground font-serif">Share your knowledge with the community and help advance mathematical understanding.</p>
                </div>
                <Link href="/submit">
                  <Button size="lg" className="gap-2 shrink-0 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
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
