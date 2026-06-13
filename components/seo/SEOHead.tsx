import { Metadata } from 'next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generateSEOHead({
  title = "GANISHKHA SRI CRACKERS | Best Sivakasi Crackers Online Shop - Ganishkha Sri Traders",
  description = "Ganishkha Sri Crackers - Premium Sivakasi firecrackers at factory prices. Buy sparklers, flower pots, bombs, rockets online from Ganishkha Sri Traders. Fast delivery across Tamil Nadu & India. Contact: 8248817401, 8148165318",
  keywords = "ganishkha sri crackers, ganishkhasri crackers, sivakasi crackers, buy sivakasi crackers online, best crackers shop sivakasi, ganishkhasri traders, chinnakamanpatti crackers, wholesale crackers sivakasi, tamil nadu crackers online, diwali crackers sivakasi, sparklers online, flower pots sivakasi, bombs crackers, rockets fireworks, indian firecrackers, eco-friendly crackers, factory price crackers, crackers delivery india",
  canonical = "https://project-i4vs6.vercel.app",
  ogImage = "/logo.png",
  noIndex = false
}: SEOHeadProps): Metadata {
  return {
    title,
    description,
    keywords,
    metadataBase: new URL(canonical),
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "GANISHKHASRI CRACKERS - Sivakasi",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "GANISHKHASRI CRACKERS - Premium Firecrackers from Sivakasi",
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
      google: 'your-google-verification-code',
    },
    other: {
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
