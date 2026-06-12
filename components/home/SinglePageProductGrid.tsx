import { ProductModel } from "@/lib/features/product/domain/models/ProductModel"
import { ProductCard } from "@/components/ProductCard"
import { Badge } from "@/components/ui/badge"
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { mergeClasses } from '@/lib/utils'

interface SinglePageProductGridProps {
    products: ProductModel[]
    activeCategory?: string | null
}

export function SinglePageProductGrid({ products, activeCategory }: SinglePageProductGridProps) {
    const getCatName = (cat: string) => {
        if (!cat?.trim()) return 'Unlisted';
        
        // Map category IDs to display names
        const categoryMap: { [key: string]: string } = {
            'sparklers': 'Sparklers',
            'flowerpots': 'Flower Pots',
            'flowerpotbombs': 'Flower Pot Bombs',
            'chakra': 'Chakra',
            'peacocks': 'Peacocks',
            'pencil': 'Pencil',
            'bijili': 'Bijili',
            'twinklingstar': 'Twinkling Star',
            'specialcelebrationfunction': 'Special Celebration Function',
            'bombs': 'Bombs',
            'soundcrackers': 'Sound Crackers',
            'rockets': 'Rockets',
            'aerialshot': 'Aerial Shot',
            'tinseries': 'TIN Series',
            'whistlingfountain': 'Whistling Fountain',
            'cracklingfountain': 'Crackling Fountain',
            'digitalwala': 'Digital Wala',
            'childrennovelty': 'Children Novelty',
            'giftbox': 'Gift Boxes'
        };
        
        return categoryMap[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
    };

    // Get unique category IDs from products
    const availableCategoryIds = Array.from(new Set(products.map(p => p.category))).filter(cat => cat && cat.trim() !== '');

    // Get display categories
    const displayCategories = Array.from(new Set(products.map(p => getCatName(p.category)))).filter(cat => cat !== 'Unlisted');

    // Initialize with all categories expanded by default
    const [expandedCategories, setExpandedCategories] = useState<string[]>(displayCategories);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    };

    // Define category order based on Indian market priority
    const categoryOrder = [
        'sparklers',
        'flowerpots',
        'flowerpotbombs',
        'chakra',
        'peacocks',
        'pencil',
        'bijili',
        'twinklingstar',
        'specialcelebrationfunction',
        'bombs',
        'soundcrackers',
        'rockets',
        'aerialshot',
        'tinseries',
        'whistlingfountain',
        'cracklingfountain',
        'digitalwala',
        'childrennovelty',
        'giftbox'
    ];

    // Order category IDs according to Indian market priority
    const orderedCategoryIds = categoryOrder
        .filter(catId => availableCategoryIds.includes(catId))
        .concat(availableCategoryIds.filter(catId => !categoryOrder.includes(catId)));

    // Convert ordered category IDs to display names
    const sortedCategories = orderedCategoryIds.map(catId => getCatName(catId)).filter(cat => cat !== 'Unlisted');

    // Show all products, no filtering
    const allProducts = products;

    
    return (
        <div className="mt-2">
            {/* Products by Categories */}
            {sortedCategories.map((category) => {
                const categoryProducts = allProducts.filter(p => getCatName(p.category) === category);
                // Sort products: best sellers first, then by name
                const sortedCategoryProducts = [...categoryProducts].sort((a, b) => {
                    if (a.trending && !b.trending) return -1;
                    if (!a.trending && b.trending) return 1;
                    return a.name.localeCompare(b.name);
                });
                const categoryId = category.toLowerCase().replace(/\s+/g, '-');

                return (
                    <div key={category} id={`category-${categoryId}`} className="mb-8">
                        <div 
                            onClick={() => toggleCategory(category)}
                            className={`relative overflow-hidden rounded-2xl shadow-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-3xl ${
                            category === 'Sparklers' ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white border-red-300/50' :
                            category === 'Flower Pots' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-300/50' :
                            category === 'Flower Pot Bombs' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-300/50' :
                            category === 'Chakra' ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white border-green-300/50' :
                            category === 'Peacocks' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-300/50' :
                            category === 'Ground Chakkars' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-300/50' :
                            category === 'Pencil' ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white border-yellow-300/50' :
                            category === 'Bijili' ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-orange-300/50' :
                            category === 'Twinkling Star' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-300/50' :
                            category === 'Special Celebration Function' ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white border-yellow-300/50' :
                            category === 'Bombs' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-orange-300/50' :
                            category === 'Sound Crackers' ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-red-300/50' :
                            category === 'Rockets' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-300/50' :
                            category === 'Aerial Shot' ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white border-red-300/50' :
                            category === 'TIN Series' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-300/50' :
                            category === 'Whistling Fountain' ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white border-yellow-300/50' :
                            category === 'Crackling Fountain' ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-orange-300/50' :
                            category === 'Digital Wala' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-300/50' :
                            category === 'Children Novelty' ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white border-yellow-300/50' :
                            category === 'Gift Boxes' ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-amber-300/50' :
                            'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-300/50'
                        }`}
                            aria-label={`${expandedCategories.includes(category) ? 'Collapse' : 'Expand'} ${category} category`}
                        >
                            <div className="flex items-center justify-between w-full px-4 sm:px-6 py-3 sm:py-4">
                                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                    <h3 className="text-base sm:text-xl font-bold drop-shadow-lg truncate">
                                        {category}
                                    </h3>
                                    <Badge className="text-xs sm:text-sm bg-white/20 text-white border-white/30 font-semibold flex-shrink-0">
                                        {categoryProducts.length}
                                    </Badge>
                                </div>
                                <div className="text-white/80 p-1.5 sm:p-2 rounded-full bg-white/10 flex-shrink-0 ml-2">
                                    {expandedCategories.includes(category) ? (
                                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            expandedCategories.includes(category)
                                ? 'max-h-none opacity-100'
                                : 'max-h-0 opacity-0'
                        }`}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                                {sortedCategoryProducts.map(p => (
                                    <ProductCard key={p.id} product={p} variant="compact" />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            
            })}
        </div>
    );
}
