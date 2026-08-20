import { getAllProductSlugs } from "@/lib/products";
import { siteConfig } from "@/lib/siteConfig";

export default async function sitemap() {
  const staticRoutes = [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...siteConfig.categories.map((category) => ({
      url: `${siteConfig.url}${category.href}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const slugs = await getAllProductSlugs();
  const productRoutes = slugs.map((slug) => ({
    url: `${siteConfig.url}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
