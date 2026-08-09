import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Shared guard for /api/admin/** route handlers. Returns the session when
// an admin is signed in, otherwise null (caller should respond 401).
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }
  return session;
}
