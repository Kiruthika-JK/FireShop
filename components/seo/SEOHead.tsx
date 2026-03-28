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
  title = "GANISHKHASRI CRACKERS - Premium Firecrackers Online | Sivakasi | Best Prices",
  description = "Buy premium quality firecrackers online from Ganishkhasri Traders Sivakasi. Largest collection of sparklers, flower pots, bombs, rockets, aerial shots. ISO certified, 80% discount, fast delivery across India. Contact: 8248817401, 8148165318",
  keywords = "firecrackers online, diwali crackers, buy crackers online, sivakasi crackers, ganishkhasri crackers, premium firecrackers, sparklers online, flower pots, bombs, rockets, aerial shots, chakras, novelty crackers, best prices, 80% discount, iso certified crackers, crackers delivery, chinnakamanpatti crackers, sattur road crackers, indian fireworks, diwali special crackers, wholesale crackers, crackers shop online",
  canonical = "https://ganishkha-crackers-store.web.app",
  ogImage = "/og-image.jpg",
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
