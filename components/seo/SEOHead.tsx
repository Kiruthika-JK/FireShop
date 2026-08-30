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
  title = "GANISHKHA SRI CRACKERS | Best Sivakasi Crackers Online Shop - Ganishkha Sri Traders",
  description = "Ganishkha Sri Crackers - Premium Sivakasi firecrackers at factory prices. Buy sparklers, flower pots, bombs, rockets online from Ganishkha Sri Traders. Fast delivery across Tamil Nadu & India. Contact: 8248817401, 8148165318",
  keywords = "ganishkha sri crackers, ganishkhasri crackers, ganishka sri crackers, ganishka crackers, ganisika crackers, ganiskha crackers, ganis crackers, ganishkha traders, ganishka traders, ganishkhasri traders, ganishka sri traders, ganishkha sivakasi, ganishka sivakasi, ganishka fireworks, ganishka firecrackers, ganishka patakha, ganishka pattasu, ganishkha sri, ganishka sri, ganishkhasricrackers, ganishkhasricrackers.in, ganishka fire works, ganishkha traders sivakasi, chinnakamanpatti crackers, chinnakamanpatti pattasu, sivakasi crackers, sivakasi pattasu, sivakasi patakha, sivakasi firecrackers, sivakasi fireworks, sivakasi bomb, sivakasi rocket, sivakasi gift box, sivakasi crackers online, sivakasi crackers shop, sivakasi crackers wholesale, sattur crackers, virudhunagar crackers, madurai crackers, tamil nadu crackers, tamil nadu pattasu, tamil nadu patakha, crackers online tamil nadu, crackers online chennai, crackers online coimbatore, crackers online erode, crackers online pondicherry, crackers online puducherry, crackers online salem, crackers online trichy, crackers online tiruppur, crackers online vellore, crackers online madurai, crackers online bangalore, crackers online karnataka, crackers online kerala, crackers online telangana, crackers online andhra pradesh, crackers online hyderabad, crackers online mumbai, crackers online maharashtra, crackers online india, diwali crackers, diwali crackers online, diwali pattasu, diwali patakha, diwali crackers 2026, diwali fireworks, diwali fireworks online, buy diwali crackers online, buy crackers online, buy pattasu online, buy pataka online, pataka online, patakha online, patake online, pattasu online, pattasu online shopping, pattasu kadai, pattasu shop, pattasu wholesale, pattasu price list, pattasu near me, online pattasu kadai, online pataka, online firecrackers, online fireworks, online crackers shop, online crackers store, online crackers booking, crackers home delivery, cheap crackers online, low price crackers, best price crackers sivakasi, factory price crackers, wholesale crackers, bulk crackers, retail crackers, wholesale crackers sivakasi, gift box crackers, gift boxes sivakasi, sparklers online, flower pots sivakasi, ground chakkar, peacock crackers, bijili crackers, twinkling star, pencil shots, bombs, bomb crackers, saravadi, rockets, aerial shot, whistling fountain, crackling fountain, double wonder, mega crackling, children novelty, eco friendly crackers, green crackers, safe crackers, quality crackers, trusted crackers website india, best online crackers website india, crackers near me, crackers shop near me, online cracker shop near me, cash on delivery crackers, cod crackers, same day delivery crackers, crackers delivery india, crackers delivery tamil nadu",
  canonical = siteUrl,
  ogImage = `${siteUrl}/logo.png?v=2`,
  noIndex = false
}: SEOHeadProps): Metadata {
  return {
    title,
    description,
    keywords,
    applicationName: "Ganishkha Sri Crackers",
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
      siteName: "GANISHKHASRI CRACKERS - Sivakasi",
      images: [
        {
          url: ogImage,
          width: 1008,
          height: 1053,
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
