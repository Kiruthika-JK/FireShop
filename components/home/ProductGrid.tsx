import { ProductModel } from "@/lib/features/product/domain/models/ProductModel"
import { ProductCard } from "@/components/ProductCard"
import { CategoryBanner } from "./CategoryBanner"
import { ProductPagination } from "@/components/ui/ProductPagination"

interface ProductGridProps {
    products: ProductModel[]
    currentPage?: number
    itemsPerPage?: number
    onPageChange?: (page: number) => void
}

export function ProductGrid({ products, currentPage = 1, itemsPerPage = 12, onPageChange }: ProductGridProps) {
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

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    return (
        <div className="container mx-auto p-4 mt-2">
            {orderedCategories.map((category) => {
                const categoryProducts = paginatedProducts.filter(p => getCatName(p.category) === category);
                const categoryId = category.toLowerCase().replace(/\s+/g, '-');

                return (
                    <CategoryBanner
                        key={category}
                        category={category}
                        productCount={categoryProducts.length}
                        categoryId={categoryId}
                    >
                        {/* Grid View for Products in this Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                            {categoryProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </CategoryBanner>
                )
            })}
            
            {/* Pagination */}
            {onPageChange && (
                <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={products.length}
                />
            )}
        </div>
    )
}
