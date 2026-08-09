import { Suspense } from "react";
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
        <Suspense fallback={null}>
          <ProductCatalog products={products} />
        </Suspense>
      </div>
    </section>
  );
}
