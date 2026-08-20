import { Suspense } from "react";
import CategoryShortcuts from "@/components/CategoryShortcuts";
import ProductCatalog from "@/components/ProductCatalog";
import { getAllProducts } from "@/lib/products";
import { siteConfig } from "@/lib/siteConfig";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop Original Perfumes, Oud & Attars Online in Pakistan",
  description: `Browse original perfumes, oud & attars from ${siteConfig.name}. Filter by category and sort by price. Cash on Delivery across ${siteConfig.country}, including ${siteConfig.primaryCity}.`,
  path: "/products",
});

// Revalidate periodically so new/updated products in MongoDB Atlas show up
// without needing a full redeploy.
export const revalidate = 60;

export default async function ProductsPage() {
  // Server component — data comes straight from MongoDB Atlas via
  // lib/products.js. Swapping the data source again later only means
  // changing that file's implementation, not this page or its markup.
  const products = await getAllProducts();

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <CategoryShortcuts className="mb-8" />
        <Suspense fallback={<ProductsCatalogFallback />}>
          <ProductCatalog products={products} />
        </Suspense>
      </div>
    </section>
  );
}

function ProductsCatalogFallback() {
  return (
    <div
      className="animate-pulse"
      role="status"
      aria-label="Loading product filters"
    >
      <div className="flex flex-col items-center text-center">
        <div className="h-8 w-64 rounded-full bg-ink/10 sm:h-10 sm:w-80" />
        <div className="mt-4 h-4 w-72 rounded-full bg-ink/10 sm:w-96" />
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-8 w-20 rounded-full bg-ink/10" />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-neutral-500">Loading…</p>
    </div>
  );
}
