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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

                {/* Desktop Layout: 2 columns with QR on right */}
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

                    {/* Right Column - QR Code (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24">
                            <PayViaSection />
                        </div>
                    </div>
                </div>

                {/* Confirm Order Section */}
                <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-800 leading-relaxed">
                            <strong>Payment Confirmation:</strong> Customer requested to share the payment screenshot to WhatsApp for payment confirmation.
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
    )
}
