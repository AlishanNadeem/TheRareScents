# The Rare Scents — Project Summary

Online perfume store for **The Rare Scents** (Pakistan). Customers buy original perfumes, oud, and attars online with Cash on Delivery nationwide. The live domain in config is `https://therarescents.com`.

The business is **online-only** — no physical store, showroom, or fixed hours. Orders are taken on the website or via WhatsApp.

---

## Stack

- **Next.js 14** (App Router, JavaScript only — no TypeScript)
- **React 18** + **Tailwind CSS** (black / white / gold brand theme)
- **MongoDB Atlas** + **Mongoose**
- **NextAuth.js** (Credentials provider for admin)
- **Framer Motion** (page/UI animation)
- **Recharts** (admin dashboard charts)

---

## Public storefront

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, featured products, brand story, categories, trust strip, testimonials, FAQ, socials |
| `/products` | Catalog with category filters and price sorting |
| `/products/[slug]` | Product detail: gallery, fragrance notes, sale price, order form, related products, WhatsApp |
| `/contact` | Contact details, WhatsApp, and order form |

**Categories:** For Him, For Her, Unisex, Attar/Oud.

**Other storefront pieces:** Independence Day banner, announcement strip, floating WhatsApp button, cookie consent banner, Google Analytics (loads only after cookie consent, never on `/admin`).

Prices are in **PKR**. Delivery cities highlighted in config: Karachi, Lahore, Islamabad, Rawalpindi.

---

## Admin panel (`/admin`)

Protected by NextAuth and `middleware.js`. Sign in at `/admin/login`.

- **Dashboard** — product/order stats, status breakdown, top sellers, 30-day chart
- **Products** — create / edit / delete, stock & featured toggles, image upload, sales
- **Orders** — filter, sort, paginate, update status, Call / WhatsApp shortcuts

**Order statuses:** `NEW` → `CONTACTED` → `CONFIRMED` → `FULFILLED` / `CANCELLED`.

---

## Data models & APIs

**MongoDB models**

- `Product` — name, slug, descriptions, price, images, category, fragrance notes, volume, stock, featured, sale fields
- `Order` — customer name, phone, city, quantity, message, line items snapshot, status
- `AdminUser` — email + bcrypt-hashed password

**API routes**

- `/api/orders` — public order submissions
- `/api/admin/products` and `/api/admin/products/[id]` — product CRUD
- `/api/admin/orders/[id]` — order status updates
- `/api/auth/[...nextauth]` — admin authentication

Seed catalog lives in `data/products.js`. Pages read from MongoDB at runtime (`npm run seed`). Product pages revalidate every 60 seconds; admin edits also revalidate home, catalog, product pages, and the sitemap.

---

## Brand theme

Tailwind tokens in `tailwind.config.js`:

| Token | Hex |
| --- | --- |
| `ink` | `#0A0A0A` |
| `paper` | `#F5F5F0` |
| `gold` | `#C9A24B` |
| `gray` | `#8C8C8C` |
| `espresso` | `#3D2E0A` |

Fonts: **Cormorant Garamond** (headings) and **Jost** (body).

---

## SEO

Central config is `lib/siteConfig.js`. Shared metadata is built in `lib/seo.js` (`buildMetadata`).

### Global (root layout)

- **`metadataBase`:** `https://therarescents.com`
- **Default title:** `The Rare Scents | Buy Original Perfumes Online in Pakistan`
- **Title template:** `%s | The Rare Scents`
- **Meta description** and **keywords** (Pakistan-focused: perfume, oud, attar, Karachi, etc.)
- **`html lang="en-PK"`**
- **Canonical** + **hreflang `en-PK`**
- **Open Graph:** title, description, locale `en_PK`, site name, `/og-image.jpg` (1200×630)
- **Twitter:** `summary_large_image`
- **Robots:** `index, follow` by default
- **Geo tags:** `geo.region = PK`, `geo.placename = Pakistan`
- **Google Search Console** via `GOOGLE_SITE_VERIFICATION`
- **PWA manifest:** `/site.webmanifest`
- **Theme color:** `#0A0A0A`

### Per-page metadata

Every public page uses `buildMetadata()` so title, description, canonical, Open Graph, and Twitter stay consistent:

| Page | Title / description focus |
| --- | --- |
| Home | Buy original perfumes online in Pakistan; delivery from Karachi |
| `/products` | Shop perfumes, oud & attars; COD across Pakistan |
| Product | `{name} — Buy Online in Pakistan` + short description; **product image as OG image** |
| Contact | Order via WhatsApp in Pakistan |
| 404 / missing product | **`noindex, follow`** so they are not indexed |

### Structured data (JSON-LD)

- **Organization** on home and contact: name, logo, email, WhatsApp contact, `areaServed: Pakistan`, Instagram/Facebook `sameAs`
- **Product** on product pages: name, images, SKU, brand, price, currency, InStock/OutOfStock, `areaServed: PK`
- **FAQPage** on home (delivery, COD, authenticity, how to order, delivery time)

### Crawling

**`/robots.txt`** (`app/robots.js`):

- Allow `/`
- Disallow `/admin` and `/api/`
- Points to `https://therarescents.com/sitemap.xml`
- Host set to the site URL

**`/sitemap.xml`** (`app/sitemap.js`) is dynamic from MongoDB:

| URL | Priority | Change frequency |
| --- | --- | --- |
| `/` | 1.0 | weekly |
| `/products` | 0.9 | weekly |
| `/contact` | 0.5 | monthly |
| Each `/products/{slug}` | 0.7 | weekly |

When a product is created, edited, or deleted in admin, the sitemap is revalidated.

Admin pages are also **`noindex, nofollow`** in metadata so they stay out of search even if crawled.

### Analytics (related, not ranking)

GA4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) loads only after cookie consent and never on `/admin`.

---

## Project structure

```text
app/                 # App Router pages + API routes
  admin/             # Password-protected admin panel
  api/               # /api/orders, /api/admin/*, /api/auth/*
  products/          # Catalog + product detail
components/          # UI components (store + admin)
data/products.js     # Seed source (not used at runtime by pages)
lib/                 # DB helpers, SEO, auth, formatting
models/              # Mongoose models (Product, Order, AdminUser)
public/              # Static assets; uploads go in public/uploads (dev only)
scripts/             # seed.js, create-admin.js
```

---

## Useful scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run seed` | Seed products into MongoDB |
| `npm run create-admin` | Create / update an admin user |
