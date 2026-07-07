import { prisma } from './prisma'

function sanitizeSearchTerm(term: string): string {
  return term.replace(/[^\w\s-]/g, '').trim()
}

export async function getFtsProofIds(search: string): Promise<string[]> {
  const term = sanitizeSearchTerm(search)
  if (!term) return []

  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "Proof"
    WHERE "searchVector" @@ plainto_tsquery('english', ${term})
    ORDER BY ts_rank("searchVector", plainto_tsquery('english', ${term})) DESC
  `

  return rows.map(r => r.id)
}
