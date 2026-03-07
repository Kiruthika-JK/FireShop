'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/features/cart/store'
import { useCustomerInfoStore } from '@/lib/features/checkout/customer-info-store'
import { auth, firestore } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CustomerInfoSection } from '@/components/checkout/CustomerInfoSection'
import { OrderInfoSection } from '@/components/checkout/OrderInfoSection'
import { PayViaSection } from '@/components/checkout/PayViaSection'
import { OrderItemsSection } from '@/components/checkout/OrderItemsSection'
import { OrderStatus } from '@/lib/features/orders/types'

export default function CheckoutPage() {
    const router = useRouter()
    const { customerInfo, isComplete } = useCustomerInfoStore()
    const { total } = useCartStore()
    const { items, clearCart } = useCartStore()
    const [isProcessing, setIsProcessing] = useState(false)
    const [isOrderConfirmed, setIsOrderConfirmed] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showErrorDialog, setShowErrorDialog] = useState(false)

    // Redirect to cart if no items (skip if order was just confirmed)
    useEffect(() => {
        if (items.length === 0 && !isOrderConfirmed) {
            router.push('/cart')
        }
    }, [items.length, isOrderConfirmed, router])

    const generateOrderId = () => {
        const now = new Date()
        const pad = (n: number) => n.toString().padStart(2, '0')
        const timestamp = `${now.getFullYear().toString().slice(-2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
        return timestamp
    }

    const handleConfirmOrder = async () => {
        try {
            setError(null)

            // 1. Auth Check
            const user = auth.currentUser
            if (!user) {
                // For now, simple alert or let them know payment happens via WhatsApp anyway
                // But requirements said "fetch email from login info", so we must enforce login.
                setError('Please login to place an order.')
                setShowErrorDialog(true)
                return
            }

            // 2. Validation
            if (!isComplete()) {
                setError('Please complete all customer information fields.')
                setShowErrorDialog(true)
                return
            }

            setIsProcessing(true)

            // 3. ID Generation
            const orderId = generateOrderId()

            // 4. Data Preparation
            const orderData = {
                id: orderId,
                totalPrice: total,
                products: items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    discountedPrice: item.price // Assuming price in cart is discounted/final
                })),
                customerInfo: {
                    name: customerInfo.name,
                    mobileNo: customerInfo.mobileNumber,
                    emailId: user.email || '',
                    address: customerInfo.fullAddress,
                    city: customerInfo.city,
                    pincode: customerInfo.pincode
                },
                createdAt: new Date().toISOString(),
                status: OrderStatus.Ordered
            }

            // 5. Upload to Firestore
            await setDoc(doc(firestore, 'orders', orderId), orderData)

            // 6. Clear Cart & Navigate
            setIsOrderConfirmed(true)
            clearCart()
            router.push('/orders')

        } catch (err) {
            console.error('Order placement failed:', err)
            setError('Failed to place order. Please check your internet connection and try again.')
            setShowErrorDialog(true)
        } finally {
            setIsProcessing(false)
        }
    }

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
                            <PayViaSection amount={total} customer={{ name: customerInfo.name, mobileNumber: customerInfo.mobileNumber }} />
                        </div>

                        {/* Order Items - Full width on desktop, after QR on mobile */}
                        <div className="lg:col-span-3">
                            <OrderItemsSection />
                        </div>
                    </div>

                    {/* Right Column - QR Code & Confirm Order (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <PayViaSection amount={total} customer={{ name: customerInfo.name, mobileNumber: customerInfo.mobileNumber }} />

                            {/* Confirm Order Section - Desktop */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        <strong>Payment Confirmation:</strong> Share screenshot to <a href="https://wa.me/918248817401" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-900">8248817401</a>
                                    </p>
                                </div>

                                <button
                                    onClick={handleConfirmOrder}
                                    disabled={isProcessing}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        'Confirm Order'
                                    )}
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
                            onClick={handleConfirmOrder}
                            disabled={isProcessing}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </>
                            ) : (
                                'Confirm Order'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Dialog */}
            <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription className="pt-2">
                            {error}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowErrorDialog(false)}>
                            Try Again
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
