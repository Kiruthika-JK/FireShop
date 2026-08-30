import { Metadata } from 'next';
import { generateSEOHead } from '@/components/seo/SEOHead';
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs';
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel';
import ProductListPageClient from './page-client';

const siteUrl = 'https://www.ganishkhasricrackers.in';

async function getProducts(): Promise<ProductModel[]> {
  try {
    return await FirestoreProductsDs.getProducts();
  } catch (error) {
    console.error('Failed to load products for home page:', error);
    return [];
  }
}

function buildKeywords(products: ProductModel[], baseKeywords: string): string {
  const productTokens = products
    .flatMap(p => [p.name, p.category])
    .filter(Boolean)
    .flatMap(text => (text as string).split(/[\s\(\)\/&,-]+/).filter(Boolean));
  const unique = Array.from(new Set([...baseKeywords.split(', '), ...productTokens]));
  return unique.slice(0, 200).join(', ');
}

export async function generateMetadata(): Promise<Metadata> {
  const products = await getProducts();
  const base = generateSEOHead({});
  const productNames = products.slice(0, 15).map(p => p.name).join(', ');

  const pageTitle = 'Sivakasi Crackers | Buy Diwali Crackers Online 2026 | Ganishkha Sri Crackers';

  const pageDescription = (products.length > 0
    ? `Buy Sivakasi crackers and Diwali crackers online 2026 at Ganishkha Sri Crackers. Shop ${products.length}+ premium firecrackers: ${productNames}. Best price list for sparklers, flower pots, bombs, rockets, gift boxes. Pan-India delivery.`
    : `Buy Sivakasi crackers and Diwali crackers online 2026 at Ganishkha Sri Crackers. Best price list for sparklers, flower pots, bombs, rockets, gift boxes. Pan-India delivery.`) || undefined;

  const keywords = buildKeywords(products, typeof base.keywords === 'string' ? base.keywords : '');

  return {
    ...base,
    title: pageTitle,
    description: pageDescription,
    keywords,
    openGraph: {
      ...base.openGraph,
      title: pageTitle,
      description: pageDescription,
    },
    twitter: {
      ...base.twitter,
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductListPage() {
  const products = await getProducts();

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.slice(0, 50).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/product/${product.id}`,
      name: product.name,
    })),
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: {
          '@type': 'WebPage',
          '@id': siteUrl,
          name: 'Home',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <ProductListPageClient products={products} />
    </>
  );
}
