'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createProofSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  description: z.string().min(10).max(500),
  subjectId: z.string(),
  subSubjectId: z.string().optional(),
})

export async function getSubjects(category?: string) {
  return prisma.subject.findMany({
    where: category ? { category: category as any } : undefined,
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { proofs: { where: { isPublished: true } } } },
      subSubjects: {
        orderBy: { order: 'asc' },
        include: { _count: { select: { proofs: { where: { isPublished: true } } } } },
      },
    },
  })
}

export async function getSubjectBySlug(slug: string) {
  return prisma.subject.findUnique({
    where: { slug },
    include: {
      subSubjects: {
        orderBy: { order: 'asc' },
        include: { _count: { select: { proofs: { where: { isPublished: true } } } } },
      },
      _count: { select: { proofs: { where: { isPublished: true } } } },
    },
  })
}

export async function getSubSubject(slug: string, subSlug: string) {
  return prisma.subSubject.findFirst({
    where: { slug: subSlug, subject: { slug } },
    include: {
      subject: true,
      _count: { select: { proofs: { where: { isPublished: true } } } },
    },
  })
}

export async function getAllTags() {
  return prisma.tag.findMany({ orderBy: { name: 'asc' } })
}

async function findOrCreateTags(names: string[]) {
  const tags = await Promise.all(
    names.map(async name => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name, slug },
      })
    })
  )
  return tags.map(t => ({ id: t.id }))
}

export async function getProofs({
  subject,
  subSubject,
  type,
  status,
  page = 1,
  pageSize = 12,
  search,
  sort = 'newest',
  tag,
}: {
  subject?: string
  subSubject?: string
  type?: string
  status?: string
  page?: number
  pageSize?: number
  search?: string
  sort?: string
  tag?: string
}) {
  const where: any = {}

  if (subject) where.subject = { slug: subject }
  if (subSubject) where.subSubject = { slug: subSubject }
  if (type && ['OFFICIAL', 'COMMUNITY', 'PENDING', 'REJECTED'].includes(type)) where.type = type
  if (status) where.isPublished = status === 'PUBLISHED'
  if (search) where.OR = [
    { title: { contains: search, mode: 'insensitive' } },
    { description: { contains: search, mode: 'insensitive' } },
  ]
  if (tag) where.tags = { some: { tag: { slug: tag } } }

  const orderBy: any =
    sort === 'oldest' ? { createdAt: 'asc' } :
    sort === 'popular' ? { viewCount: 'desc' } :
    { createdAt: 'desc' }

  const [data, total] = await Promise.all([
    prisma.proof.findMany({
      where: { ...where, isPublished: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: { select: { id: true, name: true, image: true } },
        subject: { select: { name: true, slug: true, color: true } },
        subSubject: { select: { name: true, slug: true } },
        _count: { select: { comments: true } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.proof.count({ where: { ...where, isPublished: true } }),
  ])

  return { data: data.map(p => ({ ...p, tags: p.tags.map(t => t.tag) })), total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getProofBySlug(slug: string) {
  const proof = await prisma.proof.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      subject: true,
      subSubject: true,
      tags: { include: { tag: true } },
      _count: { select: { comments: true } },
    },
  })
  if (!proof) return null

  if (proof.isPublished) {
    await prisma.proof.update({ where: { id: proof.id }, data: { viewCount: { increment: 1 } } })
  }

  return { ...proof, tags: proof.tags.map(t => t.tag) }
}

export async function getComments(proofId: string) {
  return prisma.comment.findMany({
    where: { proofId, parentId: null },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, image: true } },
      replies: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { id: true, name: true, image: true } },
          replies: {
            orderBy: { createdAt: 'asc' },
            include: { author: { select: { id: true, name: true, image: true } } },
          },
        },
      },
    },
  })
}

export async function createProof(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  const data = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    description: formData.get('description') as string,
    subjectId: formData.get('subjectId') as string,
    subSubjectId: formData.get('subSubjectId') as string || undefined,
  }

  const parsed = createProofSchema.parse(data)

  const slug = parsed.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)

  const tagsRaw = formData.get('tags') as string
  const tagNames: string[] = tagsRaw ? JSON.parse(tagsRaw) : []
  const tagConnections = tagNames.length > 0 ? await findOrCreateTags(tagNames) : []

  await prisma.proof.create({
    data: {
      title: parsed.title,
      slug,
      content: parsed.content,
      description: parsed.description,
      type: 'PENDING',
      authorId: session.user.id,
      subjectId: parsed.subjectId,
      subSubjectId: parsed.subSubjectId || null,
      tags: tagConnections.length > 0 ? { create: tagConnections.map(t => ({ tagId: t.id })) } : undefined,
    },
  })

  revalidatePath('/proofs')
  revalidatePath('/dashboard/submissions')
}

