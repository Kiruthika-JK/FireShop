import { Metadata } from 'next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const siteUrl = 'https://www.ganishkhasricrackers.in';

export function generateSEOHead({
    title = "Sivakasi Crackers Online | Ganishkha Sri 2026",
    description = "Buy 100% genuine Sivakasi crackers online at factory wholesale prices for Diwali 2026. Pan-India delivery available. Order from Ganishkha Sri Crackers.",
    keywords = "ganishkha sri crackers, ganishkhasri crackers, ganishka sri crackers, ganishka crackers, ganisika crackers, ganiskha crackers, ganis crackers, ganishkha traders, ganishka traders, ganishkhasri traders, ganishka sri traders, ganishkha sivakasi, ganishka sivakasi, ganishka fireworks, ganishka firecrackers, ganishka patakha, ganishka pattasu, ganishkha sri, ganishka sri, ganishkhasricrackers, ganishkhasricrackers.in, ganishka fire works, ganishkha traders sivakasi, chinnakamanpatti crackers, chinnakamanpatti pattasu, sivakasi crackers, sivakasi pattasu, sivakasi patakha, sivakasi firecrackers, sivakasi fireworks, sivakasi bomb, sivakasi rocket, sivakasi gift box, sivakasi crackers online, sivakasi crackers shop, sivakasi crackers wholesale, sivakasi crackers online shop, sivakasi fireworks dealers, top cracker dealers, top cracker dealers in sivakasi, top cracker dealers online, best sivakasi crackers, genuine sivakasi crackers, wholesale crackers sivakasi, cracker dealers, firecracker shop, firecrackers online, online crackers, online crackers india, online crackers shop, online crackers store, online crackers booking, buy crackers online, buy pattasu online, buy pataka online, pataka online, patakha online, patake online, pattasu online, pattasu online shopping, pattasu online 2026, pattasu online order, pattasu online delivery, sivakasi pattasu online, online pattasu sivakasi, pattasu online shopping sivakasi, buy sivakasi pattasu online, order pattasu online, pattasu online booking, pattasu kadai, pattasu shop, pattasu wholesale, pattasu price list, pattasu near me, online pattasu kadai, online pataka, pattasu online cash on delivery, online firecrackers, online fireworks, crackers home delivery, cheap crackers online, low price crackers, budget crackers, sattur crackers, virudhunagar crackers, madurai crackers, tamil nadu crackers, tamil nadu pattasu, tamil nadu patakha, crackers online tamil nadu, crackers online chennai, crackers online coimbatore, crackers online erode, crackers online pondicherry, crackers online puducherry, crackers online salem, crackers online trichy, crackers online tiruppur, crackers online vellore, crackers online madurai, crackers online bangalore, crackers online karnataka, crackers online kerala, crackers online telangana, crackers online andhra pradesh, crackers online hyderabad, crackers online mumbai, crackers online maharashtra, crackers online india, diwali crackers, diwali crackers online, diwali pattasu, diwali patakha, diwali crackers 2026, diwali 2026, diwali 2026 crackers, diwali fireworks, diwali fireworks online, buy diwali crackers online, diwali gift boxes, deepavali crackers, deepavali pattasu",
    canonical = siteUrl,
    ogImage = `${siteUrl}/logo.png?v=2`,
    noIndex = false
}: SEOHeadProps): Metadata {
    return {
        title,
        description,
        keywords,
        applicationName: "Ganishkha Sri Crackers",
        creator: "Ganishkha Sri Crackers",
        publisher: "Ganishkha Sri Crackers",
        manifest: "/manifest.json",
        metadataBase: new URL(siteUrl),
        alternates: {
            canonical: canonical,
        },
        icons: {
            icon: '/icon.png',
            apple: '/apple-icon.png',
        },
        appleWebApp: {
            title: "Ganishkha Sri Crackers",
            statusBarStyle: "default",
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: "Ganishkha Sri Crackers",
            images: [
                {
                    url: ogImage,
                    width: 1008,
                    height: 1053,
                    alt: "Ganishkha Sri Crackers - Premium Sivakasi Firecrackers",
                },
            ],
            locale: 'en_IN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            google: '-TjhNQX33PxZir4-jl2CeyLc2OWetZno7aPRBFGa-o8',
        },
        other: {
            'author': 'Ganishkha Sri Crackers',
            'publisher': 'Ganishkha Sri Crackers',
            'theme-color': '#000000',
            'msapplication-TileColor': '#000000',
            'business:contact_data:street_address': 'Chinnakamanpatti, Sattur Road, Sivakasi-626189',
            'business:contact_data:locality': 'Sivakasi',
            'business:contact_data:region': 'Tamil Nadu',
            'business:contact_data:postal_code': '626189',
            'business:contact_data:country_name': 'India',
            'business:contact_data:phone_number': '+918248817401,+918148165318',
        },
    };
}
