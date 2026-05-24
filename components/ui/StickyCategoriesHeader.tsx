'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, Menu, X, Flame } from 'lucide-react';

interface Category {
  name: string;
  count: number;
  id: string;
}

interface StickyCategoriesHeaderProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
}

export function StickyCategoriesHeader({ categories, activeCategory, onCategoryClick }: StickyCategoriesHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Always visible - no scroll detection needed
    setIsVisible(true);
  }, []);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 120; // Account for sticky header with increased padding with increased padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    onCategoryClick?.(categoryId);
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Desktop Sticky Header */}
      <div className="hidden md:block fixed top-18 left-0 right-0 z-40 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-sm border-b border-yellow-600 shadow-lg">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              size="sm"
              className="flex items-center gap-2 bg-white/20 text-gray-900 hover:bg-white/30 border-white/30 transition-all duration-300 font-bold px-4 py-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
              Categories
            </Button>
            <Button
              onClick={() => {
                const element = document.getElementById('trending-products')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              size="sm"
              className="flex items-center gap-2 bg-white/20 text-gray-900 hover:bg-white/30 border-white/30 transition-all duration-300 font-bold px-4 py-2"
            >
              <Flame className="w-4 h-4" />
              Show Best Sellers
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      {isMobileMenuOpen && (
        <div className="hidden md:block fixed top-22 left-0 right-0 z-40 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-sm border-b border-yellow-600 shadow-lg">
          <div className="container mx-auto px-6 py-6 max-h-80 overflow-y-auto">
            <div className="grid grid-cols-4 gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  size="sm"
                  onClick={() => scrollToCategory(category.id)}
                  className={`justify-between text-left h-12 px-4 font-bold transition-all duration-300 hover:scale-105 ${
                    activeCategory === category.id 
                      ? "bg-white text-orange-600 shadow-lg" 
                      : "bg-white/20 text-gray-900 hover:bg-white/30 border-white/30"
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <Badge className={`text-xs font-bold ${
                    activeCategory === category.id 
                      ? "bg-orange-100 text-orange-600" 
                      : "bg-white/30 text-gray-900"
                  }`}>
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Header */}
      <div className="md:hidden fixed top-18 left-0 right-0 z-40 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-sm border-b border-yellow-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              size="sm"
              className="flex items-center gap-2 bg-white/20 text-gray-900 hover:bg-white/30 border-white/30 transition-all duration-300 font-bold px-3 py-2 text-xs"
            >
              {isMobileMenuOpen ? (
                <X className="w-3 h-3" />
              ) : (
                <Menu className="w-3 h-3" />
              )}
              Categories
            </Button>
            <Button
              onClick={() => {
                const element = document.getElementById('trending-products')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              size="sm"
              className="flex items-center gap-1 bg-white/20 text-gray-900 hover:bg-white/30 border-white/30 transition-all duration-300 font-bold px-3 py-2 text-xs"
            >
              <Flame className="w-3 h-3" />
              Best Sellers
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-18 left-0 right-0 z-40 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-sm border-b border-yellow-600 shadow-lg">
          <div className="container mx-auto px-4 py-4 max-h-72 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  size="sm"
                  onClick={() => scrollToCategory(category.id)}
                  className={`justify-between text-left h-10 px-3 font-bold transition-all duration-300 hover:scale-105 ${
                    activeCategory === category.id 
                      ? "bg-white text-orange-600 shadow-lg" 
                      : "bg-white/20 text-gray-900 hover:bg-white/30 border-white/30"
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <Badge className={`text-xs font-bold ${
                    activeCategory === category.id 
                      ? "bg-orange-100 text-orange-600" 
                      : "bg-white/30 text-gray-900"
                  }`}>
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
