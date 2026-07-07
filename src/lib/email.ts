import nodemailer from 'nodemailer'
import { passwordResetTemplate, verificationTemplate, contactTemplate } from './email-templates'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Medora <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your Medora password',
    html: passwordResetTemplate(resetUrl),
  })
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Medora <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your Medora email',
    html: verificationTemplate(verifyUrl),
  })
}

export async function sendContactEmail(name: string, email: string, message: string) {
  const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER || 'admin@medora.dev'

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Medora <${process.env.SMTP_USER}>`,
    replyTo: email,
    to,
    subject: `Contact form: ${name} <${email}>`,
    html: contactTemplate(name, email, message),
  })
}
