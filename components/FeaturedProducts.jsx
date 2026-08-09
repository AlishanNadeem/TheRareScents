import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { getFeaturedProducts } from "@/lib/products";

export default async function FeaturedProducts() {
  const featured = await getFeaturedProducts();

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Featured Fragrances
          </h2>
          <p className="max-w-xl text-sm text-neutral-600">
            A hand-picked edit of our most-loved perfumes and oud, curated for
            Pakistan&apos;s discerning noses.
          </p>
        </div>

        <div className="mt-10">
          <ProductGrid products={featured} />
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-ink px-6 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-paper"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
