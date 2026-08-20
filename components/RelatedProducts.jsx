import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { getProductsByCategory } from "@/lib/products";
import { getCategoryConfig } from "@/lib/siteConfig";

export default async function RelatedProducts({ currentProduct }) {
  const related = (await getProductsByCategory(currentProduct.category))
    .filter((product) => product._id !== currentProduct._id)
    .slice(0, 4);

  if (!related.length) return null;

  const categoryConfig = getCategoryConfig(currentProduct.category);

  return (
    <section
      aria-label="Related products"
      className="mt-16 border-t border-ink/10 pt-12"
    >
      <Reveal>
        <h2 className="font-display text-2xl text-ink">You Might Also Like</h2>
        <p className="mt-1 text-sm text-neutral-600">
          More from{" "}
          {categoryConfig ? (
            <Link
              href={categoryConfig.href}
              className="text-gold transition-colors duration-300 hover:text-ink"
            >
              {currentProduct.category}
            </Link>
          ) : (
            currentProduct.category
          )}
          .
        </p>
      </Reveal>
      <div className="mt-6">
        <ProductGrid products={related} enablePriority={false} />
      </div>
      {categoryConfig ? (
        <p className="mt-8 text-center text-sm text-neutral-600">
          <Link
            href={categoryConfig.href}
            className="font-medium text-gold transition-colors duration-300 hover:text-ink"
          >
            View all {categoryConfig.label} fragrances
          </Link>
        </p>
      ) : null}
    </section>
  );
}
