import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Sparkles, Users, Library } from 'lucide-react'

export const metadata: Metadata = { title: 'About', description: 'Learn about Medora, the platform for sharing and discovering mathematical proofs.' }

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <div className="section-label mb-3">ABOUT</div>
          <h1 className="text-4xl font-bold font-display tracking-wide">About Medora</h1>
          <p className="mt-2 text-lg text-muted-foreground font-serif">
            A platform for sharing, discovering, and discussing mathematical and physics proofs
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="font-serif">
            Medora is a community-driven platform dedicated to mathematical and physics proofs.
            We believe that mathematical knowledge should be accessible, shareable, and collaborative.
          </p>
          <p className="font-serif">
            Whether you are a student learning the fundamentals, a researcher exploring advanced
            topics, or an enthusiast who appreciates the beauty of mathematical reasoning,
            Medora provides a space to engage with proofs in a meaningful way.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {[
            { icon: Library, title: 'Comprehensive Library', desc: 'Browse proofs across mathematics and physics, organized by subject and topic.' },
            { icon: Sparkles, title: 'LaTeX Rendering', desc: 'Beautiful mathematical notation powered by KaTeX for a seamless reading experience.' },
            { icon: Users, title: 'Community Driven', desc: 'Submit your own proofs, discuss with others, and help maintain quality through moderation.' },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1 font-display tracking-wide">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-serif">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}