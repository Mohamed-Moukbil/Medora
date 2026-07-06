'use server'

import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) return { error: 'Passwords do not match' }

    const schema = z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const parsed = schema.parse({ name, email, password })

    const ip = getClientIp()
    const rl = await rateLimit(`register:${ip}`, { max: 3, windowMs: 3_600_000 })
    if (!rl.success) return { error: 'Too many attempts. Try again later.' }

    const existing = await prisma.user.findUnique({ where: { email: parsed.email } })
    if (existing) return { error: 'Email already in use' }

    const hashed = await bcrypt.hash(parsed.password, 12)

    const user = await prisma.user.create({
      data: { name: parsed.name, email: parsed.email, password: hashed },
    })

    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.emailVerificationToken.create({
      data: { token, userId: user.id, expires },
    })

    await sendVerificationEmail(parsed.email, token)

    return { success: true }
  } catch {
    return { error: 'Something went wrong' }
  }
}

export async function checkEmailStatus(email: string) {
  const ip = getClientIp()
  const rl = await rateLimit(`check-email:${ip}`, { max: 20, windowMs: 60_000 })
  if (!rl.success) throw new Error('Too many requests. Try again later.')

  if (!email) return { exists: false, verified: false }
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true, password: true },
  })
  if (!user) return { exists: false, verified: false }
  return { exists: true, verified: !!user.emailVerified, hasPassword: !!user.password }
}

export async function verifyEmail(token: string) {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token')
  }

  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!verificationToken || verificationToken.used || verificationToken.expires < new Date()) {
    throw new Error('Invalid or expired verification link')
  }

  await prisma.user.update({
    where: { id: verificationToken.userId },
    data: { emailVerified: new Date() },
  })

  await prisma.emailVerificationToken.update({
    where: { id: verificationToken.id },
    data: { used: true },
  })

  return { success: true }
}

export async function resendVerificationEmail(email: string) {
  const ip = getClientIp()
  const rl = await rateLimit(`verify:${email}:${ip}`, { max: 3, windowMs: 900_000 })
  if (!rl.success) throw new Error('Too many requests. Try again later.')

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('No account found with this email')
  if (user.emailVerified) throw new Error('Email is already verified')

  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id, used: false },
  })

  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.emailVerificationToken.create({
    data: { token, userId: user.id, expires },
  })

  await sendVerificationEmail(email, token)

  return { success: true }
}

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  if (!name || !email || !message) throw new Error('All fields are required')

  const ip = getClientIp()
  const rl = await rateLimit(`contact:${ip}`, { max: 5, windowMs: 900_000 })
  if (!rl.success) throw new Error('Too many messages. Please try again later.')

  await prisma.contactSubmission.create({ data: { name, email, message } })

  try {
    const { sendContactEmail } = await import('@/lib/email')
    await sendContactEmail(name, email, message)
  } catch {
    // Email failure shouldn't block the submission
  }
}

export async function getContactSubmissions() {
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function markContactRead(id: string) {
  await prisma.contactSubmission.update({
    where: { id },
    data: { read: true },
  })
}

export async function requestPasswordReset(email: string) {
  const ip = getClientIp()
  const rl = await rateLimit(`reset:${email}:${ip}`, { max: 3, windowMs: 3_600_000 })
  if (!rl.success) throw new Error('Too many requests. Try again later.')

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.password) {
    return { success: true }
  }

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id, used: false },
  })

  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expires,
    },
  })

  await sendPasswordResetEmail(email, token)

  return { success: true }
}

export async function resetPassword(token: string, newPassword: string) {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token')
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken || resetToken.used || resetToken.expires < new Date()) {
    throw new Error('Invalid or expired token')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  })

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { used: true },
  })

  return { success: true }
}
