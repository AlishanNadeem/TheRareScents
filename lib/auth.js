import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";

// Shared NextAuth config — imported by both the API route handler
// (app/api/auth/[...nextauth]/route.js) and any Server Component that needs
// getServerSession(authOptions), e.g. middleware/layout auth checks.
export const authOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";

        if (!email || !password) {
          return null;
        }

        await connectToDatabase();
        const admin = await AdminUser.findOne({ email }).lean();

        if (!admin) {
          return null;
        }

        const isValid = await bcrypt.compare(password, admin.password_hash);
        if (!isValid) {
          return null;
        }

        return { id: admin._id.toString(), email: admin.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
