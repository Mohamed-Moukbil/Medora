import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('rateLimit (Redis unavailable)', () => {
  it('returns success when no redis configured', async () => {
    // Redis is null → falls through to success
    // Need to re-import since env is set at module load time
    vi.resetModules()
    const { rateLimit } = await import('@/lib/rate-limit')
    const result = await rateLimit('test-key')
    expect(result).toEqual({ success: true, remaining: 1 })
  })
})

describe('getClientIp', () => {
  it('returns unknown when no headers', async () => {
    vi.resetModules()
    const { getClientIp } = await import('@/lib/rate-limit')
    const ip = getClientIp()
    expect(ip).toBe('unknown')
  })
})
