'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/features/cart/store'
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel'

export function AddToCartButton({ product }: { product: ProductModel }) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      thumbnail: product.thumbnail
    })
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={product.outOfStock}
      className="w-full py-3 text-lg font-semibold"
      size="lg"
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      {product.outOfStock ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  )
}
