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

    // Get unique categories from products
    const availableCategories = Array.from(new Set(products.map(p => getCatName(p.category))));
    
    // Order categories according to Indian market priority
    const orderedCategories = categoryOrder
        .filter(cat => availableCategories.includes(cat))
        .concat(availableCategories.filter(cat => !categoryOrder.includes(cat) && cat !== 'Unlisted'));
    
    // Add Unlisted at the end if it exists
    if (availableCategories.includes('Unlisted')) {
        orderedCategories.push('Unlisted');
    }

    // Show all products, no filtering
    const allProducts = products;

    // Sort display categories according to category order
    const sortedCategories = displayCategories.sort((a, b) => {
        const aIndex = categoryOrder.indexOf(a.toLowerCase());
        const bIndex = categoryOrder.indexOf(b.toLowerCase());
        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });

    
    return (
        <div className="mt-2">
            {/* Products by Categories */}
            {sortedCategories.map((category) => {
                const categoryProducts = allProducts.filter(p => getCatName(p.category) === category);
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
                            <div className="flex items-center justify-between w-full px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-bold drop-shadow-lg">
                                        {category}
                                    </h3>
                                    <Badge className="text-sm bg-white/20 text-white border-white/30 font-semibold">
                                        {categoryProducts.length} products
                                    </Badge>
                                </div>
                                <div className="text-white/80 p-2 rounded-full bg-white/10">
                                    {expandedCategories.includes(category) ? (
                                        <ChevronUp className="w-5 h-5" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5" />
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            expandedCategories.includes(category) 
                                ? 'max-h-[2000px] opacity-100' 
                                : 'max-h-0 opacity-0'
                        }`}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 px-4 sm:px-6 py-4">
                                {categoryProducts.map(p => (
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
