'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { verifyProof, deleteProof } from '@/lib/actions/proofs'
import { markContactRead } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { MathMarkdown } from '@/components/proof/math-markdown'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Loader2, Eye, EyeOff, User, Calendar, Trash2, ShieldCheck, Users, Clock, Pencil, Mail, MailOpen, ChevronLeft, ChevronRight } from 'lucide-react'

export interface AdminPanelProof {
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

const tabs = ['ALL', 'PENDING', 'COMMUNITY', 'OFFICIAL', 'REJECTED'] as const

const tabLabels: Record<string, string> = {
  ALL: 'All',
  PENDING: 'Pending',
  COMMUNITY: 'Community',
  OFFICIAL: 'Official',
  REJECTED: 'Rejected',
}

export function AdminPanel({
  proofs,
  messages,
  total,
  totalPages,
  currentPage,
  activeTab,
}: {
  proofs: AdminPanelProof[]
  messages?: { id: string; name: string; email: string; message: string; read: boolean; createdAt: Date }[]
  total: number
  totalPages: number
  currentPage: number
  activeTab: string
}) {
  const router = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  async function handleDeleteProof(proofId: string) {
    setLoadingId(proofId)
    setDeleteConfirmId(null)
    try {
      const result = await deleteProof(proofId)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Proof deleted')
        router.refresh()
      }
    } catch {
      toast.error('Failed to delete')
    } finally {
      setLoadingId(null)
    }
  }

  const isMessagesTab = activeTab === 'MESSAGES'
  const unread = messages?.filter(m => !m.read).length || 0

  function navigate(tab: string, page: number) {
    router.push(`/admin?tab=${tab}&page=${page}`)
  }

  async function handleVerify(proofId: string, action: 'approve' | 'reject') {
    setLoadingId(proofId)
    try {
      const result = await verifyProof(proofId, action)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(action === 'approve' ? 'Proof approved!' : 'Proof rejected')
        router.refresh()
      }
    } catch {
      toast.error('Failed to process proof')
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
            onClick={() => navigate(tab, 1)}
          >
            {tabLabels[tab]}
          </Button>
        ))}
        {messages && (
          <Button
            variant={isMessagesTab ? 'default' : 'outline'}
            size="sm"
            onClick={() => navigate('MESSAGES', 1)}
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

      {isMessagesTab && messages ? (
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
      ) : proofs.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">No {tabLabels[activeTab]?.toLowerCase() || ''} proofs</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeTab === 'PENDING' ? 'All caught up! Check back later.' : 'No proofs in this category.'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {total} proof{total !== 1 ? 's' : ''} found
          </div>
          <div className="space-y-6">
            {proofs.map(proof => (
              <Card key={proof.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant={proof.type === 'PENDING' ? 'secondary' : proof.type === 'REJECTED' ? 'destructive' : 'default'}>
                          {proof.type === 'PENDING' ? 'Pending Review' : proof.type === 'COMMUNITY' ? 'Community' : proof.type === 'OFFICIAL' ? 'Official' : 'Rejected'}
                        </Badge>
                        {proof.subject && <Badge variant="outline">{proof.subject.name}</Badge>}
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
                      onClick={() => setDeleteConfirmId(proof.id)}
                      disabled={loadingId === proof.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => navigate(activeTab, currentPage - 1)}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => navigate(activeTab, currentPage + 1)}
                className="gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteConfirmId}
        title="Delete proof?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={loadingId === deleteConfirmId}
        onConfirm={() => deleteConfirmId && handleDeleteProof(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  )
}
