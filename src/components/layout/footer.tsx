'use client'

import Link from 'next/link'
import { Github, Twitter, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-primary">⚡</span>
              Medora
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              A beautiful platform for sharing and discovering mathematical proofs.
              Built with LaTeX rendering in mind.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/Mohamed-Moukbil/Medora" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://x.com/Medora_Web" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:medora.vip" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <nav className="space-y-4">
            <h3 className="font-semibold">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/subjects" className="hover:text-foreground transition-colors">Subjects</Link></li>
              <li><Link href="/proofs" className="hover:text-foreground transition-colors">All Proofs</Link></li>
              <li><Link href="/proofs?type=OFFICIAL" className="hover:text-foreground transition-colors">Official Proofs</Link></li>
              <li><Link href="/proofs?type=COMMUNITY" className="hover:text-foreground transition-colors">Community Proofs</Link></li>
            </ul>
          </nav>

          <nav className="space-y-4">
            <h3 className="font-semibold">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/submit" className="hover:text-foreground transition-colors">Submit a Proof</Link></li>
              <li><Link href="/guidelines" className="hover:text-foreground transition-colors">Guidelines</Link></li>
              <li><Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link></li>
              <li><Link href="/moderators" className="hover:text-foreground transition-colors">Moderators</Link></li>
            </ul>
          </nav>

          <nav className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Medora. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, Prisma, and KaTeX
          </p>
        </div>
      </div>
    </footer>
  )
}