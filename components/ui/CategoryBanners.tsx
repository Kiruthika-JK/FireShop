"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bomb, Sparkles, Flame, Star, Rocket, Package, Gift } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  gradient: string;
  count: number;
}

export function CategoryBanners() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const router = useRouter();

  const categories: Category[] = [
    {
      id: 'sparklers',
      name: 'Sparklers',
      icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Essential for celebrations',
      gradient: 'from-purple-600 to-pink-600',
      count: 18
    },
    {
      id: 'flowerpots',
      name: 'Flower Pots',
      icon: <Flame className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Most popular ground crackers',
      gradient: 'from-yellow-600 to-orange-600',
      count: 32
    },
    {
      id: 'bombs',
      name: 'Bombs',
      icon: <Bomb className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Traditional sound crackers',
      gradient: 'from-red-600 to-orange-600',
      count: 24
    },
    {
      id: 'chakras',
      name: 'Chakras',
      icon: <Star className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Spinning ground crackers',
      gradient: 'from-green-600 to-teal-600',
      count: 21
    },
    {
      id: 'rockets',
      name: 'Rockets',
      icon: <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Sky celebrations',
      gradient: 'from-blue-600 to-cyan-600',
      count: 15
    },
    {
      id: 'aerial',
      name: 'Aerial',
      icon: <Star className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Spectacular sky displays',
      gradient: 'from-indigo-600 to-purple-600',
      count: 35
    },
    {
      id: 'novelty',
      name: 'Novelty',
      icon: <Package className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Kids favorites',
      gradient: 'from-pink-600 to-rose-600',
      count: 25
    },
    {
      id: 'giftbox',
      name: 'Gift Box',
      icon: <Gift className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Complete celebration packs',
      gradient: 'from-amber-600 to-yellow-600',
      count: 4
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to home page with category hash
    router.push(`/#category-${categoryId}`);
    
    // Scroll to category section after navigation
    setTimeout(() => {
      const element = document.getElementById(`category-${categoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Shop by Category
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Quick access to our complete collection
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className={`bg-gradient-to-br ${category.gradient} p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl text-white relative overflow-hidden h-20 sm:h-24 lg:h-28 flex flex-col items-center justify-center text-center`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full blur-xl" />
              </div>

              {/* Icon */}
              <div className="relative z-10 mb-1 sm:mb-2">
                {category.icon}
              </div>

              {/* Name */}
              <div className="relative z-10">
                <h3 className="font-bold text-xs sm:text-sm lg:text-base mb-1">
                  {category.name}
                </h3>
                <p className="text-xs opacity-90 hidden lg:block">
                  {category.count} items
                </p>
              </div>

              {/* Hover Overlay */}
              <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                hoveredCategory === category.id ? 'opacity-100' : 'opacity-0'
              }`} />

              {/* Description on Hover */}
              <div className={`absolute bottom-0 left-0 right-0 bg-black/80 p-2 transform transition-transform duration-300 ${
                hoveredCategory === category.id ? 'translate-y-0' : 'translate-y-full'
              }`}>
                <p className="text-xs text-white text-center">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
