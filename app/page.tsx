import { ProductGrid } from '@/components/home/ProductGrid'
import { ProductRepo } from '@/lib/features/product/data/repos/ProductRepo'
import { CheckoutFloatingBar } from '@/components/home/CheckoutFloatingBar'

export default async function ProductListPage() {
  const productRepo = new ProductRepo()
  const products = await productRepo.getProducts()

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-4">

      <ProductGrid products={products} />
      <CheckoutFloatingBar />
    </main>
  )
}
