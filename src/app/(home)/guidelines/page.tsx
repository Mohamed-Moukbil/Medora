import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FileText, ShieldCheck, Users, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react'

export const metadata: Metadata = { title: 'Guidelines', description: 'Community guidelines for submitting and reviewing proofs on Medora.' }

const guidelines = [
  {
    icon: FileText,
    title: 'Content Standards',
    items: [
      'Proofs must be mathematically or physics correct and well-reasoned',
      'Use clear, precise language with proper mathematical notation via LaTeX',
      'Include a descriptive title and brief summary of the proof',
      'Cite sources and references where applicable',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Originality & Attribution',
    items: [
      'Submit your own original work or properly attributed proofs',
      'Provide citations for known theorems and results you reference',
      'Do not plagiarize or submit copyrighted content without permission',
      'Respect the intellectual property of others',
    ],
  },
  {
    icon: Users,
    title: 'Community Conduct',
    items: [
      'Be respectful and constructive in comments and discussions',
      'Provide helpful feedback to help improve submissions',
      'Report any content that violates these guidelines',
      'No spam, harassment, or off-topic content',
    ],
  },
  {
    icon: Lightbulb,
    title: 'LaTeX Formatting Tips',
    items: [
      'Use $...$ for inline math and $$...$$ for display math',
      'Common commands: \\sum, \\int, \\prod, \\lim, \\frac{}{}',
      'Greek letters: \\alpha, \\beta, \\gamma, \\theta, \\pi',
      'Operators: \\cdot, \\times, \\otimes, \\oplus, \\circ',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Review Process',
    items: [
      'All community submissions are reviewed by moderators',
      'Proofs may be approved, rejected, or asked for revisions',
      'The review process ensures quality and correctness',
      'Official proofs are verified by subject matter experts',
    ],
  },
  {
    icon: CheckCircle,
    title: 'Proof Statuses',
    items: [
      'Pending: Awaiting review by moderators',
      'Community: Approved community-contributed proof',
      'Official: Verified and endorsed by platform experts',
    ],
  },
]

export default function GuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">Community Guidelines</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Help us maintain a high-quality platform for mathematical and physics proofs
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {guidelines.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title}>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                  </div>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Separator className="my-12" />

        <div className="rounded-lg border bg-muted/30 p-8 text-center">
          <h2 className="text-2xl font-bold">Have questions?</h2>
          <p className="mt-2 text-muted-foreground">
            If you have any questions about the guidelines or need clarification,
            please reach out to our moderation team.
          </p>
        </div>
      </div>
    </div>
  )
}