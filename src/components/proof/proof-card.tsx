import { formatDate, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eye, MessageSquare, Clock, ExternalLink, ShieldCheck, Users, XCircle } from 'lucide-react'
import Link from 'next/link'

export type ProofCardProof = {
    id: string
    title: string
    slug: string
    description: string | null
    type: string
    isPublished?: boolean
    viewCount: number
    createdAt: Date | string
    author: { id: string; name: string | null; image: string | null }
    subject: { name: string; slug: string; color: string }
    subSubject?: { name: string; slug: string } | null
    tags?: { id: string; name: string; slug: string }[]
    _count?: { comments: number }
  }

export interface ProofCardProps {
  proof: ProofCardProof
  variant?: 'default' | 'compact'
}

const typeConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  OFFICIAL: { label: 'Official', icon: ShieldCheck, className: 'bg-primary/10 text-primary border-primary/20' },
  COMMUNITY: { label: 'Community', icon: Users, className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' },
  PENDING: { label: 'Pending', icon: Users, className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  REJECTED: { label: 'Rejected', icon: XCircle, className: 'bg-destructive/10 text-destructive border-destructive/20' },
}

export function ProofCard({ proof, variant = 'default' }: ProofCardProps) {
  const config = typeConfig[proof.type] || typeConfig.PENDING
  const Icon = config.icon

  return (
    <Card className="h-full flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/proofs/${proof.slug}`} className="group">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {proof.title}
              </CardTitle>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {proof.description || 'No description provided'}
            </p>
          </div>
          <Badge variant="outline" className={cn('gap-1 whitespace-nowrap shrink-0', config.className)}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link href={`/subjects/${proof.subject.slug}`}>
            <Badge variant="outline" className="group-hover:bg-primary/10 transition-colors">
              {proof.subject.name}
            </Badge>
          </Link>
          {proof.subSubject && (
            <Link href={`/subjects/${proof.subject.slug}/${proof.subSubject.slug}`}>
              <Badge variant="outline" className="group-hover:bg-secondary/50 transition-colors">
                {proof.subSubject.name}
              </Badge>
            </Link>
          )}
        </div>
        {proof.tags && proof.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {proof.tags.slice(0, 3).map(tag => (
              <Link key={tag.id} href={`/proofs?tag=${tag.slug}`}>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 cursor-pointer hover:bg-secondary/80">
                  {tag.name}
                </Badge>
              </Link>
            ))}
            {proof.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{proof.tags.length - 3}</span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1" />

      <CardFooter className="pt-0 border-t flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link href={`/users/${proof.author.id}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Avatar className="h-6 w-6">
              <AvatarImage src={proof.author.image || undefined} alt={proof.author.name || 'User'} />
              <AvatarFallback>{proof.author.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{proof.author.name || 'Anonymous'}</span>
          </Link>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(proof.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {proof.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {proof._count?.comments || 0}
          </span>
        </div>

        {variant === 'default' && (
          <Link href={`/proofs/${proof.slug}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ExternalLink className="h-3.5 w-3.5" />
              View
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
