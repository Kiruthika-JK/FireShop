import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/ui/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AuthProvider } from "@/lib/auth-context";
import { BestSellersProvider } from "@/lib/best-sellers-context";
import { SparkleAnimation } from "@/components/animations/SparkleAnimation";
import { SparkleContainer } from "@/components/animations/SparkleContainer";
import { generateSEOHead } from "@/components/seo/SEOHead";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    ...generateSEOHead({}),
    icons: {
        icon: '/icon.png',
        shortcut: '/icon.png',
        apple: '/apple-icon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const websiteJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Ganishkha Sri Crackers",
        "alternateName": ["GANISHKHA SRI CRACKERS", "Ganishkha Sri Traders", "Ganishka Sri Crackers", "Ganishka Crackers", "Ganisika Crackers", "Ganiskha Crackers", "Ganis Crackers", "Ganishka Traders", "Ganishkhasri Crackers", "Ganishka Sri Traders"],
        "url": "https://www.ganishkhasricrackers.in",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.ganishkhasricrackers.in/?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };

    const organizationJsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Ganishkha Sri Crackers",
        "alternateName": ["GANISHKHA SRI CRACKERS", "Ganishkha Sri Traders", "Ganishka Sri Crackers", "Ganishka Crackers", "Ganisika Crackers", "Ganiskha Crackers", "Ganis Crackers", "Ganishka Traders", "Ganishkhasri Crackers", "Ganishka Sri Traders"],
        "url": "https://www.ganishkhasricrackers.in",
        "logo": "https://www.ganishkhasricrackers.in/logo.png?v=2",
        "image": "https://www.ganishkhasricrackers.in/logo.png?v=2",
        "description": "Ganishkha Sri Crackers - top cracker dealers in Sivakasi. Buy 100% genuine Sivakasi crackers and Diwali 2026 crackers online. Best online crackers shop at factory prices. Wholesale sparklers, flower pots, bombs, rockets, aerial shots and gift boxes with delivery across India.",
        "telephone": "+918248817401",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+918248817401",
            "contactType": "sales",
            "areaServed": "IN",
            "availableLanguage": ["Tamil", "English"]
        }
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Ganishkha Sri Crackers",
        "alternateName": ["GANISHKHA SRI CRACKERS", "Ganishkha Sri Traders", "Ganishka Sri Crackers", "Ganishka Crackers", "Ganisika Crackers", "Ganiskha Crackers", "Ganis Crackers", "Ganishkhasri Crackers"],
        "description": "Ganishkha Sri Crackers - top cracker dealers in Sivakasi. Buy 100% genuine Sivakasi crackers and Diwali 2026 crackers online. Best online crackers shop at factory prices from Chinnakamanpatti, Sivakasi. Wholesale sparklers, flower pots, bombs, rockets, aerial shots and gift boxes.",
        "url": "https://www.ganishkhasricrackers.in",
        "telephone": "+918248817401",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Chinnakamanpatti, Sattur Road",
            "addressLocality": "Sivakasi",
            "addressRegion": "Tamil Nadu",
            "postalCode": "626189",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "9.45",
            "longitude": "77.80"
        },
        "openingHours": "Mo-Su 09:00-21:00",
        "priceRange": "₹₹",
        "areaServed": ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Telangana", "Maharashtra", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Jammu and Kashmir", "Pondicherry", "India"]
    };

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="sitemap" type="application/xml" href="https://www.ganishkhasricrackers.in/sitemap.xml" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
                suppressHydrationWarning
            >
                <SparkleAnimation />
                <SparkleContainer />
                <AuthProvider>
                    <BestSellersProvider>
                        <Navbar />
                        {children}
                    </BestSellersProvider>
                </AuthProvider>
                <Analytics />
                <Footer />
                <WhatsAppFloat />
            </body>
        </html>
    );
}
