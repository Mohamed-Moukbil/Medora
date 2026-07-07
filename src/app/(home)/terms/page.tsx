import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service', description: 'Medora terms of service.' }

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl prose prose-lg">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: July 2026</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By using Medora, you agree to these terms of service. If you do not agree,
          please do not use the platform.
        </p>

        <h2>User Responsibilities</h2>
        <p>
          You are responsible for the content you submit, including proofs and comments.
          All content must comply with our community guidelines and applicable laws.
        </p>

        <h2>Content Ownership</h2>
        <p>
          You retain ownership of the content you submit. By submitting content, you grant
          Medora a license to display and distribute it on the platform.
        </p>

        <h2>Acceptable Use</h2>
        <p>
          You agree not to misuse the platform, including attempting to disrupt services,
          access unauthorized data, or submit malicious content.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          Medora is provided &quot;as is&quot; without warranties of any kind. We are not
          liable for any damages arising from the use of the platform.
        </p>

        <h2>Contact</h2>
        <p>
          For questions about these terms, contact us at{' '}
           the contact form on our website.
        </p>
      </div>
    </div>
  )
}