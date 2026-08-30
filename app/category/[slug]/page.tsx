import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateSEOHead } from '@/components/seo/SEOHead';
import { ProductCard } from '@/components/ProductCard';
import { CheckoutFloatingBar } from '@/components/home/CheckoutFloatingBar';
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs';
import { categories, getCategoryBySlug } from '@/lib/data/categories';

const siteUrl = 'https://www.ganishkhasricrackers.in';

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category Not Found | Ganishkha Sri Crackers' };
  }

  const name = category.name;

  return generateSEOHead({
    title: `Buy ${name} Online | Sivakasi ${name} | Ganishkha Sri Crackers`,
    description: `Buy ${name} online from Sivakasi. Best price for ${name} crackers, Diwali fireworks and wholesale ${name} from Ganishkha Sri Crackers. Pan-India delivery.`,
    canonical: `${siteUrl}/category/${category.slug}`,
    keywords: `${name.toLowerCase()}, buy ${name.toLowerCase()} online, sivakasi ${name.toLowerCase()}, diwali ${name.toLowerCase()}, ${name.toLowerCase()} wholesale, ${name.toLowerCase()} price, sivakasi crackers, diwali crackers, online crackers, ganishkha sri crackers`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryName = category.name;
  let products: Awaited<ReturnType<typeof FirestoreProductsDs.getProducts>> = [];
  try {
    const allProducts = await FirestoreProductsDs.getProducts();
    products = allProducts.filter(
      (p) => p.category && p.category.toLowerCase().trim() === categoryName.toLowerCase()
    );
  } catch {
    products = [];
  }

  const productNames = products
    .slice(0, 8)
    .map((p) => p.name)
    .join(', ');

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryName} - Buy ${categoryName} Online`,
    itemListElement: products.slice(0, 50).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/product/${product.id}`,
      name: product.name,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: categoryName, item: `${siteUrl}/category/${category.slug}` },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Where can I buy ${categoryName} online in Sivakasi?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Ganishkha Sri Crackers sells ${categoryName} online from Sivakasi. We deliver across Tamil Nadu and all over India at factory-direct prices.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the price of ${categoryName} in Sivakasi?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our ${categoryName} price list is updated for 2026 with up to 80% off MRP. Browse the product list below or contact us for wholesale rates.`,
        },
      },
      {
        '@type': 'Question',
        name: `Do you sell ${categoryName} for Diwali?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ${categoryName} are available for Diwali 2026 and all celebrations. We offer bulk and retail orders with safe packaging.`,
        },
      },
    ],
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to buy ${categoryName} online`,
    description: `Order ${categoryName} online from Ganishkha Sri Crackers in three easy steps.`,
    totalTime: 'PT10M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Choose products',
        text: `Browse the ${categoryName} list and select the products you want.`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Add to cart',
        text: 'Add your favourite crackers to the cart.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Checkout',
        text: 'Enter your details and complete the order. Our team will call you to confirm transport.',
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <section className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-4">
            Buy {categoryName} Online
          </h1>
          <p className="text-lg sm:text-xl text-yellow-400 mb-2">
            Sivakasi {categoryName} • Premium Quality • Wholesale Prices
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Shop {categoryName.toLowerCase()} online from Ganishkha Sri Crackers. {products.length} products available with Diwali 2026 offers and pan-India delivery.
          </p>
          {productNames && (
            <p className="text-sm text-gray-400 mt-4">
              Popular: {productNames}
            </p>
          )}
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-6">
            {categoryName} Products
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
              <p className="text-gray-600">
                No products found in this category. Check back soon or{' '}
                <Link href="/contact" className="text-primary underline">
                  contact us
                </Link>{' '}
                for availability.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Why Buy {categoryName} from Ganishkha Sri Crackers?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We source {categoryName.toLowerCase()} directly from Sivakasi, the firecracker capital of India. Our {categoryName.toLowerCase()} are fresh, safe, and offered at factory-direct wholesale prices. Whether you are shopping for Diwali, weddings, New Year, or any celebration, we deliver across Tamil Nadu, Pondicherry, Karnataka, Andhra Pradesh, Telangana, Kerala, Maharashtra, and all other states.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Minimum order is ₹3000 for Tamil Nadu / Pondicherry and ₹6000 for other states. No GST for Tamil Nadu and Pondicherry orders. 18% GST applies for other states. Order {categoryName.toLowerCase()} online today and get them delivered safely to your doorstep.
          </p>
        </div>
      </section>
      <CheckoutFloatingBar />
    </main>
  );
}
