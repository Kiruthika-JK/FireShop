import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs';
import { generateProductSEO } from '@/lib/features/product/utils/generateProductSEO';
import { getProductIdFromSlug, getProductUrl } from '@/lib/features/product/utils/productUrl';
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
    const { id: rawId } = await params;
    const id = getProductIdFromSlug(rawId);
    const product = await FirestoreProductsDs.getProductById(id);

    if (!product) {
        return { title: 'Product Not Found | Ganishkha Sri Crackers' };
    }

    if (rawId !== getProductUrl(product).slice('/product/'.length)) {
        permanentRedirect(getProductUrl(product));
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
    const { id: rawId } = await params;
    const id = getProductIdFromSlug(rawId);
    const product = await FirestoreProductsDs.getProductById(id);

    if (!product) {
        notFound();
    }

    if (rawId !== getProductUrl(product).slice('/product/'.length)) {
        permanentRedirect(getProductUrl(product));
    }

    const searchParamsResolved = await searchParams;
    const previewUrl = resolveSearchParam(searchParamsResolved.url);
    const imageUrl = previewUrl || product.thumbnail || '/logo.png';

    const seo = generateProductSEO(product, id).structuredData;
    const canonicalUrl = product.canonicalUrl?.startsWith('http')
        ? product.canonicalUrl
        : `https://www.ganishkhasricrackers.in${getProductUrl(product)}`;
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

    const productFaqs = [
        {
            question: `What is the price of ${product.name} in Sivakasi?`,
            answer: `The price of ${product.name} is ${product.price > 0 ? `₹${product.price}` : 'available on request'}. ${product.content}. We offer 100% genuine wholesale Sivakasi ${categoryName} prices with all-India delivery.`,
        },
        {
            question: `Is ${product.name} available for Diwali delivery across India?`,
            answer: `Yes. ${product.name} is available for Diwali 2026 and all celebrations. We deliver across Jammu & Kashmir, West Bengal, Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Maharashtra, Uttar Pradesh, Uttarakhand and all other states.`,
        },
        {
            question: `Where can I buy 100% genuine ${product.name} online?`,
            answer: `You can buy 100% genuine ${product.name} online from Ganishkha Sri Crackers, a top Sivakasi wholesale crackers supplier since 2010. Add to cart, enter your address and checkout. Our team will confirm payment and transport via WhatsApp or call.`,
        },
    ];

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: productFaqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
            },
        })),
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <ProductDetailClient product={product} imageUrl={imageUrl} />
        </>
    );
}
