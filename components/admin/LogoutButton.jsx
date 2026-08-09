"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-paper/90 transition hover:bg-paper/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      Logout
    </button>
  );
}
