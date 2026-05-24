'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, Menu, X } from 'lucide-react';

interface Category {
  name: string;
  count: number;
  id: string;
}

interface FixedCategoriesNavProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
}

export function FixedCategoriesNav({ categories, activeCategory, onCategoryClick }: FixedCategoriesNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 80; // Account for fixed header
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
      {/* Desktop Fixed Navigation */}
      <div className="hidden md:block fixed top-20 right-4 z-40 bg-white rounded-lg shadow-lg border p-2 max-w-xs">
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-sm font-medium text-gray-700">Categories</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={scrollToTop}
            className="h-6 w-6 p-0"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToCategory(category.id)}
              className="w-full justify-start text-left h-8 px-2"
            >
              <span className="truncate">{category.name}</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div className="md:hidden fixed bottom-24 right-4 z-40">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          size="sm"
          className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
          aria-label="Categories menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 bottom-32 top-20 z-40 bg-white rounded-lg shadow-lg border p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-gray-900">Categories</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={scrollToTop}
              className="h-8 w-8 p-0"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-5 h-5" />
            </Button>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() => scrollToCategory(category.id)}
                className="w-full justify-between text-left h-10 px-3"
              >
                <span className="truncate">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
