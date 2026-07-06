'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { verifyProof, deleteProof } from '@/lib/actions/proofs'
import { markContactRead } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MathMarkdown } from '@/components/proof/math-markdown'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Loader2, Eye, EyeOff, User, Calendar, Trash2, ShieldCheck, Users, Clock, Pencil, Mail, MailOpen } from 'lucide-react'
import Link from 'next/link'

interface Proof {
  id: string
  type: string
  isPublished: boolean
  title: string
  slug: string
  content: string
  description: string | null
  createdAt: Date
  author: { id: string; name: string | null; image: string | null }
  subject: { name: string; color: string }
  subSubject: { name: string } | null
}

const typeBadge: Record<string, { label: string; variant: 'default' | 'secondary' | 'warning' | 'destructive' }> = {
  PENDING: { label: 'Pending Review', variant: 'warning' },
  COMMUNITY: { label: 'Community', variant: 'secondary' },
  OFFICIAL: { label: 'Official', variant: 'default' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
}

const tabs = ['All', 'Pending', 'Community', 'Official', 'Rejected'] as const

export function AdminPanel({ proofs, messages }: { proofs: Proof[]; messages?: { id: string; name: string; email: string; message: string; read: boolean; createdAt: Date }[] }) {
  const router = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('Pending')

  const filtered = activeTab === 'All' ? proofs : proofs.filter(p => p.type === activeTab.toUpperCase())
  const unread = messages?.filter(m => !m.read).length || 0

  async function handleVerify(proofId: string, action: 'approve' | 'reject') {
    setLoadingId(proofId)
    try {
      await verifyProof(proofId, action)
      toast.success(action === 'approve' ? 'Proof approved!' : 'Proof rejected')
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || 'Failed to process proof')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {tabs.map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab !== 'All' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({proofs.filter(p => p.type === tab.toUpperCase()).length})
              </span>
            )}
          </Button>
        ))}
        {messages && (
          <Button
            variant={activeTab === 'Messages' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('Messages')}
            className="gap-1.5"
          >
            <Mail className="h-3.5 w-3.5" />
            Messages
            {unread > 0 && (
              <span className="ml-1 rounded-full bg-destructive px-1.5 text-[10px] text-destructive-foreground">
                {unread}
              </span>
            )}
          </Button>
        )}
      </div>

      {activeTab === 'Messages' && messages ? (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="rounded-lg border border-dashed py-16 text-center">
              <Mail className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground">No messages yet</p>
            </div>
          ) : (
            messages.map(m => (
              <Card key={m.id} className={m.read ? 'opacity-70' : ''}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {m.read ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
                        <span className="font-semibold">{m.name}</span>
                        <span className="text-sm text-muted-foreground">&lt;{m.email}&gt;</span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm">{m.message}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{formatDate(m.createdAt)}</p>
                    </div>
                    {!m.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 gap-1 text-xs"
                        onClick={async () => {
                          await markContactRead(m.id)
                          router.refresh()
                        }}
                      >
                        <MailOpen className="h-3.5 w-3.5" />
                        Mark read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">No {activeTab.toLowerCase()} proofs</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeTab === 'Pending' ? 'All caught up! Check back later.' : 'No proofs in this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map(proof => {
            const badge = typeBadge[proof.type] || typeBadge.PENDING
            return (
              <Card key={proof.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant={badge.variant as any}>{badge.label}</Badge>
                        <Badge variant="outline">{proof.subject.name}</Badge>
                        {proof.subSubject && <Badge variant="outline">{proof.subSubject.name}</Badge>}
                      </div>
                      <h3 className="text-xl font-bold">{proof.title}</h3>
                      {proof.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{proof.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {proof.author.name || 'Anonymous'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(proof.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(expandedId === proof.id ? null : proof.id)}
                      className="shrink-0 ml-2"
                    >
                      {expandedId === proof.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>

                  {expandedId === proof.id && (
                    <div className="mb-4 rounded-lg border bg-muted/30 p-4">
                      <MathMarkdown content={proof.content} className="text-sm" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {proof.type === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          className="gap-1.5"
                          onClick={() => handleVerify(proof.id, 'approve')}
                          disabled={loadingId === proof.id}
                        >
                          {loadingId === proof.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1.5"
                          onClick={() => handleVerify(proof.id, 'reject')}
                          disabled={loadingId === proof.id}
                        >
                          {loadingId === proof.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Reject
                        </Button>
                      </>
                    )}
                    <Link href={`/proofs/${proof.slug}/edit`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </Link>
                    <Link href={`/proofs/${proof.slug}`}>
                      <Button variant="outline" size="sm">View Page</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto gap-1.5 text-destructive hover:text-destructive"
                      onClick={async () => {
                        if (!confirm('Delete this proof permanently?')) return
                        setLoadingId(proof.id)
                        try {
                          await deleteProof(proof.id)
                          toast.success('Proof deleted')
                          router.refresh()
                        } catch (e: any) {
                          toast.error(e.message || 'Failed to delete')
                        } finally {
                          setLoadingId(null)
                        }
                      }}
                      disabled={loadingId === proof.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
