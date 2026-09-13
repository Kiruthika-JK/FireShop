import { Metadata } from 'next';
import { generateSEOHead } from '@/components/seo/SEOHead';
import { PopularCategories } from '@/components/home/PopularCategories';
import Link from 'next/link';

const siteUrl = 'https://www.ganishkhasricrackers.in';

export const metadata: Metadata = generateSEOHead({
    title: 'Buy Sivakasi Crackers Online | Ganishkha Sri Crackers',
    description: 'Ganishkha Sri Crackers - top cracker dealers in Sivakasi. Buy 100% genuine Sivakasi crackers online 2026. Wholesale firecrackers, pattasu, patakha, sparklers, flower pots, bombs, rockets, gift boxes. Best online crackers shop with delivery across Jammu & Kashmir, West Bengal, Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Maharashtra, Uttar Pradesh & Uttarakhand.',
    canonical: `${siteUrl}/sivakasi-crackers`,
    keywords: 'sivakasi crackers, buy sivakasi crackers online, genuine sivakasi crackers, sivakasi crackers online, sivakasi crackers wholesale, sivakasi crackers price list, sivakasi crackers 2026, sivakasi firecrackers, sivakasi fireworks, sivakasi pattasu, sivakasi patakha, sivakasi bomb, sivakasi rocket, sivakasi gift box, sivakasi crackers shop, best sivakasi crackers, wholesale sivakasi crackers, online crackers sivakasi, online crackers, top cracker dealers, top cracker dealers in sivakasi, diwali 2026, diwali 2026 crackers, ganishkha sri crackers, ganishkha traders sivakasi, chinnakamanpatti crackers, tamil nadu crackers, diwali crackers sivakasi, diwali fireworks sivakasi, sivakasi pattasu online, online pattasu sivakasi, pattasu online shopping, pattasu online 2026',
});

const faqs = [
    {
        question: 'Where can I buy 100% genuine Sivakasi crackers online?',
        answer: 'Ganishkha Sri Crackers sells 100% genuine Sivakasi crackers online. We source directly from top brands since 2010 and deliver across Jammu & Kashmir, West Bengal, Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Maharashtra, Uttar Pradesh and Uttarakhand.',
    },
    {
        question: 'Do you have a Sivakasi crackers price list for 2026?',
        answer: 'Yes. We update our 2026 Sivakasi crackers price list regularly. You can browse our catalog for sparklers, flower pots, bombs, rockets, aerial shots, gift boxes and more at wholesale rates.',
    },
    {
        question: 'Do you sell wholesale Sivakasi crackers?',
        answer: 'Yes. We are a wholesale Sivakasi crackers supplier. Orders start from ₹3000 for Tamil Nadu / Pondicherry and ₹6000 for other states, with 80% off MRP on most products.',
    },
    {
        question: 'Which Sivakasi cracker brands do you stock?',
        answer: 'We stock top Sivakasi brands including Winstar, Sky King, Annai, Vadivel, Hayagrivar, Vanitha, Sri Vijay, Dass, Varshini, Nayagi, Deepam, Sri Krishna, Mother\'s and Suryakala.',
    },
    {
        question: 'How do I order Sivakasi crackers online?',
        answer: 'Browse the Sivakasi crackers catalog, add products to your cart, and checkout. Our team will call you within 24 hours to confirm payment and transport details.',
    },
    {
        question: 'Can I buy Sivakasi pattasu online?',
        answer: 'Yes. Ganishkha Sri Crackers offers Sivakasi pattasu online with 100% genuine products, factory-direct pricing and all-India delivery.',
    },
    {
        question: 'What is the best online pattasu shop in Sivakasi?',
        answer: 'Ganishkha Sri Crackers is a trusted online pattasu shop in Sivakasi. We deal with top brands since 2010 and provide wholesale rates with safe doorstep delivery.',
    },
    {
        question: 'How do I book pattasu online for Diwali 2026?',
        answer: 'You can book pattasu online for Diwali 2026 by adding products to your cart, entering your delivery state and completing checkout. Minimum order is ₹3000 for Tamil Nadu / Pondicherry and ₹6000 for other states.',
    },
];

