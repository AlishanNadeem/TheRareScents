import { getEffectivePrice } from "@/lib/pricing";
import { siteConfig } from "@/lib/siteConfig";

// Shared metadata builder so every page gets consistent Open Graph, Twitter,
// canonical, and Pakistan-targeted locale data without repeating boilerplate.
export function buildMetadata({ title, description, path = "/", image } = {}) {
  const ogImage = image || {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} — Original Perfumes & Oud in Pakistan`,
  };

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        "en-PK": path,
      },
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}/og-image.jpg`,
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
      item: `${siteConfig.url}${item.path}`,
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
    url: `${siteConfig.url}${path}`,
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
        url: `${siteConfig.url}/products/${product.slug}`,
        name: product.name,
      })),
    };
  }

  return json;
}

export function productJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description,
    image: product.images.map((src) => `${siteConfig.url}${src}`),
    sku: product._id,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: product.currency,
      price: getEffectivePrice(product),
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      areaServed: "PK",
    },
  };
}
