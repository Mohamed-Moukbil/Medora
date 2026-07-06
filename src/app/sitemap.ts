import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://medora.vip'

const staticPages = [
  { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { url: '/proofs', priority: 0.8, changeFrequency: 'daily' as const },
  { url: '/subjects', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
  { url: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
  { url: '/guidelines', priority: 0.5, changeFrequency: 'monthly' as const },
  { url: '/leaderboard', priority: 0.6, changeFrequency: 'weekly' as const },
  { url: '/moderators', priority: 0.4, changeFrequency: 'monthly' as const },
  { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
]

export default async function sitemap() {
  const [proofs, subjects] = await Promise.all([
    prisma.proof.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.subject.findMany({
      select: { slug: true, updatedAt: true },
      include: {
        subSubjects: { select: { slug: true, updatedAt: true } },
      },
    }),
  ])

  const entries = [
    ...staticPages.map(({ url, priority, changeFrequency }) => ({
      url: `${BASE_URL}${url}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    ...proofs.map((proof) => ({
      url: `${BASE_URL}/proofs/${proof.slug}`,
      lastModified: proof.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...subjects.flatMap((subject) => [
      {
        url: `${BASE_URL}/subjects/${subject.slug}`,
        lastModified: subject.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      ...subject.subSubjects.map((sub) => ({
        url: `${BASE_URL}/subjects/${subject.slug}/${sub.slug}`,
        lastModified: sub.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
    ]),
  ]

  return entries
}
