import { revalidatePath } from "next/cache";
import { siteConfig } from "@/lib/siteConfig";

// Bust the cache for every public surface that may show a product so the
// storefront reflects admin create/edit/delete/toggle changes immediately.
export function revalidateStorefront(slug) {
  revalidatePath("/");
  revalidatePath("/products");
  siteConfig.categories.forEach((category) => {
    revalidatePath(category.href);
  });
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  if (slug) {
    revalidatePath(`/products/${slug}`);
  }
}
