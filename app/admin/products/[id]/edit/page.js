import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Product",
};

export default async function AdminEditProductPage({ params }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="text-sm text-neutral-500 hover:text-ink"
        >
          ← Back to products
        </Link>
        <h1 className="mt-2 font-display text-2xl text-ink">Edit Product</h1>
        <p className="mt-1 text-sm text-neutral-500">{product.name}</p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
