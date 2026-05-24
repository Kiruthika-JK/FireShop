import { ProductModel } from "@/lib/features/product/domain/models/ProductModel"
import { ProductCard } from "@/components/ProductCard"
import { Badge } from "@/components/ui/badge"
import { ScrollToTop } from "@/components/ui/ScrollToTop"
import { ProductPagination } from "@/components/ui/ProductPagination"

interface EnhancedProductGridProps {
    products: ProductModel[]
    currentPage?: number
    itemsPerPage?: number
    onPageChange?: (page: number) => void
    activeCategory?: string | null
}

export function EnhancedProductGrid({ 
    products, 
    currentPage = 1, 
    itemsPerPage = 12, 
    onPageChange,
    activeCategory 
}: EnhancedProductGridProps) {
    const getCatName = (cat: string) => cat?.trim() ? cat.trim() : 'Unlisted';

    // Define category order based on Indian market priority
    const categoryOrder = [
        'sparklers',
        'flowerpots', 
        'bombs',
        'chakras',
        'rockets',
        'aerial',
        'novelty',
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

    // If active category is selected, filter products by that category
    const filteredProducts = activeCategory 
        ? products.filter(p => getCatName(p.category) === activeCategory)
        : products;

    // Calculate pagination for filtered products
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Group paginated products by category
    const paginatedCategories = Array.from(new Set(paginatedProducts.map(p => getCatName(p.category))))
        .filter(cat => cat !== 'Unlisted')
        .sort((a, b) => {
            const aIndex = categoryOrder.indexOf(a.toLowerCase());
            const bIndex = categoryOrder.indexOf(b.toLowerCase());
            if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
        });

    // Add Unlisted at the end if it exists in paginated products
    if (paginatedCategories.includes('Unlisted')) {
        paginatedCategories.push('Unlisted');
    }

    return (
        <div className="container mx-auto p-4 mt-2">
            {/* Current Category Display */}
            {activeCategory && (
                <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 capitalize">
                                {activeCategory}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Showing {filteredProducts.length} products
                            </p>
                        </div>
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                            {filteredProducts.length} items
                        </Badge>
                    </div>
                </div>
            )}

            {/* Products by Categories */}
            {!activeCategory && paginatedCategories.length > 0 ? (
                paginatedCategories.map((category) => {
                    const categoryProducts = paginatedProducts.filter(p => getCatName(p.category) === category);
                    const categoryId = category.toLowerCase().replace(/\s+/g, '-');

                    return (
                        <div key={category} id={`category-${categoryId}`} className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 capitalize">
                                    {category}
                                </h3>
                                <Badge variant="outline" className="text-sm">
                                    {categoryProducts.length} products
                                </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {categoryProducts.map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </div>
                    );
                })
            ) : (
                // Single category view or all products view
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}

            {/* No Products Found */}
            {paginatedProducts.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                        {activeCategory 
                            ? `No products found in ${activeCategory}` 
                            : 'No products found'
                        }
                    </div>
                </div>
            )}

            {/* Pagination */}
            {onPageChange && totalPages > 1 && (
                <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredProducts.length}
                />
            )}

            {/* Scroll to Top */}
            <ScrollToTop />
        </div>
    );
}
