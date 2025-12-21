'use client'

import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCartStore } from '@/lib/stores/cart-store'
import { cn } from '@/lib/utils'
import { Product } from '@/lib/types/product'

interface ProductCardProps {
    product: Product
    className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
    const { items, addItem, updateQuantity, removeItem } = useCartStore()
    const cartItem = items.find((i) => i.productId === product.id)
    const quantity = cartItem ? cartItem.quantity : 0

    const handleIncrement = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        })
    }

    const handleDecrement = () => {
        if (quantity > 0) {
            if (quantity === 1) {
                removeItem(product.id)
            } else {
                updateQuantity(product.id, quantity - 1)
            }
        }
    }

    return (
        <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow bg-slate-50 border-input", className)}>
            <div className="flex flex-row sm:flex-col h-full bg-[#EAEBF0] rounded-xl p-2 sm:p-0 gap-4 sm:gap-0 items-center sm:items-stretch">
                {/* Image Container - Fixed size on mobile to match design, full width on desktop */}
                <div className="relative shrink-0 w-[100px] h-[100px] sm:w-full sm:h-48 bg-[#D9D9D9] flex items-center justify-center text-gray-500 rounded-lg sm:rounded-none overflow-hidden">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-xs sm:text-lg opacity-50">600 × 400</span>
                    )}
                </div>

                <div className="flex-1 flex flex-row sm:flex-col justify-between items-center sm:items-start p-2 sm:p-4 w-full">
                    <div className="flex flex-col gap-1 text-left">
                        <h3 className="font-semibold text-slate-800 text-base sm:text-lg">{product.name}</h3>
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                            <span className="text-gray-500 line-through">₹{product.originalPrice.toFixed(1)}</span>
                            <span className="text-green-600 font-bold">₹{product.price.toFixed(1)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-0 sm:mt-4 sm:ml-0 ml-auto sm:w-full sm:justify-between">
                        {/* Desktop: Maybe add "Add to cart" if 0? Design shows counter always. */}
                        <div className="flex items-center gap-2 sm:ml-auto">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-slate-400 bg-transparent hover:bg-slate-200 text-slate-700"
                                onClick={handleDecrement}
                                disabled={quantity === 0}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-4 text-center font-medium text-slate-900">{quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-slate-400 bg-transparent hover:bg-slate-200 text-slate-700"
                                onClick={handleIncrement}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
