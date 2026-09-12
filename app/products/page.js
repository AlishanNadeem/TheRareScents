import CategoryShortcuts from "@/components/CategoryShortcuts";
import ProductCatalog from "@/components/ProductCatalog";
import {
  categoryFromSearchParams,
  saleFromSearchParams,
} from "@/lib/productCatalogParams";
import { getAllProducts } from "@/lib/products";
import { siteConfig } from "@/lib/siteConfig";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop Original Perfumes, Oud & Attars Online in Pakistan",
  description: `Browse original perfumes, oud & attars from ${siteConfig.name}. Filter by category and sort by price. Cash on Delivery across ${siteConfig.country}, including ${siteConfig.primaryCity}.`,
  path: "/products",
});

// ISR + on-demand revalidateStorefront() from admin keeps stock/price fresh
// without requiring a redeploy. 60s balances sale/stock freshness vs load.
export const revalidate = 60;

export default async function ProductsPage({ searchParams }) {
  // Server component — products are fetched here so the initial HTML includes
  // crawlable product links (not a Suspense "Loading…" shell).
  const products = await getAllProducts();
  const initialCategory = categoryFromSearchParams(searchParams);
  const initialOnSale = saleFromSearchParams(searchParams);

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <CategoryShortcuts className="mb-8" />
        <ProductCatalog
          products={products}
          initialCategory={initialCategory}
          initialOnSale={initialOnSale}
        />
      </div>
    </section>
  );
}
