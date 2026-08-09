"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/lib/siteConfig";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function pillClasses(active) {
  return `rounded-full px-4 py-1.5 text-sm transition duration-300 ease-out ${
    active
      ? "bg-ink text-paper shadow-sm"
      : "border border-ink/20 text-ink hover:bg-ink/10"
  }`;
}

export default function ProductCatalog({ products }) {
  const searchParams = useSearchParams();
  const initialCategory = useMemo(() => {
    const slug = searchParams.get("category");
    return siteConfig.categories.find((c) => c.slug === slug)?.value ?? "all";
  }, [searchParams]);

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("default");

  const visibleProducts = useMemo(() => {
    const filtered =
      category === "all"
        ? products
        : products.filter((product) => product.category === category);

    if (sort === "price-asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sort === "price-desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [products, category, sort]);

  const activeCategory = siteConfig.categories.find(
    (c) => c.value === category
  );

  return (
    <div>
      <Reveal>
        <header className="text-center">
          <h1 className="font-display text-3xl text-ink sm:text-4xl">
            {activeCategory ? activeCategory.label : "Shop All Fragrances"}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
            {activeCategory
              ? activeCategory.description
              : `Original perfumes, oud & attars — curated and delivered across ${siteConfig.country}.`}
          </p>
        </header>
      </Reveal>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <nav
          aria-label="Filter by category"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={pillClasses(category === "all")}
          >
            All
          </button>
          {siteConfig.categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.value)}
              className={pillClasses(category === c.value)}
            >
              {c.label}
            </button>
          ))}
        </nav>

        <label className="flex items-center gap-2 text-sm text-neutral-700">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-full border border-ink/20 bg-white px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 text-center text-xs text-neutral-500">
        {visibleProducts.length}{" "}
        {visibleProducts.length === 1 ? "product" : "products"}
      </p>

      <div className="mt-6">
        <ProductGrid products={visibleProducts} />
      </div>
    </div>
  );
}
