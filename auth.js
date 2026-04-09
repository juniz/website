import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcrypt';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' }, // Force JWT for credentials provider
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (!user || !user.password) return null;
          
          const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (passwordsMatch) return user;
        } catch (error) {
          console.error('Error during authorization:', error);
        }
        
        return null;
      }
    })
  ],
});
