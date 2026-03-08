import { ProductModel } from "@/lib/features/product/domain/models/ProductModel"
import { ProductCard } from "@/components/ProductCard"

interface ProductGridProps {
    products: ProductModel[]
}

export function ProductGrid({ products }: ProductGridProps) {
    const getCatName = (cat: string) => cat?.trim() ? cat.trim() : 'Unlisted';

    // Extract unique categories preserving the order they appear in the sorted products array
    const categories = Array.from(new Set(products.map(p => getCatName(p.category))));

    // Explicitly push 'Unlisted' to the bottom
    const orderedCategories = categories.filter(c => c !== 'Unlisted');
    if (categories.includes('Unlisted')) {
        orderedCategories.push('Unlisted');
    }

    return (
        <div className="container mx-auto p-4 mt-2">
            {orderedCategories.map((category) => {
                const categoryProducts = products.filter(p => getCatName(p.category) === category);

                return (
                    <section key={category} className="mb-8 relative">
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
