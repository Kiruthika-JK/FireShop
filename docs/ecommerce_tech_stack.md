# FireShop - E-commerce Web Application

## Project Overview
Build a minimal e-commerce web application with focus on SEO, product listing, and shopping cart functionality.

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
  - Server-side rendering for SEO optimization
  - Static generation for product pages
  - Automatic image optimization
  - Built-in SEO features (metadata API)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (for cart state)
- **TypeScript**: For type safety

### Backend
- **Database**: Firebase Firestore
  - NoSQL document database
  - Real-time capabilities
  - Easy scalability
- **Storage**: Firebase Storage
  - For product images
  - CDN integration
- **Local Cache**: Firebase for full project but let's start with localStorage for MVP

### Deployment
- **Hosting**: Vercel
  - Optimized for Next.js
  - Automatic HTTPS
  - Edge network for fast delivery

### Development Tools
- **Package Manager**: npm or pnpm
- **Version Control**: Git + GitHub
- **Code Quality**: ESLint + Prettier
- **TypeScript**: Strongly recommended

## Core Features (MVP)

### 1. Products List Page
- SEO optimized:
  - Server-side rendering
  - Proper meta tags
  - Structured data (JSON-LD)
  - Semantic HTML
  - Alt tags for images

### 2. Product Detail Page
- Full product information:
  - Multiple images / Videos
  - Price
- Quantity selector
- SEO optimized:
  - Dynamic meta tags per product
  - Open Graph tags
  - Schema.org markup for products
  - Canonical URLs

### 3. Shopping Cart
- View cart items

## SEO Optimization Strategy

### 1. Next.js Metadata API
```typescript
// app/products/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  
  return {
    title: `${product.name} | Your Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}
```

### 3. Static Site Generation
- Use `generateStaticParams()` for product pages
- Pre-render all product pages at build time
- Instant page loads
- Better crawlability

### 4. Image Optimization
- Next.js Image component
- WebP format with fallbacks
- Lazy loading
- Proper alt attributes

### 5. Performance
- Server components by default
- Minimal JavaScript
- Code splitting
- Prefetching

## Project Structure

```
my-ecommerce/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (home/products list)
│   ├── productlist/
│   │   └── [slug]/
│   │       └── page.tsx (product detail)
│   ├── cart/
│   │   └── page.tsx (cart page)
│   └── api/ (optional API routes)
├── components/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── CartItem.tsx
│   ├── Header.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── firebase.ts (Firebase config)
│   ├── firestore.ts (Firestore helpers)
│   └── store.ts (Zustand store)
├── types/
│   └── index.ts
└── public/
    └── images/
```

## Setup Instructions

### 1. Initialize Next.js Project
```bash
npx create-next-app@latest my-ecommerce --typescript --tailwind --app
cd my-ecommerce
```

### 2. Install Dependencies
```bash
npm install firebase
npm install zustand
npm install lucide-react # for icons
```

### 3. Install shadcn/ui
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input badge
```

### 4. Firebase Setup
1. Create Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Firebase Storage
4. Get Firebase config credentials

### Cart State Management (Zustand)
```typescript
// lib/store.ts

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}
```

## SEO Checklist

- [ ] Unique title tags for each page
- [ ] Meta descriptions (150-160 characters)
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card tags
- [ ] Canonical URLs
- [ ] Alt text for all images
- [ ] Semantic HTML (h1, h2, article, etc.)
- [ ] Structured data (JSON-LD)
- [ ] XML sitemap
- [ ] Robots.txt
- [ ] Mobile responsive
- [ ] Fast loading times (< 3s)
- [ ] HTTPS enabled
- [ ] 404 page

## Success Metrics
- All pages load in < 2 seconds
- Mobile responsive (100% usable)
- Lighthouse SEO score > 90
- Products display correctly
- Cart functionality works smoothly
- Images load and display properly
