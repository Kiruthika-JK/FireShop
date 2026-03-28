'use client';

import { useEffect } from 'react';
import { ProductGrid } from '@/components/home/ProductGrid'
import { CheckoutFloatingBar } from '@/components/home/CheckoutFloatingBar'
import { HeroSection } from '@/components/ui/HeroSection'
import { CategoryBanners } from '@/components/ui/CategoryBanners'
import { ProductProvider } from '@/components/home/ProductProvider'

export default function ProductListPage() {
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
      <HeroSection />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-slate-100 pb-20 pt-4 sm:pt-6">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Category Banners */}
          <CategoryBanners />
          
          {/* Products Grid */}
          <div id="products">
            <ProductProvider 
              loadingComponent={
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }
            >
              {(products) => <ProductGrid products={products} />}
            </ProductProvider>
          </div>
        </div>
        <CheckoutFloatingBar />
      </main>
    </>
  )
}
