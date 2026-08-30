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
  const keywords = product.seoKeywords || fallback.seoKeywords;
  const canonical = product.canonicalUrl || fallback.canonicalUrl;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
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

  const seo = product.structuredData
    ? { ...product.structuredData, '@context': 'https://schema.org' }
    : generateProductSEO(product, id).structuredData;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seo) }}
      />
      <ProductDetailClient product={product} imageUrl={imageUrl} />
    </>
  );
}
