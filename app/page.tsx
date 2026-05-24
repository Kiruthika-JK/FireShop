'use client';

import { useState, useEffect } from 'react';
import { ProductProvider } from '@/components/home/ProductProvider';
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel';
import { SinglePageProductGrid } from '@/components/home/SinglePageProductGrid';
import { CheckoutFloatingBar } from '@/components/home/CheckoutFloatingBar';
import { HeroSection } from '@/components/ui/HeroSection';
import { CategoryBanners } from '@/components/ui/CategoryBanners';
import { TrendingProducts } from '@/components/ui/TrendingProducts';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { getTamilNames, getTamilProductNames, matchesTamilNames } from '@/lib/data/tamilCrackerNames';
import { useBestSellers } from '@/lib/best-sellers-context';
import { Flame } from 'lucide-react';
import Head from 'next/head';

export default function ProductListPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { showBestSellersOnly } = useBestSellers();

  // Enhanced SEO function with Tamil names
  const getSEOFriendlyName = (category: string, productName: string): string => {
    const tamilCategoryNames = getTamilNames(category);
    const tamilProductNames = getTamilProductNames(productName);
    
    return `${productName} ${tamilProductNames.join(' ')} ${category} ${tamilCategoryNames.join(' ')}`;
  };


  // Generate SEO keywords for meta tags
  const generateSEOKeywords = (products: ProductModel[]): string[] => {
    const keywords = new Set<string>();
    
    products.forEach(product => {
      // Add English names
      keywords.add(product.name);
      keywords.add(product.category);
      
      // Add Tamil names
      const tamilCategoryNames = getTamilNames(product.category);
      const tamilProductNames = getTamilProductNames(product.name);
      
      tamilCategoryNames.forEach(name => keywords.add(name));
      tamilProductNames.forEach(name => keywords.add(name));
      
      // Add common Tamil search terms
      keywords.add('kambi mathappu');
      keywords.add('bushvanam');
      keywords.add('saram');
      keywords.add('diwali');
      keywords.add('deepavali');
      keywords.add('pattasu');
      keywords.add('crackers');
      keywords.add('fireworks');
    });
    
    return Array.from(keywords);
  };

  // Categories data - reorganized based on actual product structure
  const categories = [
    { id: 'sparklers', name: 'Sparklers', count: 15 },
    { id: 'flowerpots', name: 'Flower Pots', count: 15 },
    { id: 'groundchakkar', name: 'Ground Chakkar', count: 18 },
    { id: 'peacocks', name: 'Peacocks', count: 3 },
    { id: 'bijili', name: 'Bijili Crackers', count: 2 },
    { id: 'twinklingstar', name: 'Twinkling Star', count: 2 },
    { id: 'pencil', name: 'Pencil Shots', count: 1 },
    { id: 'bombs', name: 'Bombs', count: 13 },
    { id: 'saravadi', name: 'Saravadi', count: 8 },
    { id: 'rockets', name: 'Rockets', count: 4 },
    { id: 'aerialshot', name: 'Aerial Shot', count: 22 },
    { id: 'whistlingfountain', name: 'Whistling Fountain', count: 3 },
    { id: 'cracklingfountain', name: 'Crackling Fountain', count: 21 },
    { id: 'doublewonder', name: 'Double Wonder', count: 2 },
    { id: 'megacrackling', name: 'Mega Crackling', count: 6 },
    { id: 'digitalwala', name: 'Digital Wala', count: 3 },
    { id: 'childrenNovelty', name: 'Children Novelty', count: 21 },
    { id: 'giftbox', name: 'Gift Boxes', count: 4 }
  ];

  // SEO Meta Tags Component
  const SEOMetaTags = () => {
    const tamilKeywords = [
      'kambi mathappu', 'bushvanam', 'saram', 'chakram', 'rocket', 'aerial',
      'diwali crackers', 'deepavali pattasu', 'tamil crackers', 'fireworks tamil nadu',
      'online crackers', 'buy crackers online', 'diwali fireworks', 'pattasu online',
      'sparklers', 'flower pots', 'bombs', 'chakras', 'rockets', 'aerial shots',
      'crackers shop', 'fireworks store', 'diwali special', 'festival crackers'
    ];

    return (
      <Head>
        <title>Diwali Crackers Online | Kambi Mathappu | Bushvanam | Saram | Tamil Nadu Fireworks</title>
        <meta name="description" content="Buy Diwali crackers online in Tamil Nadu. Premium quality kambi mathappu (sparklers), bushvanam (flower pots), saram (bombs), chakram, rockets and aerial fireworks. Best prices with fast delivery." />
        <meta name="keywords" content={tamilKeywords.join(', ')} />
        <meta name="author" content="FireShop Tamil Nadu" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Diwali Crackers Online | Kambi Mathappu | Bushvanam | Saram" />
        <meta property="og:description" content="Premium quality Diwali crackers and fireworks in Tamil Nadu. Kambi mathappu, bushvanam, saram, chakram, rockets and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Diwali Crackers Online | Tamil Nadu Fireworks" />
        <meta name="twitter:description" content="Buy kambi mathappu, bushvanam, saram and more crackers online in Tamil Nadu." />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Diwali Crackers and Fireworks",
              "description": "Premium quality Diwali crackers including kambi mathappu, bushvanam, saram, chakram, rockets and aerial fireworks in Tamil Nadu",
              "brand": "FireShop Tamil Nadu",
              "category": "Fireworks & Crackers",
              "keywords": tamilKeywords.join(', '),
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock"
              },
              "areaServed": "Tamil Nadu",
              "language": ["Tamil", "English"],
              "alternateName": ["கம்பி மதப்பு", "புஷ்வனம்", "சரம்", "சக்கரம்"]
            })
          }}
        />
        
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "FireShop Tamil Nadu - Diwali Crackers",
              "description": "Online store for Diwali crackers and fireworks in Tamil Nadu. Kambi mathappu, bushvanam, saram, chakram, rockets available.",
              "areaServed": "Tamil Nadu",
              "keywords": tamilKeywords.join(', '),
              "knowsLanguage": ["Tamil", "English"],
              "makesOffer": [
                "Kambi Mathappu (Sparklers)",
                "Bushvanam (Flower Pots)",
                "Saram (Bombs)",
                "Chakram (Chakras)",
                "Rockets",
                "Aerial Fireworks"
              ]
            })
          }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://yourwebsite.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Diwali Crackers",
                  "item": "https://yourwebsite.com/crackers"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Kambi Mathappu (Sparklers)",
                  "item": "https://yourwebsite.com/crackers/sparklers"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Bushvanam (Flower Pots)",
                  "item": "https://yourwebsite.com/crackers/flowerpots"
                }
              ]
            })
          }}
        />
      </Head>
    );
  };

  useEffect(() => {
    // Handle hash navigation for category scrolling
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && categories.some(cat => cat.id === hash)) {
        setActiveCategory(hash);
        const element = document.getElementById(`category-${hash}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Check hash on mount
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [categories]);

  useEffect(() => {
    // Handle hash navigation on page load
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };

    // Check hash on initial load
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <>
      <SEOMetaTags />
      <HeroSection />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-slate-100 pb-20 pt-8 sm:pt-12">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Trending Products Section */}
          <ProductProvider>
            {(products: ProductModel[]) => <TrendingProducts products={products} />}
          </ProductProvider>
                  
          {/* Products Grid */}
          <div id="products">
            <ProductProvider 
              loadingComponent={
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }
            >
              {(products: ProductModel[]) => <SinglePageProductGrid 
                products={showBestSellersOnly ? products.filter(p => p.trending) : products} 
                activeCategory={activeCategory}
                />}
            </ProductProvider>
          </div>
        </div>
        <CheckoutFloatingBar />
      </main>
      
      {/* Navigation Components */}
      <ScrollToTop />
    </>
  )
}

