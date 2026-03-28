'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/features/cart/store'
import { formatPrice } from '@/lib/utils'
import { ProductCard } from '@/components/ProductCard'
import { ProductModel } from '@/lib/features/product/domain/models/ProductModel'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function CartPage() {
    const router = useRouter()
    const { items, total, discount, clearCart } = useCartStore()

    return (
        <div className="min-h-screen bg-gray-50 pb-64 lg:pb-12">

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    {items.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={clearCart}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Cart
                        </Button>
                    )}
                </div>
                
                {items.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Your cart is empty
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        {/* Cart Items Grid - Takes up 3 columns on desktop */}
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map((item) => {
                                    // Map CartItem to ProductModel for the card
                                    const product: ProductModel = {
                                        id: item.productId,
                                        name: item.name,
                                        price: item.price,
                                        originalPrice: item.originalPrice || item.price,
                                        discountPercent: item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0,
                                        outOfStock: false,
                                        thumbnail: item.thumbnail,
                                        previews: [], // Cart items might not need previews, or we can fetch them if needed. For now empty to satisfy type.
                                        category: '',
                                        categoryPosition: 0,
                                        productPosition: 0
                                    }

                                    return (
                                        <ProductCard
                                            key={item.productId}
                                            product={product}
                                            className="h-full"
                                            variant="checkout"
                                        />
                                    )
                                })}
                            </div>
                        </div>

                        {/* Desktop Price Panel - Sticky Sidebar (Occupies 1 column) */}
                        <div className="hidden lg:block lg:col-span-1 sticky top-24">
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">Price Details</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                                        <span className="text-gray-800 font-medium">₹{formatPrice(total + discount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="text-green-600 font-medium">-₹{formatPrice(discount)}</span>
                                    </div>
                                    <div className="border-t border-dashed border-gray-200 my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-semibold text-slate-800">Total Amount</span>
                                        <span className="text-xl font-bold text-green-600">₹{formatPrice(total)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push('/checkout')}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mt-6 transition-colors shadow-sm cursor-pointer"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Fixed Price Panel */}
            {items.length > 0 && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
                    <div className="max-w-md mx-auto space-y-2">
                        {/* Items Count - Total quantity */}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Items</span>
                            <span className="text-gray-800">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        </div>

                        {/* Total Discount */}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Discount</span>
                            <span className="text-gray-800">₹{formatPrice(discount)}</span>
                        </div>

                        {/* Dashed Separator */}
                        <div className="border-t border-dashed border-gray-300 my-2"></div>

                        {/* Final Price */}
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-slate-800">Final Price</span>
                            <span className="text-2xl font-bold text-green-600">
                                ₹{formatPrice(total)}
                            </span>
                        </div>

                        {/* Place Order Button */}
                        <button
                            onClick={() => router.push('/checkout')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mt-3 transition-colors cursor-pointer"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
