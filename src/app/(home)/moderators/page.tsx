import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, BookOpen, MessageSquare } from 'lucide-react'

export const metadata: Metadata = { title: 'Moderators', description: 'Meet the moderators who help keep Medora a trusted platform.' }
import Link from 'next/link'

async function getModerators() {
  return prisma.user.findMany({
    where: { role: { in: ['MODERATOR', 'ADMIN'] } },
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
      createdAt: true,
      _count: { select: { proofs: true, comments: true } },
    },
    orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
  })
}

export default async function ModeratorsPage() {
  const moderators = await getModerators()

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">Moderators</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            The team helping maintain the quality and integrity of Medora
          </p>
        </div>

        <div className="space-y-4">
          {moderators.length > 0 ? (
            moderators.map((mod) => (
              <Card key={mod.id}>
                <CardContent className="flex items-center gap-4 p-6">
                  <Link href={`/users/${mod.id}`}>
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={mod.image || undefined} />
                      <AvatarFallback className="text-lg">{mod.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/users/${mod.id}`} className="font-semibold hover:text-primary">
                        {mod.name || 'Anonymous'}
                      </Link>
                      <Badge variant={mod.role === 'ADMIN' ? 'default' : 'secondary'} className="gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        {mod.role}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> {mod._count.proofs} proofs
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" /> {mod._count.comments} comments
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="rounded-lg border border-dashed py-16 text-center">
              <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground">No moderators yet</p>
              <p className="mt-1 text-sm text-muted-foreground">The moderation team will be listed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}