import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = { title: 'Privacy Policy', description: 'Medora privacy policy — how we handle your data.' }

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl prose prose-lg">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: July 2026</p>

        <h2>Information We Collect</h2>
        <p>
          When you create an account, we collect your name, email address, and profile picture.
          If you sign in via OAuth providers (GitHub, Google), we receive basic profile information
          from those services.
        </p>

        <h2>How We Use Your Information</h2>
        <p>
          We use your information to provide and maintain the Medora platform, including
          attributing proofs and comments to your profile, and communicating with you about
          platform updates when necessary.
        </p>

        <h2>Data Storage</h2>
        <p>
          Your data is stored securely in our database. We use industry-standard security measures
          to protect your personal information.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We use OAuth providers (GitHub, Google) for authentication. These services may collect
          information as described in their respective privacy policies.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this privacy policy, please contact us at{' '}
           the contact form on our website.
        </p>
      </div>
    </div>
  )
}