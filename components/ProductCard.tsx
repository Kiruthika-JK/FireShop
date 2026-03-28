'use client'

import { useRef } from 'react'
import { Plus, Minus, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { useCartStore } from '@/lib/features/cart/store'
import { mergeClasses, formatPrice } from '@/lib/utils'
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel'

interface ProductCardProps {
    product: ProductModel
    className?: string
    variant?: 'purchase' | 'checkout'
}

export function ProductCard({ product, className, variant = 'purchase' }: ProductCardProps) {
    const router = useRouter()
    const { items, addItem, updateQuantity, removeItem } = useCartStore()
    const cartItem = items.find((i) => i.productId === product.id)
    const quantity = cartItem ? cartItem.quantity : 0

    const handleIncrement = (event?: React.MouseEvent) => {
        // Trigger sparkle explosion at click coordinates
        if (event && (window as any).addClickSparkle) {
            const rect = (event.target as HTMLElement).getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            (window as any).addClickSparkle(x, y);
        }

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            quantity: 1,
            thumbnail: product.thumbnail
        });
    }

    const timerRef = useRef<any>(null);
    const isLongPress = useRef(false);

    const handleLongPressStart = () => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            removeItem(product.id);
        }, 600);
    };

    const handleLongPressEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    const handleDecrementClick = () => {
        if (isLongPress.current) {
            return;
        }
        handleDecrement();
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            if (quantity === 1) {
                removeItem(product.id)
            } else {
                updateQuantity(product.id, quantity - 1)
            }
        }
    }

    // Purchase Variant Content (Browsing)
    const renderPurchaseContent = () => (
        <div className="flex items-center gap-2 text-sm sm:text-base">
            <span className="text-gray-500 line-through">₹{formatPrice(product.originalPrice)}</span>
            <span className="text-green-600 font-bold">₹{formatPrice(product.price)}</span>
        </div>
    )

    // Checkout Variant Content (Cart)
    const renderCheckoutContent = () => (
        <div className="flex items-center justify-between w-full mt-1">
            <div className="text-sm text-gray-500">
                ₹{formatPrice(product.price)} × {quantity}
            </div>
            <div className="text-green-600 font-bold">
                ₹{formatPrice(product.price * (quantity || 1))}
            </div>
        </div>
    )

    return (
        <Card className={mergeClasses("overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white border-input p-0 transform hover:scale-105 hover:border-yellow-400/50 relative", className)}>
            {/* Sparkle effect for special products */}
            {product.discountPercent > 20 && (
                <div className="absolute top-2 right-2 z-10">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                </div>
            )}
            
            <div className="flex flex-row sm:flex-col h-full bg-white rounded-xl p-2 sm:p-0 gap-4 sm:gap-0 items-center sm:items-stretch">
                {/* Image Container */}
                <div
                    className="relative shrink-0 w-[100px] h-[100px] sm:w-full sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 rounded-lg sm:rounded-none overflow-hidden cursor-pointer group"
                    onClick={() => {
                        const urlsToPass = product.previews && product.previews.length > 0
                            ? product.previews
                            : (product.thumbnail ? [product.thumbnail] : []);

                        if (urlsToPass.length > 0) {
                            const params = new URLSearchParams()
                            urlsToPass.forEach(url => params.append('url', url))
                            router.push(`/product/${product.id}/preview?${params.toString()}`)
                        }
                    }}
                >
                    {product.thumbnail ? (
                        <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    ) : (
                        <span className="text-xs sm:text-lg opacity-50">600 × 400</span>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="flex-1 flex flex-row sm:flex-col justify-between items-center sm:items-start p-2 sm:p-4 w-full">
                    {variant === 'purchase' ? (
                        <>
                            <div className="flex flex-col gap-1 text-left w-full h-full justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-base sm:text-lg">{product.name}</h3>
                                    {renderPurchaseContent()}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-0 sm:mt-4 sm:ml-0 ml-auto sm:w-full sm:justify-between">
                                <div className="flex items-center gap-2 sm:ml-auto">
                                    <AnimatedButton
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full border-slate-400 bg-transparent hover:bg-slate-200 text-slate-700 select-none hover:scale-110 transition-transform"
                                        onClick={handleDecrementClick}
                                        onMouseDown={handleLongPressStart}
                                        onMouseUp={handleLongPressEnd}
                                        onMouseLeave={handleLongPressEnd}
                                        onTouchStart={handleLongPressStart}
                                        onTouchEnd={handleLongPressEnd}
                                        disabled={quantity === 0}
                                        sparkle={quantity > 0}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </AnimatedButton>
                                    <span className="w-4 text-center font-medium text-slate-900 font-bold">{quantity}</span>
                                    <AnimatedButton
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full border-slate-400 bg-transparent hover:bg-slate-200 text-slate-700 hover:scale-110 transition-transform"
                                        onClick={(e) => handleIncrement(e)}
                                        sparkle={true}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </AnimatedButton>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Checkout Variant Layout
                        <div className="flex flex-col w-full h-full justify-center">
                            <h3 className="font-semibold text-slate-800 text-base sm:text-lg mb-1">{product.name}</h3>
                            <div className="flex items-center justify-between w-full mt-1">
                                <div className="text-sm text-gray-500">
                                    ₹{formatPrice(product.price)} × {quantity}
                                </div>
                                <div className="text-green-600 font-bold text-lg">
                                    ₹{formatPrice(product.price * (quantity || 1))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}
