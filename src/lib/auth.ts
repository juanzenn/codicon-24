import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import Discord from "next-auth/providers/discord";

export const authConfig: NextAuthOptions = {
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(db),
  pages: { signIn: "/login", signOut: "/logout" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      const user = await db.user.findUnique({
        where: { email: token.email ?? "" },
      });

      if (!user) return token;

      token.id = user.id;
      token.name = user.name;
      token.picture = user.image;

      return token;
    },
  },
};

export const auth = NextAuth(authConfig);
