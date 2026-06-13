"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bomb, Sparkles, Flame, Rocket, Package, Gift, Target, Zap, Flower } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      description: 'Premium Sivakasi electric & color sparklers',
      gradient: 'from-yellow-500 to-red-500',
      count: 15
    },
    {
      id: 'flowerpots',
      name: 'Flower Pots',
      icon: <Flower className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Best Sivakasi bushvanam, poo chakram, malai pookal',
      gradient: 'from-orange-500 to-yellow-500',
      count: 14
    },
    {
      id: 'flowerpotbombs',
      name: 'Flower Pot Bombs',
      icon: <Bomb className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Ganishkha Sri Ganga Jamuna flower pot bombs',
      gradient: 'from-red-500 to-orange-500',
      count: 1
    },
    {
      id: 'chakra',
      name: 'Chakra',
      icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Sivakasi ground chakkar, whizzling wheel',
      gradient: 'from-orange-500 to-yellow-500',
      count: 11
    },
    {
      id: 'peacocks',
      name: 'Peacocks',
      icon: <Flame className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Premium peacock red & green firecrackers',
      gradient: 'from-orange-500 to-yellow-500',
      count: 3
    },
    {
      id: 'pencil',
      name: 'Pencil',
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Sivakasi pencil shots, crackling pencil',
      gradient: 'from-yellow-500 to-red-500',
      count: 7
    },
    {
      id: 'bijili',
      name: 'Bijili',
      icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Ganishkha Sri red bijili, stripped bijili',
      gradient: 'from-orange-500 to-yellow-500',
      count: 2
    },
    {
      id: 'specialcelebrationfunction',
      name: 'Special Celebration Function',
      icon: <Flame className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Ganishkha Sri 10*10 shot celebration function',
      gradient: 'from-red-500 to-orange-500',
      count: 1
    },
    {
      id: 'twinklingstar',
      name: 'Twinkling Star',
      icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Sivakasi 1.5" & 4" twinkling stars',
      gradient: 'from-yellow-500 to-red-500',
      count: 2
    },
    {
      id: 'bombs',
      name: 'Bombs',
      icon: <Bomb className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Premium Sivakasi king bomb, DTX & paper bombs',
      gradient: 'from-orange-600 to-red-600',
      count: 8
    },
    {
      id: 'soundcrackers',
      name: 'Sound Crackers',
      icon: <Bomb className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Ganishkha Sri one sound, two sound crackers',
      gradient: 'from-red-600 to-orange-600',
      count: 7
    },
    {
      id: 'rockets',
      name: 'Rockets',
      icon: <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Best Sivakasi musical & sky rockets',
      gradient: 'from-orange-500 to-red-500',
      count: 4
    },
    {
      id: 'aerialshot',
      name: 'Aerial Shot',
      icon: <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Ganishkha Sri sky wala, star world, multi-shot',
      gradient: 'from-red-500 to-yellow-500',
      count: 28
    },
    {
      id: 'tinseries',
      name: 'TIN Series',
      icon: <Package className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Sivakasi 6" water queen, festival party',
      gradient: 'from-orange-500 to-red-500',
      count: 3
    },
    {
      id: 'whistlingfountain',
      name: 'Whistling Fountain',
      icon: <Flame className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Ganishkha Sri siren, mega siren',
      gradient: 'from-yellow-500 to-red-500',
      count: 2
    },
    {
      id: 'cracklingfountain',
      name: 'Crackling Fountain',
      icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Premium Sivakasi colour, crackling, mega & double wonder fountains',
      gradient: 'from-orange-500 to-yellow-500',
      count: 40
    },
    {
      id: 'digitalwala',
      name: 'Digital Wala',
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Ganishkha Sri magic whip, kungfu deluxe',
      gradient: 'from-red-500 to-orange-500',
      count: 2
    },
    {
      id: 'childrennovelty',
      name: 'Children Novelty',
      icon: <Gift className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Best Sivakasi photo flash, helicopter, drone',
      gradient: 'from-yellow-500 to-red-500',
      count: 19
    },
    {
      id: 'giftbox',
      name: 'Gift Boxes',
      icon: <Gift className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Ganishkha Sri 25, 32, 42 & 50 items combo packs',
      gradient: 'from-amber-600 to-yellow-600',
      count: 4
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    // Find the category name from the category ID
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      // Generate the same category ID format as SinglePageProductGrid
      const categoryHash = category.name.toLowerCase().replace(/\s+/g, '-');
      router.push(`/#category-${categoryHash}`);
      
      // Scroll to category section after navigation
      setTimeout(() => {
        const element = document.getElementById(`category-${categoryHash}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            id={`category-${category.id}`}
            className={`relative overflow-hidden rounded-xl p-6 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${category.gradient} text-white border-2 border-white/30 shadow-xl`}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => handleCategoryClick(category.id)}
          >
            {/* Enhanced Diwali-themed Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-3-2.5-5.5-5.5-5.5S9 17 9 20s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5zm0 20c0-3-2.5-5.5-5.5-5.5S9 37 9 40s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5zm20 0c0-3-2.5-5.5-5.5-5.5S29 37 29 40s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5zm20-20c0-3-2.5-5.5-5.5-5.5S29 17 29 20s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
            
            {/* Animated Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 animate-pulse"></div>
            
            {/* Enhanced Diwali Sparkle Overlay */}
            <div className="absolute inset-0">
              <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse shadow-lg shadow-yellow-300/50"></div>
              <div className="absolute bottom-3 left-3 w-2 h-2 bg-orange-300 rounded-full animate-pulse delay-150 shadow-lg shadow-orange-300/50"></div>
              <div className="absolute top-6 left-8 w-2 h-2 bg-red-300 rounded-full animate-pulse delay-300 shadow-lg shadow-red-300/50"></div>
              <div className="absolute top-4 right-8 w-1 h-1 bg-pink-300 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-6 right-4 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700"></div>
              <div className="absolute top-8 left-4 w-1 h-1 bg-cyan-300 rounded-full animate-pulse delay-1000"></div>
            </div>
            
            {/* Diwali Color Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-red-500/10 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/30`}>
                  {category.icon}
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 shadow-lg">
                  {category.count} items
                </Badge>
              </div>

              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                {category.name}
              </h3>
              
              <p className="text-sm opacity-90 bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent">
                {category.description}
              </p>
            </div>

            {/* Description on Hover */}
            <div className={`absolute bottom-0 left-0 right-0 bg-black/80 p-4 transform transition-transform duration-300 ${
              hoveredCategory === category.id ? 'translate-y-0' : 'translate-y-full'
            }`}>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">{category.name}</h3>
              <p className="text-sm opacity-90 bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
