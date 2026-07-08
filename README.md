# Medora

A platform for sharing, discovering, and discussing mathematical and physics proofs with beautiful LaTeX rendering.

Built with [Next.js 14](https://nextjs.org/) (App Router), [Prisma](https://www.prisma.io/) + PostgreSQL, [NextAuth.js](https://next-auth.js.org/), [Tailwind CSS](https://tailwindcss.com/), and [KaTeX](https://katex.org/).

## Features

- **Proof Repository** — Browse proofs organized by subject (Algebra, Calculus, Geometry, Quantum Mechanics, etc.)
- **LaTeX Rendering** — Proofs authored in Markdown with math delimiters rendered via KaTeX
- **Full-Text Search** — PostgreSQL `tsvector`-based search across proofs and tags
- **User Authentication** — Email/password registration with email verification, plus GitHub and Google OAuth
- **Role-Based Access Control** — USER, MODERATOR, and ADMIN roles with moderation workflows
- **Proof Lifecycle** — PENDING submission, approval to COMMUNITY, or REJECTION; system-seeded OFFICIAL proofs
- **Proof Versioning** — Every edit creates a version snapshot for history tracking
- **Threaded Comments** — Nested comments with full LaTeX support
- **Bookmarking** — Users can save proofs to a personal collection
- **Admin Panel** — Moderators/Admins can approve/reject proofs and manage contact submissions
- **Contact Form** — Visitors can submit messages stored in the database and forwarded via email
- **Password Reset** — Token-based password reset with expiration
- **Responsive Design** — Mobile-friendly with dark/light mode support
- **SEO** — Dynamic sitemap, Open Graph + Twitter cards, `robots.txt`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL 16 via Prisma ORM |
| Auth | NextAuth.js v4 (Credentials, GitHub, Google) |
| Styling | Tailwind CSS 3.4, Radix UI primitives, Lucide icons |
| Math | KaTeX via remark-math + rehype-katex |
| Markdown | react-markdown with GFM, slug, auto-link plugins |
| Rate Limiting | Upstash Redis |
| Email | Nodemailer (SMTP) |
| Validation | Zod |
| Testing | Vitest + Testing Library |
| CI | GitHub Actions |
| Containerization | Docker + Docker Compose |
