import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'USER' | 'MODERATOR' | 'ADMIN'
    } & DefaultSession['user']
  }
  interface User extends DefaultUser {
    role: 'USER' | 'MODERATOR' | 'ADMIN'
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    role: 'USER' | 'MODERATOR' | 'ADMIN'
  }
}

export type ProofType = 'OFFICIAL' | 'COMMUNITY' | 'PENDING' | 'REJECTED'

export interface Subject {
  id: string
  name: string
  slug: string
  description: string | null
  category: 'MATHEMATICS' | 'PHYSICS'
  icon: string | null
  color: string
  order: number
  subSubjects: SubSubject[]
  _count?: { proofs: number }
}

export interface SubSubject {
  id: string
  name: string
  slug: string
  description: string | null
  subjectId: string
  order: number
  _count?: { proofs: number }
}

export interface Proof {
  id: string
  title: string
  slug: string
  content: string
  latexContent: string | null
  description: string | null
  type: ProofType
  isPublished: boolean
  viewCount: number
  authorId: string
  author: { id: string; name: string | null; image: string | null }
  subjectId: string
  subject: Subject
  subSubjectId: string | null
  subSubject: SubSubject | null
  tags: Tag[]
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  content: string
  authorId: string
  author: { id: string; name: string | null; image: string | null }
  proofId: string
  parentId: string | null
  replies: Comment[]
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}