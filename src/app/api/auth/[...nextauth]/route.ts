import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Admin credentials
const users = [
  {
    id: "1",
    username: "admin",
    password: "admin310", // plain text for testing/dev
  },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find((u) => u.username === credentials?.username);
        if (!user) return null;

        // Plain text comparison
        const isValid = credentials!.password === user.password;
        if (!isValid) return null;

        return { id: user.id, name: user.username };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login", // redirect here if not logged in
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
