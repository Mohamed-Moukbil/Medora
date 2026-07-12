import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserStats } from '@/lib/actions/proofs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, MessageSquare, Eye, Sparkles, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin?callbackUrl=/dashboard')

  const stats = await getUserStats()
  if (!stats) return null

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="section-label mb-3">YOUR SPACE</div>
        <h1 className="text-4xl font-bold font-display tracking-wide">Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground font-serif">
          Welcome back, {session.user.name || 'User'}
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Proofs', value: stats.total, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Pending Review', value: stats.submitted, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Total Views', value: stats.views, icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Recent Proofs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.proofs.length > 0 ? (
              <div className="space-y-3">
                {stats.proofs.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="min-w-0 flex-1">
                      <Link href={`/proofs/${p.slug}`} className="font-medium hover:text-primary truncate block">
                        {p.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{p.subject.name} &middot; {p.viewCount} views</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {p.type}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No proofs yet</p>
                <Link href="/submit">
                  <Button variant="outline" size="sm" className="mt-2 gap-2">
                    <Sparkles className="h-4 w-4" /> Submit your first proof
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Comments made</span>
                <span className="font-bold">{stats.comments}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Submitted for review</span>
                <span className="font-bold">{stats.submitted}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">Approved</span>
                <span className="font-bold text-green-500">{stats.approved}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
