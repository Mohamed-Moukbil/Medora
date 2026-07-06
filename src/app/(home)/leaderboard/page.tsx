import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, BookOpen, MessageSquare, Eye } from 'lucide-react'
import Link from 'next/link'

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
    .slice(0, 50)
}

const rankConfig = [
  { icon: Trophy, className: 'text-yellow-500', label: 'Gold' },
  { icon: Medal, className: 'text-gray-400', label: 'Silver' },
  { icon: Medal, className: 'text-amber-600', label: 'Bronze' },
]

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
              <div className="divide-y">
                {leaderboard.map((user, i) => {
                  const RankIcon = rankConfig[i]?.icon
                  return (
                    <div key={user.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors">
                      <div className="flex w-8 justify-center text-lg font-bold text-muted-foreground">
                        {i < 3 ? (
                          <RankIcon className={`h-6 w-6 ${rankConfig[i].className}`} />
                        ) : (
                          <span>#{i + 1}</span>
                        )}
                      </div>
                      <Link href={`/users/${user.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.image || undefined} />
                          <AvatarFallback>{user.name[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{user.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" /> {user.proofs}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" /> {user.comments}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {user.views}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <Badge variant="secondary" className="shrink-0">{user.score} pts</Badge>
                    </div>
                  )
                })}
              </div>
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