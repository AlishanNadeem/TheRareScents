import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import ProductGrid from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { categoryHref } from "@/lib/categoryPages";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Category landing layout — header + grid styled to match /products,
 * with SEO intro, related links, and FAQ beneath.
 */
export default function CategoryLanding({ page, products }) {
  const items = Array.isArray(products) ? products : [];
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: page.label, path: page.path },
  ];

  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
          <Breadcrumbs items={breadcrumbItems} />

          <Reveal>
            <header className="mt-6 text-center">
              <h1 className="font-display text-3xl text-ink sm:text-4xl">
                {page.h1}
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
                {page.tagline}
              </p>
            </header>
          </Reveal>

          <Reveal className="mx-auto mt-8 max-w-3xl space-y-4 text-left">
            {page.introParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-relaxed text-neutral-600 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>

          <p className="mt-8 text-center text-xs text-neutral-500">
            {items.length} {items.length === 1 ? "product" : "products"}
          </p>

          <div className="mt-6">
            {items.length ? (
              <ProductGrid products={items} animateOnMount />
            ) : (
              <div className="rounded-xl border border-ink/10 bg-white px-6 py-12 text-center">
                <p className="text-sm text-neutral-600">
                  No fragrances in this collection just yet. Browse the full
                  shop while we add more.
                </p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-espresso transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                >
                  Shop All Fragrances
                </Link>
              </div>
            )}
          </div>

          {page.relatedCategories?.length ? (
            <Reveal className="mt-12 border-t border-ink/10 pt-8 text-center">
              <p className="text-sm text-neutral-600">
                You might also like:{" "}
                {page.relatedCategories.map((related, index) => (
                  <span key={related.slug}>
                    {index > 0 && (
                      <span className="text-neutral-400"> · </span>
                    )}
                    <Link
                      href={categoryHref(related.slug)}
                      className="font-medium text-gold transition-colors duration-300 hover:text-ink"
                    >
                      {related.label}
                    </Link>
                  </span>
                ))}
                {" · "}
                <Link
                  href="/products"
                  className="font-medium text-gold transition-colors duration-300 hover:text-ink"
                >
                  All Products
                </Link>
              </p>
            </Reveal>
          ) : null}
        </div>
      </section>

      <FAQSection
        faqs={page.faqs}
        description={`Questions about ${page.label} fragrances and ordering from ${siteConfig.name}.`}
      />
    </>
  );
}
