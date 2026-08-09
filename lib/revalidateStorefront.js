import { revalidatePath } from "next/cache";

// Bust the cache for every public surface that may show a product so the
// storefront reflects admin create/edit/delete/toggle changes immediately.
export function revalidateStorefront(slug) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  if (slug) {
    revalidatePath(`/products/${slug}`);
  }
}
