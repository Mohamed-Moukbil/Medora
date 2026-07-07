import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy } from 'lucide-react'
import { LeaderboardList } from './leaderboard-list'

export const metadata: Metadata = { title: 'Leaderboard', description: 'Top contributors ranked by proofs, comments, and views.' }

async function getLeaderboard() {
  const users = await prisma.user.findMany({
    where: { proofs: { some: { isPublished: true } } },
    select: {
      id: true,
      name: true,
      image: true,
      _count: { select: { proofs: { where: { isPublished: true } }, comments: true } },
    },
  })

  const proofs = await prisma.proof.findMany({
    where: { isPublished: true },
    select: { authorId: true, viewCount: true },
  })

  const viewMap: Record<string, number> = {}
  for (const p of proofs) {
    viewMap[p.authorId] = (viewMap[p.authorId] || 0) + p.viewCount
  }

  return users
    .map(u => ({
      id: u.id,
      name: u.name || 'Anonymous',
      image: u.image,
      proofs: u._count.proofs,
      comments: u._count.comments,
      views: viewMap[u.id] || 0,
      score: u._count.proofs * 10 + u._count.comments * 3 + (viewMap[u.id] || 0),
    }))
    .sort((a, b) => b.score - a.score)
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard()

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">Leaderboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Top contributors ranked by proofs, comments, and views
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {leaderboard.length > 0 ? (
              <LeaderboardList users={leaderboard} />
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-lg">No contributors yet</p>
                <p className="text-sm">Be the first to submit a proof!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
