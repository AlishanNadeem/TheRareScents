import { getProductsForSitemap } from "@/lib/products";
import { siteConfig } from "@/lib/siteConfig";

export default async function sitemap() {
  // Omit lastModified on static routes rather than inventing timestamps.
  const staticRoutes = [
    {
      url: `${siteConfig.url}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/products`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...siteConfig.categories.map((category) => ({
      url: `${siteConfig.url}${category.href}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    {
      url: `${siteConfig.url}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let productRoutes = [];

  try {
    const products = await getProductsForSitemap();
    productRoutes = products.map((product) => {
      const entry = {
        url: `${siteConfig.url}/products/${product.slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
      };

      if (
        product.updated_at instanceof Date &&
        !Number.isNaN(product.updated_at)
      ) {
        entry.lastModified = product.updated_at;
      }

      return entry;
    });
  } catch (error) {
    // Prefer a partial sitemap (static routes) over a 500 that blocks crawling.
    console.error("[sitemap] failed to load product URLs", error);
  }

  return [...staticRoutes, ...productRoutes];
}
