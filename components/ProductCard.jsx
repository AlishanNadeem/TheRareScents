import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import {
  getEffectivePrice,
  getSaleBadgeLabel,
  isSaleActive,
} from "@/lib/pricing";
import { siteConfig } from "@/lib/siteConfig";

export default function ProductCard({ product, priority = false }) {
  const saleActive = isSaleActive(product);
  const saleBadge = getSaleBadgeLabel(product);
  const effectivePrice = getEffectivePrice(product);

  return (
    <article className="group overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition duration-300 ease-out hover:shadow-lg sm:hover:scale-105 motion-reduce:sm:hover:scale-100">
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
          <Image
            src={product.images[0]}
            alt={`${product.name} perfume bottle by ${siteConfig.name} — original fragrance in Pakistan`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-300 ease-out group-hover:scale-110 motion-reduce:group-hover:scale-100"
          />
          {saleBadge && (
            <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-espresso shadow-sm">
              {saleBadge}
            </span>
          )}
          {!product.in_stock && (
            <span
              className={`absolute rounded-full bg-ink/85 px-2 py-1 text-xs font-medium text-paper ${
                saleBadge ? "right-2 top-2" : "left-2 top-2"
              }`}
            >
              Sold Out
            </span>
          )}
        </div>
        <div className="space-y-1 p-4">
          <p className="text-xs uppercase tracking-wide text-gold/80">
            {product.category}
          </p>
          <h3 className="text-base font-semibold text-neutral-900">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm text-neutral-600">
            {product.short_description}
          </p>
          <p className="pt-1 text-sm font-medium text-ink">
            {saleActive ? (
              <>
                <span className="mr-2 text-neutral-400 line-through">
                  {formatPrice(product.price, product.currency)}
                </span>
                <span className="font-semibold text-gold">
                  {formatPrice(effectivePrice, product.currency)}
                </span>
              </>
            ) : (
              formatPrice(product.price, product.currency)
            )}{" "}
            &middot; {product.volume_ml}ml
          </p>
        </div>
      </Link>
    </article>
  );
}
