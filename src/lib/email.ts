import nodemailer from 'nodemailer'

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

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #1a1a1a; margin: 0;">Medora</h1>
        </div>
        <h2 style="font-size: 20px; color: #1a1a1a; margin: 0 0 16px;">Reset your password</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 24px;">
          We received a request to reset the password for your account. Click the button below to set a new password. This link expires in 1 hour.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #1a1a1a; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Reset Password
          </a>
        </div>
        <p style="color: #999; font-size: 13px; line-height: 1.6; margin: 0 0 16px;">
          If the button doesn't work, copy and paste this URL into your browser:
        </p>
        <p style="color: #999; font-size: 13px; word-break: break-all; margin: 0;">
          ${resetUrl}
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Medora <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your Medora password',
    html,
  })
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #1a1a1a; margin: 0;">Medora</h1>
        </div>
        <h2 style="font-size: 20px; color: #1a1a1a; margin: 0 0 16px;">Verify your email</h2>
        <p style="color: #666; line-height: 1.6; margin: 0 0 24px;">
          Thanks for creating an account! Please verify your email address by clicking the button below. This link expires in 24 hours.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="display: inline-block; background-color: #1a1a1a; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Verify Email
          </a>
        </div>
        <p style="color: #999; font-size: 13px; line-height: 1.6; margin: 0 0 16px;">
          If the button doesn't work, copy and paste this URL into your browser:
        </p>
        <p style="color: #999; font-size: 13px; word-break: break-all; margin: 0;">
          ${verifyUrl}
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Medora <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your Medora email',
    html,
  })
}

export async function sendContactEmail(name: string, email: string, message: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px;">
      <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #1a1a1a; margin: 0;">Medora</h1>
        </div>
        <p style="color: #666; line-height: 1.6; margin: 0 0 8px;">New contact form submission:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; color: #1a1a1a; width: 80px;">Name</td>
            <td style="padding: 8px 12px; color: #333;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #f5f5f5; font-weight: 600; color: #1a1a1a;">Email</td>
            <td style="padding: 8px 12px; color: #333;">${email}</td>
          </tr>
        </table>
        <div style="border-top: 1px solid #eee; margin: 16px 0; padding-top: 16px;">
          <p style="font-weight: 600; color: #1a1a1a; margin: 0 0 8px;">Message:</p>
          <p style="color: #333; line-height: 1.6; white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
      </div>
    </body>
    </html>
  `

  const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER || 'admin@medora.dev'

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Medora <${process.env.SMTP_USER}>`,
    replyTo: email,
    to,
    subject: `Contact form: ${name} <${email}>`,
    html,
  })
}
