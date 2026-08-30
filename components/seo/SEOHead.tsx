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
  keywords = "ganishkha sri crackers, ganishkhasri crackers, ganishka sri crackers, ganishka crackers, kanishka crackers, kanishka sri crackers, kanishkaa crackers, ganiska crackers, ganiskha crackers, ganishkha traders, ganishka traders, kanishka traders, sivakasi crackers, buy sivakasi crackers online, best crackers shop sivakasi, ganishkhasri traders, chinnakamanpatti crackers, wholesale crackers sivakasi, tamil nadu crackers online, diwali crackers sivakasi, diwali crackers online, buy diwali crackers online, diwali crackers 2026, diwali crackers price list, online crackers price list 2026, sivakasi crackers price list, buy pattasu online, pattasu online shopping, sivakasi pattasu online, online pattasu kadai, pataka online, buy pataka online, online crackers chennai, crackers online coimbatore, crackers online erode, crackers online pondicherry, online crackers andhra pradesh, online crackers hyderabad, online crackers booking, crackers home delivery, cheap crackers online, low price crackers sivakasi, best online crackers website india, trusted crackers website india, crackers near me, crackers shop near me, sparklers online, flower pots sivakasi, bombs crackers, rockets fireworks, indian firecrackers, eco-friendly crackers, factory price crackers, crackers delivery india",
  canonical = "https://www.ganishkhasricrackers.in",
  ogImage = "/logo.png",
  noIndex = false
}: SEOHeadProps): Metadata {
  return {
    title,
    description,
    keywords,
    applicationName: "Ganishkha Sri Crackers",
    manifest: "/manifest.json",
    metadataBase: new URL(canonical),
    alternates: {
      canonical: canonical,
    },
    appleWebApp: {
      title: "Ganishkha Sri Crackers",
      statusBarStyle: "default",
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
