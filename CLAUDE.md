# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bespoke Carat is a Next.js e-commerce application for lab-grown diamonds, featuring a comprehensive product management system with six distinct product types: Diamonds, Melee, Color Stones, By Cut, Layouts, and Alphabets. The application uses MySQL with Sequelize ORM, Redux for state management, and includes both admin and customer portals.

## Development Commands

```bash
# Development server (runs with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Development server runs on `http://localhost:3000`

## Architecture Overview

### Database & Models

- **ORM**: Sequelize with MySQL
- **Configuration**: `config/dbConfig.js` - centralizes all model definitions and associations
- **Product Types**: Each has a main model and variants table:
  - Diamonds → DiamondVariants (color, clarity, carat_weight, price)
  - Melee → SieveSize (size, price_per_carat, color_range, clarity_range)
  - ColorStone → ColorStoneVariants (shape, dimension, carat_weight, price)
  - Cuts → CutVariants (dimension, carat_weight, price)
  - Layout → DiamondDetails (shape, pcs, carat_weight, dimension, color/clarity ranges)
  - Alphabets → AlphabetVariants (carat_weight, price)
- **Media**: Shared `medias` table linked to all product types via `product_slug` (polymorphic association)
- **Users**: `admin`, `customers`, and `sessions` tables
- **Slug Generation**: Products use auto-generated slugs (e.g., `DIA-A1B2C3D`) via `lib/getUniqueId.js`

### API Routes (Pages Router)

All API routes are in `src/pages/api/`:

- **Authentication**: `signin.js`, `signup.js`, `logout.js`, `admin/create-admin.js`
- **Product Management** (Admin):
  - Add: `/admin/product/{type}/add-{type}.js`
  - Edit: `/admin/product/{type}/edit-{type}.js`
  - Delete: `/admin/product/delete-product.js`
  - Media: `/admin/product/media-delete.js`
- **Client APIs**:
  - `/client/homepage.js` - homepage data
  - `/client/product/collection.js` - product collections
  - `/client/product/search.js` - search functionality
- **Media Serving**: `/media/[...path].js` - serves uploaded files from `uploads/`
- **Enquiry**: `/enquiry/upload-images.js`, `/enquiry/[filename].js`

### Validation & Middleware

- **Validators**: All in `lib/validators/` using Joi schemas
  - Product validators: `diamondValidator.js`, `meleeValidator.js`, etc.
  - Auth validators: `signInValidator.js`, `signUpValidator.js`, `createAdminValidator.js`
- **File Upload Middleware**: `lib/middlewares/fileUpload.js` (uses Multer)
- **Cleanup**: `lib/middlewares/cleanupUploadedFiles.js` - removes files on transaction rollback
- **Auth Helpers**: `lib/authFromToken.js` - provides `isAdmin()`, `isCustomer()`, etc.

### Frontend Structure (App Router)

- **Layout**: `src/app/layout.js` wraps everything with Redux Provider, PersistGate, and AuthProvider
- **Admin Portal**: `/admin/*`
  - Dashboard, Products, Orders, Users, Enquiry, Settings
  - Shared Sidebar: `src/app/admin/components/sidebar.jsx`
  - Add Product: Multi-tab form at `/admin/products/addproduct/page.jsx`
  - Product components: `AddDiamond.jsx`, `AddMelee.jsx`, etc.
- **Customer Portal**: `/customer/*`
  - Profile, Orders, Wishlist, Settings
- **Public Pages**:
  - Homepage: `src/app/page.jsx`
  - Collections: `/collections/[type]/page.jsx`
  - Product Detail: `/products/[id]/page.jsx`
  - Diamond Journal: `/diamondjournal/*` (blog pages)
  - About Us, Contact Us, Login, Signup

### State Management

- **Redux**: Redux Toolkit with `redux-persist` for session persistence
- **Store**: `src/state/store/index.js`
- **User State**: `src/state/reducer/loggedInUser.js` with actions in `src/state/action/loggedInUser.js`
- **Auth Context**: `src/contexts/AuthContext.jsx` - wraps Redux user state with hooks
  - Provides: `isAuthenticated`, `login()`, `logout()`, `isAdmin()`, `isCustomer()`, `isMasterAdmin()`, `getUserType()`, `getToken()`
- **Protected Routes**: `src/components/ProtectedRoute.jsx`
  - Exports: `ProtectedRoute`, `AdminRoute`, `CustomerRoute`, `MasterAdminRoute`
  - AdminRoute allows both "admin" and "master-admin" user types
  - CustomerRoute allows "admin", "master-admin", and "customer" types

