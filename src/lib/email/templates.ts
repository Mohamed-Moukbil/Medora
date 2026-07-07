function baseWrapper(content: string, maxWidth = '480px') {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px;">
  <div style="max-width: ${maxWidth}; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 24px; color: #1a1a1a; margin: 0;">Medora</h1>
    </div>
    ${content}
  </div>
</body>
</html>`
}

function button(url: string, label: string) {
  return `<div style="text-align: center; margin: 32px 0;">
  <a href="${url}" style="display: inline-block; background-color: #1a1a1a; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
    ${label}
  </a>
</div>`
}

function plainUrlFallback(url: string) {
  return `<p style="color: #999; font-size: 13px; line-height: 1.6; margin: 0 0 16px;">
  If the button doesn't work, copy and paste this URL into your browser:
</p>
<p style="color: #999; font-size: 13px; word-break: break-all; margin: 0;">
  ${url}
</p>`
}

function footer(ignoreMessage: string) {
  return `<hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;">
<p style="color: #999; font-size: 12px; margin: 0;">
  ${ignoreMessage}
</p>`
}

export function passwordResetTemplate(resetUrl: string) {
  return baseWrapper(`
    <h2 style="font-size: 20px; color: #1a1a1a; margin: 0 0 16px;">Reset your password</h2>
    <p style="color: #666; line-height: 1.6; margin: 0 0 24px;">
      We received a request to reset the password for your account. Click the button below to set a new password. This link expires in 1 hour.
    </p>
    ${button(resetUrl, 'Reset Password')}
    ${plainUrlFallback(resetUrl)}
    ${footer("If you didn't request a password reset, you can safely ignore this email.")}
  `)
}

export function verificationTemplate(verifyUrl: string) {
  return baseWrapper(`
    <h2 style="font-size: 20px; color: #1a1a1a; margin: 0 0 16px;">Verify your email</h2>
    <p style="color: #666; line-height: 1.6; margin: 0 0 24px;">
      Thanks for creating an account! Please verify your email address by clicking the button below. This link expires in 24 hours.
    </p>
    ${button(verifyUrl, 'Verify Email')}
    ${plainUrlFallback(verifyUrl)}
    ${footer("If you didn't create an account, you can safely ignore this email.")}
  `)
}

export function contactTemplate(name: string, email: string, message: string) {
  return baseWrapper(`
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
  `, '560px')
}
