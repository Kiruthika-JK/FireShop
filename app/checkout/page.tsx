'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/features/cart/store'
import { CustomerInfoSection } from '@/components/checkout/CustomerInfoSection'
import { OrderInfoSection } from '@/components/checkout/OrderInfoSection'
import { PayViaSection } from '@/components/checkout/PayViaSection'
import { OrderItemsSection } from '@/components/checkout/OrderItemsSection'

export default function CheckoutPage() {
    const router = useRouter()
    const { items } = useCartStore()

    // Redirect to cart if no items
    useEffect(() => {
        if (items.length === 0) {
            router.push('/cart')
        }
    }, [items.length, router])

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Redirecting to cart...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 pb-32 lg:pb-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Customer Info & Order Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <CustomerInfoSection />
                        <OrderInfoSection />

                        {/* QR Code - Mobile Only (3rd position) */}
                        <div className="lg:hidden">
                            <PayViaSection />
                        </div>

                        {/* Order Items - Full width on desktop, after QR on mobile */}
                        <div className="lg:col-span-3">
                            <OrderItemsSection />
                        </div>
                    </div>

                    {/* Right Column - QR Code & Confirm Order (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <PayViaSection />

                            {/* Confirm Order Section - Desktop */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        <strong>Payment Confirmation:</strong> Share screenshot to <a href="https://wa.me/918248817401" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-900">8248817401</a>
                                    </p>
                                </div>

                                <button
                                    onClick={() => router.push('/orders')}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer shadow-sm"
                                >
                                    Confirm Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirm Order Section - Mobile Fixed Bottom */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                    <div className="container mx-auto max-w-7xl">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <p className="text-xs text-blue-800 leading-relaxed">
                                <strong>Payment Confirmation:</strong> Share screenshot to <a href="https://wa.me/918248817401" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-900">8248817401</a>
                            </p>
                        </div>

                        <button
                            onClick={() => router.push('/orders')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer shadow-sm"
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
