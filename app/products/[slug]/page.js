import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGallery from "@/components/ProductGallery";
import NotesPyramid, { hasFragranceNotes } from "@/components/NotesPyramid";
import OrderForm from "@/components/OrderForm";
import RelatedProducts from "@/components/RelatedProducts";
import { Reveal } from "@/components/Reveal";
import { formatPrice } from "@/lib/formatPrice";
import {
  getEffectivePrice,
  getSaleBadgeLabel,
  isSaleActive,
} from "@/lib/pricing";
import { getAllProductSlugs, getProductBySlug } from "@/lib/products";
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from "@/lib/seo";
import { getCategoryConfig, siteConfig } from "@/lib/siteConfig";

// Revalidate periodically so new/updated products in MongoDB Atlas show up
// without needing a full redeploy.
export const revalidate = 60;

// Static params come from MongoDB Atlas via lib/products.js — swapping the
// data source again later only means changing that file's implementation.
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);

  // notFound() below renders the not-found.js boundary, but Next.js still
  // resolves metadata from this generateMetadata call for that render — the
  // sibling not-found.js's own metadata export isn't used in that path, so
  // the noindex fallback has to live here instead.
  // Override the root layout's default "index, follow" so this segment
  // doesn't send conflicting robots signals alongside the "noindex" tag
  // Next.js automatically injects whenever notFound() fires during render.
  if (!product) {
    return {
      ...buildMetadata({
        title: "Fragrance Not Found",
        description: `This fragrance could not be found at ${siteConfig.name}.`,
        path: `/products/${params.slug}`,
      }),
      robots: { index: false, follow: true },
    };
  }

  return buildMetadata({
    title: `${product.name} — Buy Online in Pakistan`,
    description: `${product.short_description} Shop ${product.name} online in ${siteConfig.country} — delivered from ${siteConfig.primaryCity} nationwide with Cash on Delivery.`,
    path: `/products/${product.slug}`,
    image: {
      url: product.images[0],
      width: 1200,
      height: 1600,
      alt: `${product.name} perfume by ${siteConfig.name}`,
    },
  });
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const saleActive = isSaleActive(product);
  const effectivePrice = getEffectivePrice(product);
  const saleBadge = getSaleBadgeLabel(product);
  const categoryConfig = getCategoryConfig(product.category);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    categoryConfig
      ? { label: categoryConfig.label, path: categoryConfig.href }
      : { label: "Shop", path: "/products" },
    { label: product.name, path: `/products/${product.slug}` },
  ];

  const whatsappMessage = `Hi, I'm interested in ${product.name} - ${formatPrice(
    effectivePrice,
    product.currency
  )}`;
  const whatsappHref = `${siteConfig.whatsapp.link}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <article className="bg-paper">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              breadcrumbItems.map((item) => ({
                name: item.label,
                path: item.path,
              }))
            )
          ),
        }}
      />

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <Reveal>
            <ProductGallery
              images={product.images}
              productName={product.name}
              saleBadge={saleBadge}
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              {categoryConfig ? (
                <Link
                  href={categoryConfig.href}
                  className="text-xs uppercase tracking-wide text-gold transition-colors duration-300 hover:text-ink"
                >
                  {product.category}
                </Link>
              ) : (
                <p className="text-xs uppercase tracking-wide text-gold">
                  {product.category}
                </p>
              )}
              <h1 className="mt-1 font-display text-3xl text-ink">
                {product.name}
              </h1>
              <p className="mt-2 text-sm italic text-neutral-600">
                {product.short_description}
              </p>

              <p className="mt-3 text-xl font-semibold text-neutral-900">
                {saleActive ? (
                  <>
                    <span className="mr-2 text-base font-normal text-neutral-400 line-through">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <span className="text-gold">
                      {formatPrice(effectivePrice, product.currency)}
                    </span>
                  </>
                ) : (
                  formatPrice(product.price, product.currency)
                )}{" "}
                <span className="text-sm font-normal text-neutral-500">
                  / {product.volume_ml}ml
                </span>
              </p>

              <p className="mt-4 leading-relaxed text-neutral-700">
                {product.description}
              </p>

              <p className="mt-4 text-sm font-medium">
                {product.in_stock ? (
                  <span className="text-gold">In Stock</span>
                ) : (
                  <span className="text-red-500">Sold Out</span>
                )}
              </p>

              {hasFragranceNotes(product.notes) && (
                <div className="mt-8 rounded-xl bg-ink/5 p-6">
                  <NotesPyramid notes={product.notes} />
                </div>
              )}

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-espresso shadow-sm transition duration-300 ease-out hover:scale-[1.03] hover:bg-[#d4af5a] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:w-auto"
              >
                Order via WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-12 max-w-md" delay={0.1}>
          <OrderForm product={product} />
        </Reveal>

        <RelatedProducts currentProduct={product} />
      </div>
    </article>
  );
}
