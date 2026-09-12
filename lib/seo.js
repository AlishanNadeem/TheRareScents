import { getEffectivePrice } from "@/lib/pricing";
import { siteConfig } from "@/lib/siteConfig";

/** Build an absolute URL from a site path or pass through existing absolute URLs. */
export function absoluteUrl(pathOrUrl = "/") {
  if (!pathOrUrl) {
    return siteConfig.url;
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteConfig.url}${path}`;
}

// Shared metadata builder so every page gets consistent Open Graph, Twitter,
// canonical, and Pakistan-targeted locale data without repeating boilerplate.
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  robots,
  openGraphType = "website",
} = {}) {
  const resolvedPath = path.startsWith("/") ? path : `/${path}`;
  const ogImage = image
    ? {
        ...image,
        url: absoluteUrl(image.url),
      }
    : {
        url: absoluteUrl("/og-image.jpg"),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Original Perfumes & Oud in Pakistan`,
      };

  return {
    title,
    description,
    alternates: {
      canonical: resolvedPath,
      languages: {
        "en-PK": resolvedPath,
      },
    },
    openGraph: {
      title,
      description,
      url: resolvedPath,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: openGraphType,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
    ...(robots ? { robots } : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl("/og-image.jpg"),
    description: siteConfig.description,
    email: siteConfig.email,
    // Online-only business — no physical address, just nationwide delivery.
    areaServed: {
      "@type": "Country",
      name: siteConfig.country,
    },
    sameAs: Object.values(siteConfig.social),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${siteConfig.whatsapp.number}`,
      areaServed: "PK",
      availableLanguage: ["en", "ur"],
    },
  };
}

export function breadcrumbJsonLd(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

// CollectionPage + ItemList of product URLs only — does not repeat the
// Product JSON-LD already emitted on each /products/[slug] page.
export function collectionPageJsonLd({
  name,
  description,
  path,
  products = [],
} = {}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  if (products.length) {
    json.mainEntity = {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/products/${product.slug}`),
        name: product.name,
      })),
    };
  }

  return json;
}

export function productJsonLd(product) {
  const productUrl = absoluteUrl(`/products/${product.slug}`);
  const images = (product.images || [])
    .filter(Boolean)
    .map((src) => absoluteUrl(src));

  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description || product.description,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: product.currency || "PKR",
      price: String(getEffectivePrice(product)),
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      areaServed: "PK",
    },
  };

  if (images.length) {
    json.image = images;
  }

  // Only emit sku when the product document has a real merchant-facing SKU.
  // Do not use MongoDB _id — it is an internal identifier, not a SKU.
  if (product.sku) {
    json.sku = String(product.sku);
  }

  if (product.category) {
    json.category = product.category;
  }

  return json;
}
