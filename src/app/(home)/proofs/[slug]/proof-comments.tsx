'use client'

import { CommentSection } from '@/components/proof/comment-section'
import { createComment, editComment, deleteComment } from '@/lib/actions/proofs'

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

export function ProofComments({
  comments,
  proofId,
  currentUserId,
}: {
  comments: Comment[]
  proofId: string
  currentUserId?: string
}) {
  return (
    <CommentSection
      comments={comments}
      proofId={proofId}
      currentUserId={currentUserId}
      onSubmit={createComment.bind(null, proofId)}
      onEdit={editComment}
      onDelete={deleteComment}
    />
  )
}
