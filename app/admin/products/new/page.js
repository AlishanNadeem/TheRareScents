import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = {
  title: "Add Product",
};

export default function AdminNewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="text-sm text-neutral-500 hover:text-ink"
        >
          ← Back to products
        </Link>
        <h1 className="mt-2 font-display text-2xl text-ink">Add Product</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Create a new fragrance for the storefront.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
