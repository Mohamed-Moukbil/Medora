import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://medora.vip'),
  title: {
    default: 'Medora - Mathematical Proofs & Theorems',
    template: '%s | Medora',
  },
  description: 'A beautiful platform for sharing, discovering, and discussing mathematical proofs with LaTeX rendering.',
  keywords: ['mathematics', 'proofs', 'theorems', 'LaTeX', 'math', 'education', 'theorems', 'lemmas'],
  authors: [{ name: 'Medora' }],
  creator: 'Medora',
  publisher: 'Medora',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://medora.vip',
    siteName: 'Medora',
    title: 'Medora - Mathematical Proofs & Theorems',
    description: 'A beautiful platform for sharing, discovering, and discussing mathematical proofs with LaTeX rendering.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Medora - Mathematical Proofs Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medora - Mathematical Proofs & Theorems',
    description: 'A beautiful platform for sharing, discovering, and discussing mathematical proofs with LaTeX rendering.',
    images: ['/og-image.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2ed' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0e1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" 
              integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" 
              crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}