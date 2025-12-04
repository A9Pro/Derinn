export const runtime = "nodejs";

import NextAuth, { type NextAuthOptions, type User, type JWT } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface UserType extends User {
  id: string;
}

interface TokenType extends JWT {
  id?: string;
}

const users = [
  {
    id: "1",
    username: "admin",
    password: "admin310", // plain text password for testing
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password", placeholder: "admin310" },
      },
      async authorize(credentials) {
        const user = users.find((u) => u.username === credentials?.username);
        if (!user) return null;

        if (credentials?.password !== user.password) return null;

        return { id: user.id, name: user.username } as UserType;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: TokenType; user?: UserType }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }: { session: any; token: TokenType }) {
      if (token) session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
