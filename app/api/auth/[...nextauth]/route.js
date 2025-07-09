import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = NextAuth({
  providers: [

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),

  ],
  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email
        }
      })
      if (!existingUser) {
        
        await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            image: user.image,
            provider: 'google'
          }
        })
      }
      return true
    },
    async session({ session, token, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.name = dbUser.name;
      }

      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }