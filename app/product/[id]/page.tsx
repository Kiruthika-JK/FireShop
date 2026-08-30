import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs';
import { generateProductSEO } from '@/lib/features/product/utils/generateProductSEO';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ id: string }> | { id: string };
  searchParams: Promise<{ url?: string | string[] }> | { url?: string | string[] };
}

function resolveSearchParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function generateMetadata({ params, searchParams }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await FirestoreProductsDs.getProductById(id);

  if (!product) {
    return { title: 'Product Not Found | Ganishkha Sri Crackers' };
  }

  const fallback = generateProductSEO(product, id);
  const title = product.seoTitle || fallback.seoTitle;
  const description = product.seoDescription || fallback.seoDescription;
  const rawKeywords = product.seoKeywords || fallback.seoKeywords;
  const keywords = typeof rawKeywords === 'string'
    ? rawKeywords.split(',').filter(k => !/kanishka/i.test(k)).join(', ')
    : rawKeywords;
  const canonical = product.canonicalUrl?.startsWith('http')
    ? product.canonicalUrl
    : fallback.canonicalUrl;
  const searchParamsResolved = await searchParams;
  const previewUrl = resolveSearchParam(searchParamsResolved.url);
  const imageUrl = previewUrl || product.thumbnail || '/logo.png';

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: imageUrl ? { card: 'summary_large_image', title, description, images: [imageUrl] } : undefined,
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { id } = await params;
  const product = await FirestoreProductsDs.getProductById(id);

  if (!product) {
    notFound();
  }

  const searchParamsResolved = await searchParams;
  const previewUrl = resolveSearchParam(searchParamsResolved.url);
  const imageUrl = previewUrl || product.thumbnail || '/logo.png';

  const seo = generateProductSEO(product, id).structuredData;
  const canonicalUrl = product.canonicalUrl?.startsWith('http')
    ? product.canonicalUrl
    : `https://www.ganishkhasricrackers.in/product/${id}`;
  const categoryName = product.category || 'Crackers';
  const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ganishkhasricrackers.in' },
      { '@type': 'ListItem', position: 2, name: categoryName, item: `https://www.ganishkhasricrackers.in/category/${categorySlug}` },
      { '@type': 'ListItem', position: 3, name: product.name, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient product={product} imageUrl={imageUrl} />
    </>
  );
}