export async function updateProof(proofId: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  const proof = await prisma.proof.findUnique({ where: { id: proofId }, select: { id: true, slug: true, authorId: true } })
  if (!proof) throw new Error('Proof not found')

  const isOwner = proof.authorId === session.user.id
  const isMod = (session.user as any).role !== 'USER'
  if (!isOwner && !isMod) throw new Error('Unauthorized')

  const data = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    description: formData.get('description') as string,
    subjectId: formData.get('subjectId') as string,
    subSubjectId: formData.get('subSubjectId') as string || undefined,
  }

  const parsed = createProofSchema.parse(data)

  const tagsRaw = formData.get('tags') as string
  const tagNames: string[] = tagsRaw ? JSON.parse(tagsRaw) : []
  const tagConnections = tagNames.length > 0 ? await findOrCreateTags(tagNames) : []

  await prisma.proof.update({
    where: { id: proofId },
    data: {
      title: parsed.title,
      content: parsed.content,
      description: parsed.description,
      subjectId: parsed.subjectId,
      subSubjectId: parsed.subSubjectId || null,
      tags: {
        deleteMany: {},
        create: tagConnections.map(t => ({ tagId: t.id })),
      },
    },
  })

  revalidatePath(`/proofs/${proof.slug}`)
  revalidatePath('/proofs')
  revalidatePath('/dashboard/submissions')
  revalidatePath('/admin')
}

export async function createComment(proofId: string, content: string, parentId?: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  await prisma.comment.create({
    data: {
      content,
      authorId: session.user.id,
      proofId,
      parentId: parentId || null,
    },
  })

  revalidatePath(`/proofs/${proofId}`)
}

export async function editComment(commentId: string, content: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment || comment.authorId !== session.user.id) throw new Error('Unauthorized')

  await prisma.comment.update({ where: { id: commentId }, data: { content } })
  revalidatePath(`/proofs/${comment.proofId}`)
}

export async function deleteComment(commentId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment || comment.authorId !== session.user.id) throw new Error('Unauthorized')

  await prisma.comment.delete({ where: { id: commentId } })
  revalidatePath(`/proofs/${comment.proofId}`)
}

export async function getAllProofs() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role === 'USER') throw new Error('Unauthorized')

  return prisma.proof.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, image: true } },
      subject: true,
      subSubject: true,
    },
  })
}

export async function getPendingProofs() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role === 'USER') throw new Error('Unauthorized')

  return prisma.proof.findMany({
    where: { type: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, image: true } },
      subject: true,
      subSubject: true,
    },
  })
}

export async function verifyProof(proofId: string, action: 'approve' | 'reject') {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role === 'USER') throw new Error('Unauthorized')

  const type = action === 'approve' ? 'COMMUNITY' : 'REJECTED'

  await prisma.proof.update({
    where: { id: proofId },
    data: {
      type,
      isPublished: action === 'approve',
      verifiedById: session.user.id,
      verifiedAt: new Date(),
    },
  })

  revalidatePath('/admin')
  revalidatePath('/proofs')
}

export async function deleteProof(proofId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role === 'USER') throw new Error('Unauthorized')

  await prisma.proof.delete({ where: { id: proofId } })

  revalidatePath('/admin')
  revalidatePath('/proofs')
}

export async function getUserStats() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const [proofs, comments] = await Promise.all([
    prisma.proof.findMany({ where: { authorId: session.user.id }, include: { subject: true } }),
    prisma.comment.count({ where: { authorId: session.user.id } }),
  ])

  const views = proofs.reduce((sum, p) => sum + p.viewCount, 0)
  const submitted = proofs.filter(p => p.type === 'PENDING').length
  const approved = proofs.filter(p => p.type === 'COMMUNITY').length
  const rejected = proofs.filter(p => p.type === 'REJECTED').length

  return { proofs, comments, views, submitted, approved, rejected, total: proofs.length }
}

export async function getUserProofs() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return []

  return prisma.proof.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, image: true } },
      subject: { select: { name: true, slug: true, color: true } },
      subSubject: { select: { name: true, slug: true } },
      _count: { select: { comments: true } },
    },
  })
}

export async function getFeaturedProofs() {
  return prisma.proof.findMany({
    where: { isPublished: true },
    orderBy: [{ viewCount: 'desc' }, { createdAt: 'desc' }],
    take: 6,
    include: {
      author: { select: { id: true, name: true, image: true } },
      subject: { select: { name: true, slug: true, color: true } },
      subSubject: { select: { name: true, slug: true } },
      _count: { select: { comments: true } },
    },
  })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      _count: { select: { proofs: true, comments: true } },
    },
  })
}

export async function getUserProfileProofs(id: string) {
  return prisma.proof.findMany({
    where: { authorId: id, isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      author: { select: { id: true, name: true, image: true } },
      subject: { select: { name: true, slug: true, color: true } },
      _count: { select: { comments: true } },
    },
  })
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const image = formData.get('image') as string

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name || undefined,
      image: image || undefined,
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
}
