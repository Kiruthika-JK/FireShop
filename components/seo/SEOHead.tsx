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
  title = "GANISHKHASRI CRACKERS - Buy Premium Firecrackers Online | Sivakasi, Tamil Nadu",
  description = "Buy premium quality eco-friendly firecrackers online from Ganishkhasri Traders, Sivakasi. Direct factory price, largest collection of sparklers, flower pots, bombs, and aerial shots. Fast delivery across Tamil Nadu and India. Contact: 8248817401",
  keywords = "Sivakasi crackers, Buy crackers online, Online crackers shopping India, Sivakasi firecrackers wholesale, Best crackers shop in Sivakasi, Diwali crackers online, Eco-friendly firecrackers, Fireworks manufacturer in Tamil Nadu, Factory price crackers Sivakasi, ganishkhasri crackers, sparklers online, indian fireworks, wholesale crackers",
  canonical = "https://ganishkha-crackers-store.web.app",
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
