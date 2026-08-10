"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { getEffectivePrice, isSaleActive } from "@/lib/pricing";
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

function categoryFromSearchParams(searchParams) {
  const slug = searchParams.get("category");
  if (!slug) return "all";
  return siteConfig.categories.find((c) => c.slug === slug)?.value ?? "all";
}

function saleFromSearchParams(searchParams) {
  const sale = searchParams.get("sale");
  return sale === "1" || sale === "true";
}

function matchesCategory(product, categoryValue) {
  return (
    String(product?.category ?? "").trim() === String(categoryValue).trim()
  );
}

export default function ProductCatalog({ products }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(() =>
    categoryFromSearchParams(searchParams)
  );
  const [onSaleOnly, setOnSaleOnly] = useState(() =>
    saleFromSearchParams(searchParams)
  );
  const [sort, setSort] = useState("default");

  // Keep local filters in sync when the URL changes (header/footer/sale links).
  useEffect(() => {
    const nextCategory = categoryFromSearchParams(searchParams);
    const nextSale = saleFromSearchParams(searchParams);
    setCategory(nextCategory);
    setOnSaleOnly(nextSale);
  }, [searchParams]);

  function updateUrl({ nextCategory = category, nextSale = onSaleOnly }) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextCategory === "all") {
      params.delete("category");
    } else {
      const slug = siteConfig.categories.find(
        (c) => c.value === nextCategory
      )?.slug;
      if (slug) params.set("category", slug);
      else params.delete("category");
    }

    if (nextSale) params.set("sale", "1");
    else params.delete("sale");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function selectCategory(nextCategory) {
    setCategory(nextCategory);
    updateUrl({ nextCategory });
  }

  function toggleOnSale() {
    const nextSale = !onSaleOnly;
    setOnSaleOnly(nextSale);
    updateUrl({ nextSale });
  }

  const visibleProducts = useMemo(() => {
    const source = Array.isArray(products) ? products : [];

    let filtered =
      category === "all"
        ? source
        : source.filter((product) => matchesCategory(product, category));

    if (onSaleOnly) {
      filtered = filtered.filter((product) => isSaleActive(product));
    }

    if (sort === "price-asc") {
      filtered = [...filtered].sort(
        (a, b) => getEffectivePrice(a) - getEffectivePrice(b)
      );
    } else if (sort === "price-desc") {
      filtered = [...filtered].sort(
        (a, b) => getEffectivePrice(b) - getEffectivePrice(a)
      );
    }

    // Temporary diagnostics — remove once the empty-filter bug is confirmed fixed.
    console.log("[ProductCatalog] filter", {
      category,
      onSaleOnly,
      sort,
      sourceCount: source.length,
      resultCount: filtered.length,
      sampleCategories: [...new Set(source.map((p) => p.category))],
    });

    return filtered;
  }, [products, category, onSaleOnly, sort]);

  const activeCategory = siteConfig.categories.find(
    (c) => c.value === category
  );

  const emptyMessage =
    onSaleOnly && category !== "all"
      ? "No sale items in this category right now."
      : onSaleOnly
        ? "No products are on sale right now."
        : category !== "all"
          ? "No products found in this category."
          : "No products found.";

  return (
    <div>
      <Reveal>
        <header className="text-center">
          <h1 className="font-display text-3xl text-ink sm:text-4xl">
            {onSaleOnly && !activeCategory
              ? "On Sale"
              : activeCategory
                ? activeCategory.label
                : "Shop All Fragrances"}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
            {onSaleOnly && !activeCategory
              ? "Limited-time discounts across the collection."
              : activeCategory
                ? activeCategory.description
                : `Original perfumes, oud & attars — curated and delivered across ${siteConfig.country}.`}
          </p>
        </header>
      </Reveal>

      <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Filter by category"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0"
        >
          <button
            type="button"
            onClick={() => selectCategory("all")}
            className={`shrink-0 ${pillClasses(category === "all")}`}
          >
            All
          </button>
          {siteConfig.categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => selectCategory(c.value)}
              className={`shrink-0 ${pillClasses(category === c.value)}`}
            >
              {c.label}
            </button>
          ))}
          <button
            type="button"
            onClick={toggleOnSale}
            aria-pressed={onSaleOnly}
            className={
              onSaleOnly
                ? "shrink-0 rounded-full bg-gold px-4 py-1.5 text-sm font-medium text-espresso shadow-sm transition duration-300 ease-out"
                : "shrink-0 rounded-full border border-gold/50 px-4 py-1.5 text-sm text-gold transition duration-300 ease-out hover:bg-gold/10"
            }
          >
            On Sale
          </button>
        </nav>

        <label className="flex items-center justify-center gap-2 text-sm text-neutral-700 sm:justify-start">
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
        {visibleProducts.length ? (
          <ProductGrid products={visibleProducts} animateOnMount />
        ) : (
          <p className="py-12 text-center text-neutral-500">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
