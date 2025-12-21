import { PRODUCTS } from '@/lib/data/products'
import { ProductGrid } from '@/components/home/ProductGrid'
import { PromoBanner } from '@/components/home/PromoBanner'

export default function ProductListPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header matching the image style */}
      <div className="bg-[#E6EAF8] px-4 py-5 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto">
          <h1 className="text-slate-700 font-medium text-xl">Firecrackers</h1>
        </div>
      </div>

      <PromoBanner />
      <ProductGrid products={PRODUCTS} />
    </main>
  )
}
