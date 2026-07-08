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

## Getting Started

### Prerequisites

- Node.js 20
- PostgreSQL 16
- (Optional) Docker for containerized setup

### Environment Variables

Copy `.env.example` to `.env` and configure the values:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/medora?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Medora <noreply@gmail.com>"
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_ID=""
GOOGLE_SECRET=""
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
CONTACT_EMAIL="admin@medora.dev"
```

### Local Development

```bash
# Install dependencies
npm ci

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Seed the database (admin user + subjects + sample proof)
npm run db:seed

# Start the dev server
npm run dev
```

The app runs at `http://localhost:3000`. The seeded admin login is `admin@medora.dev` / `admin123`.

### Docker Compose

```bash
docker compose up -d --build
docker compose exec app npx prisma db seed
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Generate Prisma client + build Next.js |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Run database seed |
| `npm run db:generate` | Regenerate Prisma client |

## License

[MIT](LICENSE)
