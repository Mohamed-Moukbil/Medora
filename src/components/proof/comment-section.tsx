'use client'

import * as React from 'react'
import { useState } from 'react'
import { formatRelativeTime, cn } from '@/lib/utils'
import { MathMarkdown } from './math-markdown'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Edit, Trash2, Reply, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  authorId: string
  author: { id: string; name: string | null; image: string | null }
  proofId: string
  parentId: string | null
  replies: Comment[]
  createdAt: Date | string
  updatedAt: Date | string
}

interface CommentSectionProps {
  comments: Comment[]
  proofId: string
  currentUserId?: string
  onSubmit?: (content: string, parentId?: string) => Promise<void>
  onEdit?: (commentId: string, content: string) => Promise<void>
  onDelete?: (commentId: string) => Promise<void>
}

function CommentThread({
  comments,
  proofId,
  currentUserId,
  onSubmit,
  onEdit,
  onDelete,
  depth = 0,
}: {
  comments: Comment[]
  proofId: string
  currentUserId?: string
  onSubmit?: (content: string, parentId?: string) => Promise<void>
  onEdit?: (commentId: string, content: string) => Promise<void>
  onDelete?: (commentId: string) => Promise<void>
  depth?: number
}) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !onSubmit) return
    setIsSubmitting(true)
    try {
      await onSubmit(replyContent, replyingTo!)
      setReplyContent('')
      setReplyingTo(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn('space-y-4 ml-4 border-l-2 border-border', depth > 2 && 'ml-0 border-l-0')}>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          proofId={proofId}
          currentUserId={currentUserId}
          onSubmit={onSubmit}
          onReply={setReplyingTo}
          onEdit={onEdit}
          onDelete={onDelete}
          isReplying={replyingTo === comment.id}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          onReplySubmit={handleReplySubmit}
          isSubmitting={isSubmitting}
          depth={depth}
        />
      ))}
    </div>
  )
}

function Comment({
  comment,
  proofId,
  currentUserId,
  onSubmit,
  onReply,
  onEdit,
  onDelete,
  isReplying,
  replyContent,
  setReplyContent,
  onReplySubmit,
  isSubmitting,
  depth,
}: {
  comment: Comment
  proofId: string
  currentUserId?: string
  onSubmit?: (content: string, parentId?: string) => Promise<void>
  onReply?: (id: string | null) => void
  onEdit?: (commentId: string, content: string) => Promise<void>
  onDelete?: (commentId: string) => Promise<void>
  isReplying: boolean
  replyContent: string
  setReplyContent: (content: string) => void
  onReplySubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  depth: number
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isDeleting, setIsDeleting] = useState(false)

  const isAuthor = currentUserId === comment.authorId
  const canEdit = isAuthor && onEdit
  const canDelete = isAuthor && onDelete

  const handleEdit = async () => {
    if (!editContent.trim() || !onEdit) return
    await onEdit(comment.id, editContent)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!onDelete || !confirm('Delete this comment?')) return
    setIsDeleting(true)
    await onDelete(comment.id)
  }

  const handleReplyClick = () => onReply?.(comment.id)

  return (
    <div className="group relative" style={{ '--depth': depth } as React.CSSProperties}>
      <Card className={cn('overflow-hidden', depth > 0 && 'border-l-2 border-primary/20')}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Link href={`/users/${comment.author.id}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.image || undefined} alt={comment.author.name || 'User'} />
                  <AvatarFallback className="text-xs">
                    {comment.author.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/users/${comment.author.id}`} className="font-medium hover:text-primary">
                    {comment.author.name || 'Anonymous'}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                  {comment.updatedAt !== comment.createdAt && (
                    <span className="text-xs text-muted-foreground">(edited)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {canEdit && !isEditing && (
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}
              {canDelete && !isEditing && (
                <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting} className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
              {!isEditing && onReply && (
                <Button variant="ghost" size="icon" onClick={handleReplyClick} className="h-8 w-8">
                  <Reply className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px]"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleEdit} disabled={!editContent.trim()}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <MathMarkdown content={comment.content} className="text-base" />
          )}

          {isReplying && (
            <form onSubmit={onReplySubmit} className="mt-4 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply... (LaTeX supported)"
                className="min-h-[80px]"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => onReply?.(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting || !replyContent.trim()}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Reply'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>

        {comment.replies.length > 0 && (
          <CommentThread
            comments={comment.replies}
            proofId={proofId}
            currentUserId={currentUserId}
            onSubmit={onSubmit}
            onEdit={onEdit}
            onDelete={onDelete}
            depth={depth + 1}
          />
        )}
      </Card>
    </div>
  )
}

export function CommentSection({
  comments,
  proofId,
  currentUserId,
  onSubmit,
  onEdit,
  onDelete,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isReplySubmitting, setIsReplySubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !onSubmit) return
    setIsSubmitting(true)
    try {
      await onSubmit(newComment)
      setNewComment('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !onSubmit || !replyingTo) return
    setIsReplySubmitting(true)
    try {
      await onSubmit(replyContent, replyingTo)
      setReplyContent('')
      setReplyingTo(null)
    } finally {
      setIsReplySubmitting(false)
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-primary">💬</span>
        Comments ({comments.length})
      </h2>

      {currentUserId ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Join the discussion... (LaTeX supported with $...$ or $$...$$)"
                className="min-h-[100px]"
                disabled={isSubmitting}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post Comment'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 border-dashed">
          <CardContent className="pt-6 text-center py-4">
            <p className="text-muted-foreground">
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>{' '}
              to join the discussion
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            proofId={proofId}
            currentUserId={currentUserId}
            onReply={setReplyingTo}
            onEdit={onEdit}
            onDelete={onDelete}
            isReplying={replyingTo === comment.id}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            onReplySubmit={handleReplySubmit}
            isSubmitting={isReplySubmitting}
            depth={0}
          />
        ))}

        {comments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No comments yet</p>
            <p className="text-sm mt-1">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  )
}