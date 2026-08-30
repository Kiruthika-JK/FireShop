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
  return unique.slice(0, 100).join(', ');
}

export async function generateMetadata(): Promise<Metadata> {
  const products = await getProducts();
  const base = generateSEOHead({});
  const productNames = products.slice(0, 15).map(p => p.name).join(', ');

  const pageTitle = 'Buy Diwali Crackers Online 2026 | Ganishkha Sri Crackers - Sivakasi';

  const pageDescription = (products.length > 0
    ? `${base.description} Shop ${products.length}+ premium Sivakasi crackers online: ${productNames}. Best price list for Diwali fireworks, pattasu, pataka and gift boxes.`
    : `${base.description} Best Sivakasi crackers price list 2026. Shop Diwali fireworks, pattasu, pataka and gift boxes online.`) || undefined;

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

export const revalidate = 3600;

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
        item: siteUrl,
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
