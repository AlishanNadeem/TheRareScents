import Link from "next/link";
import AdminProductsTable from "@/components/admin/AdminProductsTable";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Products</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {products.length} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:opacity-90"
        >
          Add Product
        </Link>
      </div>

      <div className="mt-6">
        <AdminProductsTable products={products} />
      </div>
    </div>
  );
}