export default function SivakasiCrackersPage() {
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Sivakasi Crackers', item: `${siteUrl}/sivakasi-crackers` },
        ],
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
            },
        })),
    };

    const howToJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to buy Sivakasi crackers online',
        description: 'Follow these steps to order Sivakasi crackers online from Ganishkha Sri Crackers.',
        totalTime: 'PT10M',
        step: [
            {
                '@type': 'HowToStep',
                position: 1,
                name: 'Browse the catalog',
                text: 'Open the Sivakasi crackers catalog and choose sparklers, flower pots, bombs, rockets, aerial shots or gift boxes.',
            },
            {
                '@type': 'HowToStep',
                position: 2,
                name: 'Add to cart',
                text: 'Select the quantity and add your favourite Sivakasi crackers to the cart.',
            },
            {
                '@type': 'HowToStep',
                position: 3,
                name: 'Checkout',
                text: 'Enter your details, choose payment and confirm the order. Our team will call you to arrange transport.',
            },
        ],
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
            Buy 100% Genuine Sivakasi Crackers Online
                    </h1>
                    <p className="text-lg sm:text-xl text-yellow-400 mb-2">
            Top Brands Since 2010 • Factory Direct Prices • All India Delivery
                    </p>
                    <p className="text-gray-300 max-w-2xl mx-auto">
            100% genuine Sivakasi crackers, pattasu, patakha, sparklers, flower pots, bombs, rockets, aerial shots and gift boxes from Ganishkha Sri Traders in Chinnakamanpatti, Sivakasi. Delivering across Jammu & Kashmir, West Bengal, Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Maharashtra, Uttar Pradesh & Uttarakhand.
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/"
                            className="inline-block w-full sm:w-auto bg-yellow-400 text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors"
                        >
              Shop Now
                        </Link>
                    </div>
                </div>
            </section>

            <PopularCategories />

            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-4xl space-y-6 text-gray-700 leading-relaxed">
                    <p>
            Sivakasi is known as the firecracker capital of India. If you are looking to
                        <strong> buy 100% genuine Sivakasi crackers online</strong>, Ganishkha Sri Crackers brings you
            authentic fireworks directly from the manufacturing hub. Since 2010, we have supplied retail and wholesale
            customers across Jammu & Kashmir, West Bengal, Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana,
            Maharashtra, Uttar Pradesh, Uttarakhand and all other states.
                    </p>
                    <p>
            Our <strong>Sivakasi crackers price list 2026</strong> offers transparent factory-direct
            rates. You can shop <strong>sparklers</strong>, <strong>flower pots</strong>,
                        <strong> ground chakkar</strong>, <strong>bombs</strong>, <strong>rockets</strong>,
                        <strong> aerial shots</strong>, <strong>whistling fountains</strong>,
                        <strong> crackling fountains</strong>, <strong>children novelties</strong> and
                        <strong> gift boxes</strong> from the comfort of your home.
                    </p>
                    <p>
            Popular searches that bring customers to us include:
                        <em> sivakasi crackers, buy sivakasi crackers online, sivakasi crackers wholesale,
            sivakasi crackers price list, sivakasi pattasu, sivakasi patakha, sivakasi firecrackers,
            sivakasi fireworks, sivakasi bomb, sivakasi rocket, chinnakamanpatti crackers,
            crackers online chennai, crackers online coimbatore, crackers online bangalore,
            crackers online hyderabad, crackers online mumbai</em>.
                    </p>
                    <p>
            We accept minimum orders of ₹3000 for Tamil Nadu / Pondicherry and ₹6000 for other states.
            No GST is charged for local Tamil Nadu and Pondicherry orders. For other states, 18% GST is
            added. Delivery charges are paid to the courier partner for local orders and with the order
            for other states.
                    </p>
                </div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Why Buy Sivakasi Crackers from Ganishkha Sri Crackers?
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold mb-2">100% Genuine Sivakasi Crackers</h3>
                            <p className="text-gray-700">Sourced directly from trusted manufacturers in Chinnakamanpatti, Sivakasi, ensuring fresh stock, best prices and authentic quality.</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold mb-2">Top Brands Since 2010</h3>
                            <p className="text-gray-700">Over 15 years of supplying Winstar, Sky King, Annai, Vadivel, Hayagrivar, Vanitha, Sri Vijay and other leading Sivakasi brands.</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold mb-2">All India Delivery</h3>
                            <p className="text-gray-700">We deliver across Jammu & Kashmir, West Bengal, Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Maharashtra, Uttar Pradesh, Uttarakhand and all other states.</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold mb-2">Safe & Certified</h3>
                            <p className="text-gray-700">All products meet safety standards and are sourced from licensed Sivakasi brands.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-700">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to buy Sivakasi crackers online?</h2>
                    <p className="text-gray-300 mb-6">
            Call or WhatsApp <strong>82488 17401</strong> / <strong>81481 65318</strong> or browse our Diwali crackers collection.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link
                            href="/diwali-crackers-online"
                            className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors"
                        >
              Shop Diwali Crackers
                        </Link>
                        <Link
                            href="/"
                            className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
                        >
              View Price List
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
