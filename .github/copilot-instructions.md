# FireShop — AI Coding Agent Guide

Use this as your source-of-truth for how to work productively in this repo. Keep advice concrete and codebase-specific.

## Architecture & Boundaries
- Next.js 16 App Router with server components by default. Client interactivity uses `"use client"` at the top of components (e.g., [components/Navbar.tsx](../components/Navbar.tsx)).
- Feature-first domain layering under [lib/features](../lib/features):
  - `domain/` → models and repository interfaces (e.g., [ProductModel](../lib/features/product/domain/models/ProductModel.ts), [IProductRepo](../lib/features/product/domain/repos/IProductRepo.ts)).
  - `data/` → concrete data sources and repos (e.g., [FirestoreProductsDs](../lib/features/product/data/sources/FirestoreProductsDs.ts), [ProductRepo](../lib/features/product/data/repos/ProductRepo.ts)).
  - Repos prefer Firestore and gracefully fallback to static data in dev ([StaticProductsDs](../lib/features/product/data/sources/StaticProductsDs.ts)).
- Firebase is initialized centrally in [lib/firebase.ts](../lib/firebase.ts) from typed config in [lib/config.ts](../lib/config.ts) which validates required `NEXT_PUBLIC_*` envs at startup.
- Auth lives in [lib/auth-context.tsx](../lib/auth-context.tsx). Admin detection checks the Firestore `admins/{email}` doc. Inventory pages and writes assume published rules; see [docs/firebase-rules-quick-setup.md](../docs/firebase-rules-quick-setup.md).

## Data Flow: Products
- Read path (home): [app/page.tsx](../app/page.tsx) calls `ProductRepo.getProducts()` → tries Firestore via [FirestoreProductsDs](../lib/features/product/data/sources/FirestoreProductsDs.ts), falls back to [StaticProductsDs](../lib/features/product/data/sources/StaticProductsDs.ts).
- Admin CRUD (inventory): [app/inventory/page.tsx](../app/inventory/page.tsx) uses `FirestoreProductsDs` directly and requires admin (from `AuthProvider`).
- Images: upload/delete via [ProductStorage.ts](../lib/features/product/data/sources/ProductStorage.ts). Client-side validation/compression in [imageUtils.ts](../lib/utils/imageUtils.ts) with 4:3 aspect ratio and JPEG compression before Storage upload.

## State & UI Conventions
- Client state uses Zustand with `persist` (e.g., cart in [lib/features/cart/store.ts](../lib/features/cart/store.ts), checkout info in [lib/features/checkout/customer-info-store.ts](../lib/features/checkout/customer-info-store.ts)). Keep store shapes minimal, derive totals via helpers.
- UI primitives come from shadcn/radix wrappers in [components/ui](../components/ui). Compose using `mergeClasses()` from [lib/utils.ts](../lib/utils.ts). Prefer existing `Button`, `Card`, `Input` patterns.
- Pricing rule: `price = originalPrice * (1 - discountPercent/100)`. See [components/inventory/ProductForm.tsx](../components/inventory/ProductForm.tsx) for the canonical calculation/validation.

## Environment, Builds, and Running
- `.env` (production client config) is committed by design; override locally with `.env.local` when needed. Details in [docs/environment-setup.md](../docs/environment-setup.md) and [README.md](../README.md).
- Key scripts (see [package.json](../package.json)):
  - `npm run dev` — dev server
  - `npm run dev:staging` — copies `.env.staging` to `.env.local` then dev
  - `npm run build` / `npm run build:staging`
  - `npm run start` — run built app
  - `npm run lint` — ESLint (Next core-web-vitals config)

## Firebase Integration Expectations
- Firestore collections: `products` (public read, admin write), `admins` (read for authed only; writes manual). Storage path: `products/{productId}/*`. Publish the rules in [docs/*rules*](../docs/firebase-rules-quick-setup.md).
- Admin detection relies on a document at `admins/{email}`. `Navbar` shows Inventory only when `isAdmin=true` and hides entirely on preview routes (see pathname check in [components/Navbar.tsx](../components/Navbar.tsx)).

## Patterns to Follow
- New domain features should mirror `product`:
  - Define `domain/models/*` and `domain/repos/*` first.
  - Implement `data/sources/*` (Firestore + optional static fallback) and a `data/repos/*` that orchestrates.
  - Use Zustand `persist` for client-only state; avoid server usage.
- For client pages/components add `"use client"` and avoid server-only imports. Server components should perform data fetching where possible (see [app/page.tsx](../app/page.tsx)).
- Images: validate aspect ratio and compress before upload; reuse helpers from [imageUtils.ts](../lib/utils/imageUtils.ts) and APIs in [ProductStorage.ts](../lib/features/product/data/sources/ProductStorage.ts).

## Quick References
- App shell and auth provider mount: [app/layout.tsx](../app/layout.tsx)
- Home listing (server component): [app/page.tsx](../app/page.tsx)
- Product preview (client carousel): [app/product/[id]/preview/page.tsx](../app/product/[id]/preview/page.tsx)
- Inventory admin UI: [app/inventory/page.tsx](../app/inventory/page.tsx)
- Cart store: [lib/features/cart/store.ts](../lib/features/cart/store.ts)

## Gotchas
- Missing envs throw during startup via [lib/config.ts](../lib/config.ts).
- Firestore/Storage writes require published rules and admin email doc; otherwise CRUD and uploads will fail with permission errors.
- `Navbar` is hidden on `*/preview` routes by design.

Keep this file concise and codebase-aligned; update when workflows or patterns change.
