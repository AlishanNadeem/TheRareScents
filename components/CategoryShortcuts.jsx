import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

/** Crawlable shortcuts from the full catalog to category landing pages. */
export default function CategoryShortcuts({ className = "" }) {
  return (
    <nav
      aria-label="Shop by category"
      className={`text-center text-sm text-neutral-600 ${className}`.trim()}
    >
      <span className="mr-1 text-neutral-500">Browse:</span>
      {siteConfig.categories.map((category, index) => (
        <span key={category.slug}>
          {index > 0 && <span className="mx-1.5 text-neutral-300">|</span>}
          <Link
            href={category.href}
            className="font-medium text-ink transition-colors duration-300 hover:text-gold"
          >
            {category.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
