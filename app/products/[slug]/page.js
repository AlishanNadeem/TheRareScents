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

// ISR: refresh periodically; admin edits also call revalidateStorefront(slug).
// 60s keeps sale pricing / stock reasonably fresh without aggressive caching.
export const revalidate = 60;

// Allow newly created slugs after build (not only generateStaticParams set).
export const dynamicParams = true;

// Static params come from MongoDB Atlas via lib/products.js — swapping the
// data source again later only means changing that file's implementation.
export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("[products/[slug]] generateStaticParams failed", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);

  // notFound() below renders the not-found.js boundary, but Next.js still
  // resolves metadata from this generateMetadata call for that render — the
  // sibling not-found.js's own metadata export isn't used in that path, so
  // the noindex fallback has to live here instead.
  if (!product) {
    return buildMetadata({
      title: "Fragrance Not Found",
      description: `This fragrance could not be found at ${siteConfig.name}.`,
      path: `/products/${params.slug}`,
      robots: { index: false, follow: true },
    });
  }

  const description =
    product.short_description ||
    product.description ||
    `Shop ${product.name} online in ${siteConfig.country} from ${siteConfig.name}.`;

  const metaDescription =
    `${description} Buy ${product.name} online in ${siteConfig.country} — delivered from ${siteConfig.primaryCity} with Cash on Delivery.`.slice(
      0,
      160
    );

  return buildMetadata({
    title: `${product.name} — Buy Online in Pakistan`,
    description: metaDescription,
    path: `/products/${product.slug}`,
    image: product.images?.[0]
      ? {
          url: product.images[0],
          width: 1200,
          height: 1600,
          alt: `${product.name} by ${siteConfig.name}`,
        }
      : undefined,
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

        {/* SEO-critical product content is not wrapped in Reveal (opacity:0)
            so crawlers and users see name, price, and description immediately. */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <ProductGallery
            images={product.images}
            productName={product.name}
            saleBadge={saleBadge}
          />

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

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-neutral-700 sm:grid-cols-3">
              {product.category ? (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-neutral-500">
                    Category
                  </dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {product.category}
                  </dd>
                </div>
              ) : null}
              {product.volume_ml ? (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-neutral-500">
                    Size
                  </dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {product.volume_ml}ml
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-500">
                  Availability
                </dt>
                <dd className="mt-0.5 font-medium">
                  {product.in_stock ? (
                    <span className="text-gold">In Stock</span>
                  ) : (
                    <span className="text-red-500">Sold Out</span>
                  )}
                </dd>
              </div>
            </dl>

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
        </div>

        <Reveal className="mx-auto mt-12 max-w-md" delay={0.1}>
          <OrderForm product={product} />
        </Reveal>

        <RelatedProducts currentProduct={product} />
      </div>
    </article>
  );
}
