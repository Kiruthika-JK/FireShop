import { Metadata } from 'next';
import { generateSEOHead } from '@/components/seo/SEOHead';
import { FirestoreProductsDs } from '@/lib/features/product/data/sources/FirestoreProductsDs';
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel';
import { getProductUrl } from '@/lib/features/product/utils/productUrl';
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

    const pageTitle = 'Ganishkha Sri Crackers | Sivakasi Crackers Online 2026 | Top Cracker Dealers';

    const pageDescription = (products.length > 0
        ? `Ganishkha Sri Crackers - top cracker dealers in Sivakasi. Buy 100% genuine Sivakasi crackers and Diwali 2026 crackers online. Best online crackers shop with ${products.length}+ firecrackers: ${productNames}. Factory price list. Delivery across Jammu & Kashmir, West Bengal, Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Maharashtra, Uttar Pradesh & Uttarakhand.`
        : `Ganishkha Sri Crackers - top cracker dealers in Sivakasi. Buy 100% genuine Sivakasi crackers and Diwali 2026 crackers online. Best online crackers shop for sparklers, flower pots, bombs, rockets, gift boxes. Delivery across all Indian states.`) || undefined;

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

export const revalidate = 86400;

export default async function ProductListPage() {
    const products = await getProducts();

    const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: products.slice(0, 50).map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${siteUrl}${getProductUrl(product)}`,
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

    const homeFaqs = [
        {
            question: 'Where can I buy 100% genuine Sivakasi crackers online?',
            answer: 'Ganishkha Sri Crackers sells 100% genuine Sivakasi crackers online at factory-direct wholesale prices. We deal with top brands since 2010 and deliver across Jammu & Kashmir, West Bengal, Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Maharashtra, Uttar Pradesh and Uttarakhand.',
        },
        {
            question: 'What is the price of Diwali crackers in Sivakasi for 2026?',
            answer: 'Our 2026 Sivakasi crackers price list offers up to 80% off MRP on sparklers, flower pots, ground chakkar, bombs, rockets, aerial shots, gift boxes and more. Prices are updated regularly on the website.',
        },
        {
            question: 'Do you deliver crackers across India?',
            answer: 'Yes. We deliver crackers across all Indian states including Jammu & Kashmir, West Bengal, Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Maharashtra, Uttar Pradesh and Uttarakhand. Tamil Nadu and Pondicherry minimum order is ₹3000; other states minimum order is ₹6000. GST is not charged for Tamil Nadu and Pondicherry orders; 18% GST applies for other states.',
        },
        {
            question: 'How can I order crackers from Ganishkha Sri Crackers?',
            answer: 'Browse the price list, add products to your cart, enter your delivery details and checkout. You can also call or WhatsApp 82488 17401 / 81481 65318 for assistance.',
        },
        {
            question: 'Are your Sivakasi crackers genuine and from top brands?',
            answer: 'Yes. We source 100% genuine Sivakasi crackers from leading brands. Ganishkha Sri Crackers has been supplying top-quality firecrackers since 2010 with safe packaging and all-India delivery.',
        },
        {
            question: 'Where can I buy pattasu online from Sivakasi?',
            answer: 'You can buy pattasu online directly from Ganishkha Sri Crackers. We offer Sivakasi pattasu online shopping with factory-direct prices, 100% genuine products and delivery across India.',
        },
        {
            question: 'Is it safe to order pattasu online?',
            answer: 'Yes. Ordering pattasu online from Ganishkha Sri Crackers is safe. We use secure packaging, trusted transport partners and deliver genuine Sivakasi crackers to your nearest hub.',
        },
        {
            question: 'What is the minimum order for pattasu online?',
            answer: 'The minimum order for pattasu online is ₹3000 for Tamil Nadu and Pondicherry, and ₹6000 for other states. GST is not charged for Tamil Nadu / Pondicherry orders; 18% GST applies for other states.',
        },
    ];

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: homeFaqs.map((f) => ({
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <ProductListPageClient products={products} homeFaqs={homeFaqs} />
        </>
    );
}
