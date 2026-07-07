import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
  default: vi.fn(),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map()),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  default: {},
  prisma: {},
}))

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(),
}))
