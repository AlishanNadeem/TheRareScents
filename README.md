# The Rare Scents

Online perfume storefront for **The Rare Scents** (Pakistan) — Next.js 14 App Router, plain JavaScript, Tailwind CSS, MongoDB Atlas, and a password-protected admin panel.

## Stack

- **Next.js 14** (App Router, JavaScript only — no TypeScript)
- **Tailwind CSS** (black / white / gold brand theme)
- **MongoDB Atlas** + **Mongoose**
- **NextAuth.js** (Credentials provider for admin)
- **recharts** (admin dashboard charts)

## Prerequisites

- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- npm

## Setup

### 1. Install dependencies

```bash
cd rare-scents
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in real values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable          | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `MONGODB_URI`     | MongoDB Atlas connection string              |
| `NEXTAUTH_SECRET` | Random secret for signing admin session JWTs |
| `NEXTAUTH_URL`    | App URL (`http://localhost:3000` in dev)     |

Optional:

| Variable                        | Purpose                                             |
| ------------------------------- | --------------------------------------------------- |
| `GOOGLE_SITE_VERIFICATION`      | Google Search Console HTML-tag verification content |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 ID (`G-XXXXXXXXXX`)              |

Generate a NextAuth secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`.env.local` is gitignored — never commit real secrets.

### 3. MongoDB Atlas connection

1. Create a free **M0** cluster in Atlas.
2. Under **Database Access**, create a database user with a strong password.
3. Under **Network Access**, allow your current IP (or `0.0.0.0/0` for local/dev only).
4. Click **Database → Connect → Drivers**, copy the connection string, and set it as `MONGODB_URI` in `.env.local`.

Example shape:

```text
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/rare-scents?retryWrites=true&w=majority
```

Replace `<password>` (URL-encode special characters) and prefer a database name such as `rare-scents`.

### 4. Seed products

Loads the mock catalog from `data/products.js` into MongoDB (clears existing products first):

```bash
npm run seed
```

### 5. Create an admin user

Interactive:

```bash
npm run create-admin
```

Or non-interactive:

```bash
npm run create-admin -- --email you@example.com --password 'your-password'
```

Password is hashed with bcrypt before insert. Re-running with the same email updates the password.

### 6. Run the app

```bash
npm run dev
```

- Storefront: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Production build:

```bash
npm run build
npm start
```

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

## Admin panel

After signing in at `/admin/login`:

- **Dashboard** — product/order stats, status breakdown, top sellers, 30-day chart
- **Products** — create / edit / delete, stock & featured toggles, image upload
- **Orders** — filter, sort, paginate, update status, Call / WhatsApp shortcuts

Admin routes are protected by `middleware.js` + NextAuth. `/admin` and `/api/` are disallowed in `robots.txt`.

## Image uploads

Admin product images are saved under `public/uploads` for local development.

> Before production, move uploads to a cloud service such as **Cloudinary** or **S3**. Files in `/public/uploads` do not persist on most serverless hosts across deploys.

## Useful scripts

| Command                | Description                   |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Start local dev server        |
| `npm run build`        | Production build              |
| `npm start`            | Serve production build        |
| `npm run lint`         | ESLint                        |
| `npm run seed`         | Seed products into MongoDB    |
| `npm run create-admin` | Create / update an admin user |

## SEO

- Unique title + meta description per public page (Pakistan-targeted)
- `og:locale = en_PK`, `hreflang` / `en-PK`, geo meta tags
- Dynamic `sitemap.xml` (includes product slugs from MongoDB)
- `robots.txt` pointing at the sitemap
- Organization + Product JSON-LD

## Brand theme

Tailwind tokens in `tailwind.config.js`:

- `ink` `#0A0A0A`
- `paper` `#F5F5F0`
- `gold` `#C9A24B`
- `gray` `#8C8C8C`
- `espresso` `#3D2E0A` (text on gold)
