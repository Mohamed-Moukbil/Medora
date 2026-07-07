import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserProofs } from '@/lib/actions/proofs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { FileText, Sparkles, Eye, Clock, CheckCircle, XCircle, Pencil } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function SubmissionsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin?callbackUrl=/dashboard/submissions')

  const proofs = await getUserProofs()

  const statusColor = (type: string): 'success' | 'warning' | 'destructive' | 'default' | 'secondary' | 'outline' => {
    if (type === 'COMMUNITY') return 'success'
    if (type === 'PENDING') return 'warning'
    if (type === 'REJECTED') return 'destructive'
    return 'default'
  }

  const statusLabel = (type: string) => {
    if (type === 'COMMUNITY') return 'Approved'
    if (type === 'PENDING') return 'Pending Review'
    if (type === 'REJECTED') return 'Rejected'
    return type
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">My Submissions</h1>
          <p className="mt-2 text-lg text-muted-foreground">Track your submitted proofs</p>
        </div>
        <Link href="/submit">
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" /> New Proof
          </Button>
        </Link>
      </div>

      {proofs.length > 0 ? (
        <div className="space-y-4">
          {proofs.map(p => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={statusColor(p.type)}>
                      {statusLabel(p.type)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</span>
                  </div>
                  <Link href={`/proofs/${p.slug}`} className="text-lg font-semibold hover:text-primary transition-colors">
                    {p.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {p.subject.name}{p.subSubject ? ` / ${p.subSubject.name}` : ''}
                    {' '}&middot; {p._count.comments} comments
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {p.viewCount}
                  </span>
                  <Link href={`/proofs/${p.slug}/edit`}>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/proofs/${p.slug}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">No submissions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Submit a proof and track its status here</p>
          <Link href="/submit">
            <Button className="mt-4 gap-2">
              <Sparkles className="h-4 w-4" /> Submit your first proof
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
