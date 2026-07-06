import { Redis } from '@upstash/redis'
import { headers } from 'next/headers'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export function getClientIp(): string {
  const headersList = headers()
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'
  )
}

export async function rateLimit(
  key: string,
  { max = 5, windowMs = 60_000 }: { max?: number; windowMs?: number } = {}
): Promise<{ success: true; remaining: number } | { success: false; remaining: 0; retryAfter: number }> {
  const now = Date.now()
  const windowKey = `${key}:${Math.floor(now / windowMs)}`

  const count = await redis.incr(windowKey)

  if (count === 1) {
    await redis.expire(windowKey, Math.ceil(windowMs / 1000))
  }

  if (count > max) {
    const ttl = await redis.ttl(windowKey)
    return { success: false, remaining: 0, retryAfter: Math.max(1, ttl) }
  }

  return { success: true, remaining: max - count }
}
