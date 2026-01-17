import { ProductGrid } from '@/components/home/ProductGrid'
import { PromoBanner } from '@/components/home/PromoBanner'
import { ProductRepo } from '@/lib/features/product/data/repos/ProductRepo'
import { CheckoutFloatingBar } from '@/components/home/CheckoutFloatingBar'

export default function ProductListPage() {
  const productRepo = new ProductRepo()
  const products = productRepo.getProducts()

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-4">

      <PromoBanner />
      <ProductGrid products={products} />
      <CheckoutFloatingBar />
    </main>
  )
}
