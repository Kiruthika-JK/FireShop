import { ProductModel } from '../domain/models/ProductModel';
import { getTamilNames, getTamilProductNames } from '@/lib/data/tamilCrackerNames';

const siteUrl = 'https://www.ganishkhasricrackers.in';
const brand = 'Ganishkha Sri Crackers';
const brandAlternates = [
  'Ganishka Sri Crackers',
  'Ganishka Crackers',
  'Ganisika Crackers',
  'Ganiskha Crackers',
  'Ganis Crackers',
  'Ganishka Traders',
  'Ganishkhasri Crackers',
  'Ganishka Sri Traders',
];

function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr.map(s => s.toLowerCase().trim())));
}

function sanitizeName(name: string): string {
  return name.replace(/\s+/g, ' ').trim();
}

export interface ProductSEO {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  structuredData: object;
}

export function generateProductSEO(product: ProductModel, id?: string): ProductSEO {
  const productId = id ?? product.id ?? '';
  const name = sanitizeName(product.name);
  const category = sanitizeName(product.category);
  const price = product.price ?? 0;
  const originalPrice = product.originalPrice ?? price;
  const discount = product.discountPercent ?? 0;
  const content = product.content || '1 Box';
  const thumbnail = product.thumbnail || '/logo.png';

  const categoryTamil = getTamilNames(category);
  const productTamil = getTamilProductNames(name);
  const tamilKeywords = dedupe([...categoryTamil, ...productTamil]);

  const title = `Buy ${name} Online | Sivakasi ${category} | ${brand}`;
  const description = `Buy ${name} at ${price > 0 ? `₹${price}` : 'wholesale price'}. Premium Sivakasi ${category} for Diwali and celebrations. ${content} of quality ${category} with fast delivery across Tamil Nadu & India. Contact 82488 17401, 81481 65318.`;

  const keywordTokens = dedupe([
    name,
    category,
    brand,
    'Ganishkha Sri Traders',
    ...brandAlternates,
    'Sivakasi crackers',
    'buy sivakasi crackers online',
    'Diwali crackers',
    'buy diwali crackers online',
    'Deepavali pattasu',
    'diwali pattasu',
    'sivakasi pattasu',
    'wholesale crackers',
    'factory price crackers',
    'best price crackers sivakasi',
    'Tamil Nadu fireworks',
    `sivakasi ${category}`,
    `diwali ${category}`,
    `buy ${category} online`,
    ...name.split(/[\s\(\)\/&,-]+/),
    ...category.split(/[\s\(\)\/&,-]+/),
    ...tamilKeywords,
  ]).filter(k => k.length > 1).join(', ');

  const canonicalUrl = `${siteUrl}/product/${productId}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    alternateName: brandAlternates,
    image: thumbnail.startsWith('http') ? thumbnail : `${siteUrl}${thumbnail}`,
    description,
    brand: {
      '@type': 'Brand',
      name: brand,
      alternateName: brandAlternates,
    },
    category,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'INR',
      availability: product.outOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: canonicalUrl,
      priceValidUntil: '2026-12-31',
      seller: {
        '@type': 'LocalBusiness',
        name: `${brand} - Ganishkha Sri Traders`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Chinnakamanpatti, Sattur Road',
          addressLocality: 'Sivakasi',
          addressRegion: 'Tamil Nadu',
          postalCode: '626189',
          addressCountry: 'IN',
        },
        telephone: '+918248817401',
      },
    },
    aggregateOffer: price > 0 && originalPrice > 0
      ? {
          '@type': 'AggregateOffer',
          lowPrice: price.toString(),
          highPrice: originalPrice.toString(),
          priceCurrency: 'INR',
          availability: product.outOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        }
      : undefined,
  };

  return {
    seoTitle: title,
    seoDescription: description,
    seoKeywords: keywordTokens,
    metaTitle: title,
    metaDescription: description,
    canonicalUrl,
    structuredData,
  };
}

export function normalizeProductSEO(product: ProductModel, id?: string): Partial<ProductModel> {
  const seo = generateProductSEO(product, id);
  return {
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
    seoKeywords: seo.seoKeywords,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    canonicalUrl: seo.canonicalUrl,
    structuredData: seo.structuredData,
  };
}
