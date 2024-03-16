import { authConfig } from "@/lib/auth";
import NextAuth from "next-auth/next";

const auth = NextAuth(authConfig);

export { auth as GET, auth as POST };
