'use client'

import { SessionProvider } from 'next-auth/react'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'sonner'
import { ReactNode } from 'react'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Providers attribute="class" defaultTheme="system" enableSystem>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Providers>
    </SessionProvider>
  )
}