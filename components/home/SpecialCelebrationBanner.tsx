'use client';

import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SpecialCelebrationBannerProps {
  productCount: number;
}

export function SpecialCelebrationBanner({ productCount }: SpecialCelebrationBannerProps) {
  const handleClick = () => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById('category-special-celebration-function');
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 mb-6">
      <div className="max-w-4xl mx-auto relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg p-4 sm:p-5 border border-red-200">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-lg bg-white/20 backdrop-blur-sm shrink-0">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold truncate">
              Special Celebration Function
            </h3>
            <p className="text-xs sm:text-sm opacity-90 truncate">
              10x10 shot celebration function - {productCount} items available
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleClick}
            className="bg-white text-red-600 hover:bg-gray-100 shadow-sm shrink-0"
          >
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  );
}
