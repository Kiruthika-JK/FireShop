"use client";

import { useState } from 'react';
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel';
import { ProductCard } from '@/components/ProductCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Sparkles } from 'lucide-react';

interface TrendingProductsProps {
  products: ProductModel[];
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  // Filter Special Celebration Function products
  const specialProducts = products.filter(p => p.category === 'specialcelebrationfunction');
  
  const [showSpecial, setShowSpecial] = useState(false);

  const handleShowSpecial = () => {
    setShowSpecial(true);
    // Scroll to Special Celebration Function section
    setTimeout(() => {
      const element = document.getElementById('category-special-celebration-function');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  if (specialProducts.length === 0) return null;

  return (
    <div>
      {/* Trending Products Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-xl pt-1 px-2 sm:pt-1 sm:px-3 pb-0 sm:pb-0 shadow-xl transform transition-all duration-500 hover:scale-105">
        <div className="text-center">
          <div className="flex justify-center items-center gap-1 sm:gap-2 mb-0">
            <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-300 animate-pulse" />
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              Our Special Celebration
            </h2>
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-white/90 text-xs sm:text-sm mb-1 sm:mb-2 max-w-2xl mx-auto">
            Premium celebration fireworks for your special moments. Experience the magic of our exclusive 10*10 Shot celebration function.
          </p>
          
          {/* Special Products Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-1 sm:mb-2">
            {specialProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-1 sm:p-2 border border-white/20">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <Badge className="bg-yellow-400 text-purple-900 font-bold text-xs">
                    Our Special
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                    <span className="text-white text-xs">Premium</span>
                  </div>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-xs">1 Box</span>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm">Rs.{product.price}</div>
                    <div className="text-white/60 text-xs line-through">Rs.{product.originalPrice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to Action Button */}
          <Button 
            onClick={handleShowSpecial}
            className="bg-white text-purple-600 hover:bg-yellow-100 font-bold text-sm px-4 py-2 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              View Special Collection
              <TrendingUp className="w-3 h-3" />
            </div>
          </Button>
        </div>
      </div>

    </div>
  );
}
