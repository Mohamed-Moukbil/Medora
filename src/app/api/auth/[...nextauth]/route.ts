import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { NextResponse } from 'next/server'

const handler = NextAuth(authOptions)

export async function GET(request: Request, context: any) {
  return handler(request, context)
}

export async function POST(request: Request, context: any) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const rl = await rateLimit(`auth-signin:${ip}`, { max: 10, windowMs: 60_000 })
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  return handler(request, context)
}
