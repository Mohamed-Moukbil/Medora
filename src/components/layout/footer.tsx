'use client'

import Link from 'next/link'
import { Github, Twitter, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10 md:py-14 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-wide">
              Medora
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A platform for sharing and discovering mathematical proofs with beautiful LaTeX rendering.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com/Mohamed-Moukbil/Medora" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-foreground transition-colors" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://x.com/Medora_Web" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="mailto:medora.vip" className="text-muted-foreground/60 hover:text-foreground transition-colors" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground/80">
              <li><Link href="/subjects" className="hover:text-foreground transition-colors">Subjects</Link></li>
              <li><Link href="/proofs" className="hover:text-foreground transition-colors">All Proofs</Link></li>
              <li><Link href="/proofs?type=OFFICIAL" className="hover:text-foreground transition-colors">Official Proofs</Link></li>
              <li><Link href="/proofs?type=COMMUNITY" className="hover:text-foreground transition-colors">Community Proofs</Link></li>
            </ul>
          </nav>

          <nav className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground/80">
              <li><Link href="/submit" className="hover:text-foreground transition-colors">Submit a Proof</Link></li>
              <li><Link href="/guidelines" className="hover:text-foreground transition-colors">Guidelines</Link></li>
              <li><Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link></li>
              <li><Link href="/moderators" className="hover:text-foreground transition-colors">Moderators</Link></li>
            </ul>
          </nav>

          <nav className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground/80">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Medora. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built with Next.js, Prisma, and KaTeX
          </p>
        </div>
      </div>
    </footer>
  )
}