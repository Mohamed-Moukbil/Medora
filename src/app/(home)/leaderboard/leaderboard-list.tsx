'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Medal, BookOpen, MessageSquare, Eye, ChevronDown } from 'lucide-react'

const INITIAL_SHOW = 20
const LOAD_MORE = 20

const rankConfig = [
  { icon: Trophy, className: 'text-yellow-500', label: 'Gold' },
  { icon: Medal, className: 'text-gray-400', label: 'Silver' },
  { icon: Medal, className: 'text-amber-600', label: 'Bronze' },
]

interface LeaderboardUser {
  id: string
  name: string
  image: string | null
  proofs: number
  comments: number
  views: number
  score: number
}

export function LeaderboardList({ users }: { users: LeaderboardUser[] }) {
  const [visible, setVisible] = useState(INITIAL_SHOW)

  const displayed = users.slice(0, visible)
  const hasMore = visible < users.length

  return (
    <div>
      <div className="divide-y">
        {displayed.map((user, i) => {
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

      {hasMore && (
        <div className="flex justify-center py-6">
          <Button variant="outline" className="gap-2" onClick={() => setVisible(v => v + LOAD_MORE)}>
            <ChevronDown className="h-4 w-4" />
            Show More ({users.length - visible} remaining)
          </Button>
        </div>
      )}
    </div>
  )
}
