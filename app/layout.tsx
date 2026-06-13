import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
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
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "GANISHKHA SRI CRACKERS - Ganishkha Sri Traders",
    "alternateName": "Ganishkha Sri Crackers",
    "description": "Premium Sivakasi firecrackers at factory prices. Buy sparklers, flower pots, bombs, rockets online from Ganishkha Sri Traders in Chinnakamanpatti, Sivakasi.",
    "url": "https://project-i4vs6.vercel.app",
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
    "openingHours": "Mo-Sa 09:00-18:00",
    "priceRange": "₹₹",
    "areaServed": "Tamil Nadu, Pondicherry, India"
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
      </body>
    </html>
  );
}
