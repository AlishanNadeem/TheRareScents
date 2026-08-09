// Central brand/site configuration. Update these placeholder values
// (domain, WhatsApp number, socials) with real details when available —
// every page and metadata block pulls from here so changes only need to
// happen in one place.

export const siteConfig = {
  name: "The Rare Scents",
  shortName: "Rare Scents",
  url: "https://www.therarescents.com",
  locale: "en_PK",
  country: "Pakistan",
  currency: "PKR",
  primaryCity: "Karachi",
  cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi"],
  tagline:
    "Welcome to The Rare Scents. We curate unique perfumes from rare oils to exclusive blends, designed to delight and inspire.",
  description:
    "Buy original perfumes, oud & attars online in Pakistan. The Rare Scents curates rare oils and exclusive blends, delivered nationwide with Cash on Delivery.",
  keywords: [
    "perfume Pakistan",
    "buy perfume online Pakistan",
    "oud Pakistan",
    "attar Pakistan",
    "original perfumes Karachi",
    "The Rare Scents",
  ],
  email: "hello@therarescents.com",
  whatsapp: {
    display: "+92 310 3477177",
    number: "923103477177",
    link: "https://wa.me/923103477177",
  },
  // Online-only business — no physical store, showroom, or fixed hours.
  // Orders are taken online and via WhatsApp any time.
  social: {
    instagram: "https://instagram.com/therarescents",
    facebook: "https://facebook.com/therarescents",
  },
  categories: [
    {
      label: "For Him",
      value: "For Him",
      slug: "for-him",
      description: "Bold, woody, and spiced fragrances for the modern man.",
      image: "/categories/for-him.jpg",
    },
    {
      label: "For Her",
      value: "For Her",
      slug: "for-her",
      description: "Delicate florals and soft gourmands for every mood.",
      image: "/categories/for-her.jpg",
    },
    {
      label: "Unisex",
      value: "Unisex",
      slug: "unisex",
      description: "Versatile blends designed to be shared, not gendered.",
      image: "/categories/unisex.jpg",
    },
    {
      label: "Attar/Oud",
      value: "Attar/Oud",
      slug: "attar-oud",
      description: "Traditional, alcohol-free attars and rich, aged oud.",
      image: "/categories/attar-oud.jpg",
    },
  ],
};
