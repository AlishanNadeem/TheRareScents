import Link from "next/link";

// Note: metadata for this boundary is set in ../page.js's generateMetadata
// (in the `if (!product)` branch) — Next.js resolves metadata from the
// originally matched route when notFound() is called, not from this file.

export default function ProductNotFound() {
  return (
    <section className="bg-paper">
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
        <p className="font-display text-6xl text-gold">404</p>
        <h1 className="mt-4 font-display text-2xl text-ink">
          Fragrance Not Found
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          We couldn&apos;t find the perfume you were looking for. It may have
          been discontinued, sold out permanently, or the link is incorrect.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-espresso transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          Browse All Fragrances
        </Link>
      </div>
    </section>
  );
}
