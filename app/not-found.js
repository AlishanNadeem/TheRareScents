import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  ...buildMetadata({
    title: "Page Not Found",
    description: `This page could not be found. Browse original perfumes, oud & attars online in Pakistan at ${siteConfig.name}.`,
    path: "/404",
  }),
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="bg-paper">
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="font-display text-6xl text-gold">404</p>
        <h1 className="mt-4 font-display text-2xl text-ink">Page Not Found</h1>
        <p className="mt-3 text-sm text-neutral-600">
          The page you&apos;re looking for may have been moved or no longer
          exists. Let&apos;s get you back to something fragrant.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-espresso transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-ink px-8 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-paper"
          >
            Browse All Fragrances
          </Link>
        </div>
      </div>
    </section>
  );
}
