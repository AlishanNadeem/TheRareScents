"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Toggle({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50 ${
        checked ? "bg-gold" : "bg-neutral-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function AdminProductsTable({ products: initialProducts }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function patchProduct(id, patch) {
    setError("");
    setBusyId(id);

    const previous = products;
    setProducts((list) =>
      list.map((product) =>
        product._id === id ? { ...product, ...patch } : product
      )
    );

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        setProducts(previous);
        setError(data.error || "Could not update product.");
      } else {
        router.refresh();
      }
    } catch {
      setProducts(previous);
      setError("Could not update product.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Delete “${product.name}”? This cannot be undone.`
    );
    if (!confirmed) return;

    setError("");
    setBusyId(product._id);

    try {
      const response = await fetch(`/api/admin/products/${product._id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        setError(data.error || "Could not delete product.");
        setBusyId(null);
        return;
      }

      setProducts((list) => list.filter((item) => item._id !== product._id));
      router.refresh();
    } catch {
      setError("Could not delete product.");
    } finally {
      setBusyId(null);
    }
  }

  if (!products.length) {
    return (
      <p className="rounded-xl border border-ink/10 bg-white px-4 py-10 text-center text-sm text-neutral-500">
        No products yet.{" "}
        <Link href="/admin/products/new" className="text-ink underline">
          Add your first product
        </Link>
        .
      </p>
    );
  }

  return (
    <div>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-neutral-500">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">In stock</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const thumb = product.images?.[0];
              const busy = busyId === product._id;

              return (
                <tr key={product._id} className="border-b border-ink/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded bg-neutral-100">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                            N/A
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{product.name}</p>
                        <p className="text-xs text-neutral-500">
                          /{product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    Rs {Number(product.price).toLocaleString("en-PK")}
                  </td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={product.in_stock}
                      disabled={busy}
                      label={`Toggle in stock for ${product.name}`}
                      onChange={(value) =>
                        patchProduct(product._id, { in_stock: value })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={product.featured}
                      disabled={busy}
                      label={`Toggle featured for ${product.name}`}
                      onChange={(value) =>
                        patchProduct(product._id, { featured: value })
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="rounded-full border border-ink/15 px-3 py-1 text-xs font-medium text-ink transition hover:bg-ink/5"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleDelete(product)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
