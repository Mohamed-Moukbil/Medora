import { prisma } from './prisma'

function sanitizeSearchTerm(term: string): string {
  return term.replace(/[^\w\s-]/g, '').trim()
}

export async function getFtsProofIds(search: string): Promise<string[]> {
  const term = sanitizeSearchTerm(search)
  if (!term) return []

  try {
    const rows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "Proof"
      WHERE "searchVector" @@ plainto_tsquery('english', ${term})
      ORDER BY ts_rank("searchVector", plainto_tsquery('english', ${term})) DESC
    `
    return rows.map(r => r.id)
  } catch {
    const rows = await prisma.proof.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      },
      select: { id: true },
      orderBy: { viewCount: 'desc' },
    })
    return rows.map(r => r.id)
  }
}
