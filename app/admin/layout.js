import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Admin panel should never be indexed, regardless of the root layout's
// default "index, follow" robots meta.
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // middleware.js guarantees only /admin/login is reachable without a
  // session, so this branch is effectively "render the login page" — no
  // sidebar chrome needed (and no session to build it from yet).
  if (!session) {
    return <div className="min-h-screen bg-paper">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar email={session.user?.email} />
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
