'use client';

import { useState, useEffect } from 'react';
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel';
import { SinglePageProductGrid } from '@/components/home/SinglePageProductGrid';
import { CheckoutFloatingBar } from '@/components/home/CheckoutFloatingBar';
import { HeroSection } from '@/components/ui/HeroSection';
import { TrendingProducts } from '@/components/ui/TrendingProducts';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { BrandsSection } from '@/components/ui/BrandsSection';
import { SpecialCelebrationBanner } from '@/components/home/SpecialCelebrationBanner';

interface ProductListPageClientProps {
  products: ProductModel[];
}

export default function ProductListPageClient({ products }: ProductListPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const specialCount = products.filter(p => p.category === 'Special Celebration Function').length;

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

  useEffect(() => {
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

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categories]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <HeroSection />
      <SpecialCelebrationBanner productCount={specialCount} />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-slate-100 pb-20 pt-4 sm:pt-6">
        <div className="container mx-auto px-4 sm:px-6">
          <TrendingProducts products={products} />

          <div id="products">
            <SinglePageProductGrid
              products={products}
              activeCategory={activeCategory}
            />
          </div>
        </div>
        <CheckoutFloatingBar />
      </main>

      <BrandsSection />
      <ScrollToTop />
    </>
  );
}
