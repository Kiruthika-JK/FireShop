import { ProductModel } from "@/lib/features/product/domain/models/ProductModel"
import { ProductCard } from "@/components/ProductCard"

interface ProductGridProps {
    products: ProductModel[]
}

export function ProductGrid({ products }: ProductGridProps) {
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

    return (
        <div className="container mx-auto p-4 mt-2">
            {orderedCategories.map((category) => {
                const categoryProducts = products.filter(p => getCatName(p.category) === category);
                const categoryId = category.toLowerCase().replace(/\s+/g, '-');

                return (
                    <section key={category} id={`category-${categoryId}`} className="mb-8 relative scroll-mt-20">
                        {/* Sticky Category Header */}
                        <div className="sticky top-0 z-10 bg-primary/10 backdrop-blur-md rounded-lg shadow-sm py-3 mb-4 border border-primary/20">
                            <h2 className="text-xl font-bold px-4 capitalize tracking-wide text-primary-foreground">{category.toLowerCase()}</h2>
                        </div>

                        {/* Grid View for Products in this Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {categoryProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )
            })}
        </div>
    )
}
