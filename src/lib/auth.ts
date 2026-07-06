import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

const githubId = process.env.GITHUB_ID
const githubSecret = process.env.GITHUB_SECRET
const googleId = process.env.GOOGLE_ID
const googleSecret = process.env.GOOGLE_SECRET

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/signin', error: '/auth/error' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.password) throw new Error('Invalid credentials')
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error('Invalid credentials')
        if (!user.emailVerified) throw new Error('unverified')
        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role }
      },
    }),
    ...(githubId && githubSecret ? [GitHubProvider({ clientId: githubId, clientSecret: githubSecret })] : []),
    ...(googleId && googleSecret ? [GoogleProvider({ clientId: googleId, clientSecret: googleSecret })] : []),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) { token.id = user.id; token.role = (user as any).role }
      if (trigger === 'update' && session) { token.name = session.name; token.image = session.image }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) { (session.user as any).id = token.id; (session.user as any).role = token.role }
      return session
    },
  },
}