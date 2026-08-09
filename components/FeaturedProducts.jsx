import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { getFeaturedProducts } from "@/lib/products";

export default async function FeaturedProducts() {
  const featured = await getFeaturedProducts();

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <Reveal>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-display text-2xl text-ink sm:text-3xl">
              Featured Fragrances
            </h2>
            <p className="max-w-xl text-sm text-neutral-600">
              A hand-picked edit of our most-loved perfumes and oud, curated for
              Pakistan&apos;s discerning noses.
            </p>
          </div>
        </Reveal>

        <div className="mt-10">
          <ProductGrid products={featured} />
        </div>

        <Reveal className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-ink px-6 py-2.5 text-sm font-semibold text-ink shadow-sm transition duration-300 ease-out hover:scale-[1.03] hover:bg-ink hover:text-paper hover:shadow-md"
          >
            View All Products
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