### Product Variants System

Each product type has a unique variant structure:

1. **API Request Flow**:
   - Frontend sends `FormData` with `{type}_variants` as JSON string
   - API parses JSON string → validates with Joi → uses transaction
   - Creates main product record, then bulk creates variants
   - Uploads media files and links via `product_slug`

2. **Validation Pattern**:
   - All validators check for parsed variants array
   - Minimum 1 variant required for most product types
   - Price fields validated as numbers (frontend strips formatting before submit)

3. **Frontend Form Pattern** (see `addproduct/page.jsx`):
   - Tab-based UI for switching product types
   - Each tab has dedicated component (`AddDiamond.jsx`, etc.)
   - Variant state: array of objects with unique IDs
   - Add/remove variant buttons
   - Form reset on tab change
   - Client-side validation before submit

### Media Management

- **Upload Directory**: `uploads/` (not in git)
- **Serving**: `/api/media/[...path].js` catches all media requests
- **Image Domains**: Configured in `next.config.mjs` (localhost:3000, bespokecarat.com, 4cs.gia.edu)
- **File Types**: Images and videos supported
- **Enquiry Photos**: Saved to `public/enquiry/` with UUID names, sent via EmailJS

### Authentication Flow

1. User logs in via `/api/signin` → receives token in cookie
2. `AuthContext` dispatches `restoreSession()` on app load
3. Redux persists user data across page refreshes
4. Protected routes check `isAuthenticated` and `user_type`
5. Token stored in cookies (accessed via `getAuthToken()` from `contexts/auth.js`)
6. Server validates token using `isAdmin()` or `isCustomer()` from `lib/authFromToken.js`

### Key Constants

- **Product Options**: Defined in `src/components/constants/order.jsx`
  - `shapeOptions`, `colorOptions`, `clarityOptions`, `colorRanges`, `clarityRanges`
  - `layoutTypeOptions`, `cutTypeOptions`, `sieveSizeOptions`
- **Diamond Fields**: `src/diamondfields.json` - reference data

## Common Patterns

### Adding a New Product (Admin)

1. Navigate to `/admin/products/addproduct`
2. Select product type tab (Diamond, Melee, etc.)
3. Fill basic info (name, shape, SKU, etc.)
4. Add variants with pricing
5. Upload images/videos (drag-and-drop supported)
6. Form validates → sends to `/api/admin/product/{type}/add-{type}`
7. Server validates → creates transaction → saves product + variants + media
8. On success: form resets, toast confirmation

### Editing Products

1. Admin views product list at `/admin/products`
2. Clicks product → navigates to `/admin/products/[id]`
3. Edit form pre-fills with existing data
4. Submit sends to `/api/admin/product/{type}/edit-{type}`
5. Updates use transactions to maintain data consistency

### Transaction Safety

All product create/update operations use Sequelize transactions:
- Begin transaction with `db.sequelize.transaction()`
- Create/update main record
- Bulk create/update variants
- Upload and link media files
- Commit on success OR rollback on error
- `cleanupUploadedFiles()` removes files on rollback

## Environment Variables

Required variables (see `EMAILJS_SETUP.md` for email setup):

```env
# Database
NEXT_APP_DBNAME=database_name
NEXT_APP_USERNAME=db_user
NEXT_APP_PASSWORD=db_password
NEXT_APP_HOST=db_host

# EmailJS (Contact Form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Application
NEXTAUTH_URL=https://bespokecarat.com
```

## Important Notes

### API Response Pattern

All API routes return status 200 with `{ status: true/false, message: "", errors?: [] }` structure for consistent frontend handling.

### File Upload Considerations

- Next.js API routes need `export const config = { api: { bodyParser: false } }` for Multer
- File size limit: 50MB (set in `next.config.mjs`)
- Always use `cleanupUploadedFiles()` in catch blocks to prevent orphaned files
- Media paths stored as `/api/media/{filename}` not absolute file paths

### Price Formatting

- Frontend displays prices with commas (e.g., "1,234.56")
- `formatPrice()` adds formatting for display only
- `stripPriceFormatting()` removes commas before API submission
- API expects numeric values, validates with Joi

### User Type Hierarchy

- `master-admin`: Full access (can create admins)
- `admin`: Product management, order handling, view users
- `customer`: View products, place orders, manage profile

### Slug Usage

Products are accessed by `slug` (not numeric ID) in:
- Media associations (polymorphic via `product_slug`)
- Public product pages (`/products/[id]` where `[id]` is slug)
- Client APIs for product details
