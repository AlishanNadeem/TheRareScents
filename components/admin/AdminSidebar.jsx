import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import LogoutButton from "@/components/admin/LogoutButton";

const navLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
];

export default function AdminSidebar({ email }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-ink/10 bg-ink px-4 py-6 text-paper">
      <div>
        <div className="px-2">
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={140}
            height={140}
            className="h-auto w-[120px]"
          />
          <p className="mt-2 text-xs text-paper/60">Admin Panel</p>
        </div>

        <nav aria-label="Admin" className="mt-8 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm text-paper/90 transition hover:bg-paper/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-3 border-t border-paper/10 pt-4">
        {email && (
          <p className="truncate px-2 text-xs text-paper/50">{email}</p>
        )}
        <LogoutButton />
      </div>
    </aside>
  );
}
