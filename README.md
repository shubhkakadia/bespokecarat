# Bespoke Carat

Bespoke Carat is a Next.js e-commerce application for lab-grown diamonds and related jewelry products. It includes a public storefront, product search and collection browsing, customer account pages, and an admin product management portal.

## Features

- Public product browsing for collections, product detail pages, and navbar search.
- Product management for six product types: Diamonds, Melee, Color Stones, Cuts, Layouts, and Alphabets.
- Variant-based pricing and product details per product type.
- Media upload and serving for product images and videos.
- Admin and customer authentication with protected dashboard routes.
- MySQL persistence through Sequelize models and associations.
- Redux Toolkit with persisted auth/session state.

## Tech Stack

- Next.js 15 with App Router for frontend pages and Pages Router for API routes.
- React 19.
- MySQL with Sequelize ORM.
- Redux Toolkit and redux-persist.
- Joi validation.
- Multer file uploads.
- Tailwind CSS.

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file with the required variables:

```env
NEXT_APP_DBNAME=database_name
NEXT_APP_USERNAME=db_user
NEXT_APP_PASSWORD=db_password
NEXT_APP_HOST=db_host

NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

NEXTAUTH_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run Next.js lint checks
```

## Product Browsing Access

Product browsing is public. Visitors do not need to log in to:

- View collection pages at `/collections/[type]`.
- View product detail pages at `/products/[id]`.
- Search products from the navbar and open search results.

Customer account pages under `/customer/*` and admin pages under `/admin/*` remain protected.

Public product read APIs:

- `/api/client/product/collection?c=...`
- `/api/client/product/search?q=...`
- `/api/product-id?sku=...`

Admin product management APIs remain protected by admin authentication.

## Project Structure

```text
src/app/                  App Router pages and layouts
src/app/admin/            Admin dashboard and product management UI
src/app/customer/         Customer account pages
src/app/collections/      Public collection pages
src/app/products/         Public product detail pages
src/components/           Shared UI components
src/contexts/             Auth helpers and React auth context
src/pages/api/            Pages Router API endpoints
src/state/                Redux store, reducers, and actions
lib/                      Validators, middleware, auth helpers, utilities
config/dbConfig.js        Sequelize models and associations
uploads/                  Runtime product media uploads
```

## Product Types

- Diamonds: variants include color, clarity, carat weight, and price.
- Melee: sieve sizes include size, price per carat, color range, and clarity range.
- Color Stones: variants include shape, dimension, carat weight, and price.
- Cuts: variants include dimension, carat weight, and price.
- Layouts: diamond details include shape, pieces, carat weight, dimension, color range, and clarity range.
- Alphabets: variants include carat weight and price.

## Authentication

- `master-admin`: full admin access, including admin creation.
- `admin`: product management and operational admin access.
- `customer`: customer dashboard access.
- Public visitors: product browsing and search only.

Protected route helpers live in `src/components/ProtectedRoute.jsx`.

## Media

Product media files are uploaded to `uploads/` and served through:

```text
/api/media/[...path]
```

Stored media links use `/api/media/{filename}` paths.
