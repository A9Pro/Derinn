import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Make sure authOptions is properly typed
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },
      authorize: async (credentials) => {
        if (credentials?.username === "admin" && credentials.password === "password") {
          return { id: "1", name: "Admin" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // ✅ Must be typed correctly for NextAuth v5
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
};

// Properly typed getAdminSession
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}
