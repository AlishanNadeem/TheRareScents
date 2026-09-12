import { siteConfig } from "@/lib/siteConfig";

export function categoryFromSearchParams(searchParams = {}) {
  const raw = searchParams?.category;
  const slug = Array.isArray(raw) ? raw[0] : raw;
  if (!slug) return "all";
  return siteConfig.categories.find((c) => c.slug === slug)?.value ?? "all";
}

export function saleFromSearchParams(searchParams = {}) {
  const raw = searchParams?.sale;
  const sale = Array.isArray(raw) ? raw[0] : raw;
  return sale === "1" || sale === "true";
}
