'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/features/cart/store'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useEffect } from 'react'

export default function CartPage() {
    const router = useRouter()
    const { items, total, discount, clearCart, updateQuantity, removeItem } = useCartStore()

    const totalOriginalPrice = items.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0)
    const savingsPercentage = totalOriginalPrice > 0 ? Math.round(((totalOriginalPrice - total) / totalOriginalPrice) * 100) : 0

    const CartItemListView = ({ item }: { item: any }) => {
        const itemSavings = item.originalPrice ? item.originalPrice - item.price : 0
        const itemSavingsPercent = item.originalPrice ? Math.round((itemSavings / item.originalPrice) * 100) : 0

        const handleIncrement = () => {
            updateQuantity(item.productId, item.quantity + 1)
        }

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="text-xs">No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 pr-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-xl font-bold text-gray-900">₹{formatPrice(item.price)}</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                                <>
                                    <span className="text-sm text-gray-500 line-through">₹{formatPrice(item.originalPrice)}</span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                        {itemSavingsPercent}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Quantity Controls and Actions */}
                    <div className="flex flex-col items-end gap-2">
                        <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Remove item"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-8 h-8 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <button
                                onClick={handleIncrement}
                                className="w-8 h-8 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                                aria-label="Increase quantity"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-lg font-bold text-gray-900">₹{formatPrice(item.price * item.quantity)}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-64 lg:pb-12">

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        {items.length > 0 && (
                            <p className="text-sm text-green-600 font-medium mt-1">
                                You saved {savingsPercentage}% on this order!
                            </p>
                        )}
                    </div>
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
                        {/* Cart Items - Takes up 3 columns on desktop */}
                        <div className="lg:col-span-3">
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <CartItemListView key={item.productId} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Desktop Price Panel - Sticky Sidebar (Occupies 1 column) */}
                        <div className="hidden lg:block lg:col-span-1 sticky top-24">
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">Price Details</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                                        <span className="text-gray-800 font-medium">₹{formatPrice(totalOriginalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="text-green-600 font-medium">-₹{formatPrice(discount)} ({savingsPercentage}%)</span>
                                    </div>
                                    <div className="border-t border-dashed border-gray-200 my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-semibold text-slate-800">Total Amount</span>
                                        <span className="text-xl font-bold text-green-600">₹{formatPrice(total)}</span>
                                    </div>
                                    {savingsPercentage > 0 && (
                                        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                            <p className="text-sm text-green-800 font-medium">
                                                🎉 You saved {savingsPercentage}% on this order!
                                            </p>
                                        </div>
                                    )}
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
                            <span className="text-green-600 font-medium">-₹{formatPrice(discount)} ({savingsPercentage}%)</span>
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
