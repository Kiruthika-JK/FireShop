'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/features/cart/store'
import { useCustomerInfoStore } from '@/lib/features/checkout/customer-info-store'
import { normalizePhoneNumber } from '@/lib/utils'
import { auth, firestore } from '@/lib/firebase'
import { signInAnonymously } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { CustomerInfoSection } from '@/components/checkout/CustomerInfoSection'
import { PayViaSection } from '@/components/checkout/PayViaSection'
import { OrderItemsSection } from '@/components/checkout/OrderItemsSection'
import { OrderStatus, PaymentStatus } from '@/lib/features/orders/types'

export default function CheckoutPage() {
    const router = useRouter()
    const { customerInfo, isComplete } = useCustomerInfoStore()
    const { total } = useCartStore()
    const { items, clearCart } = useCartStore()
    const { user, loading: authLoading, loginWithGoogle } = useAuth()
    const [isProcessing, setIsProcessing] = useState(false)
    const [isOrderConfirmed, setIsOrderConfirmed] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showErrorDialog, setShowErrorDialog] = useState(false)
    const [isGuestSigningIn, setIsGuestSigningIn] = useState(false)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    // Calculate GST based on location
    const calculateGST = () => {
        const isTNOrPondicherry = customerInfo.state === 'Tamil Nadu' || customerInfo.state === 'Pondicherry'
        const isStateSelected = customerInfo.state && customerInfo.state.trim() !== ''
        if (isTNOrPondicherry || !isStateSelected) {
            return 0
        }
        return Math.round(total * 0.18) // 18% GST
    }

    const gstAmount = calculateGST()
    const grandTotal = total + gstAmount

    // Minimum order based on location
    const minOrder = (customerInfo.state === 'Tamil Nadu' || customerInfo.state === 'Pondicherry') ? 3000 : 6000
    const isStateSelected = !!(customerInfo.state && customerInfo.state.trim() !== '')
    const shortfall = isStateSelected ? Math.max(0, minOrder - total) : 0
    const isBelowMinOrder = isStateSelected && shortfall > 0

    // Do not auto-redirect: wait for hydration and show empty cart message if needed.

    const generateOrderId = () => {
        const now = new Date()
        const pad = (n: number) => n.toString().padStart(2, '0')
        const timestamp = `${now.getFullYear().toString().slice(-2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
        return timestamp
    }

    const handleLogin = async () => {
        try {
            await loginWithGoogle()
        } catch (err) {
            console.error('Google login failed:', err)
            setError('Google login failed. Please try again or continue as guest.')
            setShowErrorDialog(true)
        }
    }

    const handleContinueAsGuest = async () => {
        try {
            setIsGuestSigningIn(true)
            setError(null)
            await signInAnonymously(auth)
        } catch (err: unknown) {
            console.error('Guest sign-in failed:', err)
            const error = err as { code?: string; message?: string } | undefined
            const code = error?.code || 'unknown'
            const errorMessage = error?.message || ''
            const message = code === 'auth/admin-restricted-operation' || code === 'auth/operation-not-allowed'
                ? 'Guest checkout is disabled in Firebase. Please enable Anonymous sign-in in Firebase Console > Authentication > Sign-in method, or login with Google.'
                : `Guest checkout failed (${code}): ${errorMessage || 'Please try again.'}`
            setError(message)
            setShowErrorDialog(true)
        } finally {
            setIsGuestSigningIn(false)
        }
    }

    const handleConfirmOrder = async () => {
        try {
            setError(null)

            // 1. Auth Check: must have a user (either Google or anonymous guest)
            const currentUser = auth.currentUser
            if (!currentUser) {
                setError('Please sign in or continue as guest before placing the order.')
                setShowErrorDialog(true)
                return
            }

            // 2. Validation
            if (!isComplete()) {
                setError('Please complete all customer information fields.')
                setShowErrorDialog(true)
                return
            }

            const minOrder = (customerInfo.state === 'Tamil Nadu' || customerInfo.state === 'Pondicherry') ? 3000 : 6000
            if (total < minOrder) {
                const stateLabel = (customerInfo.state === 'Tamil Nadu' || customerInfo.state === 'Pondicherry')
                    ? 'Tamil Nadu / Pondicherry'
                    : 'your selected state'
                setError(`Minimum order for ${stateLabel} is ₹${minOrder.toLocaleString('en-IN')}. Please add more items before placing the order.`)
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
                gstAmount: gstAmount,
                grandTotal: grandTotal,
                products: items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    discountedPrice: item.price // Assuming price in cart is discounted/final
                })),
                customerInfo: {
                    name: customerInfo.name,
                    mobileNo: normalizePhoneNumber(customerInfo.mobileNumber),
                    emailId: currentUser?.email || '',
                    address: customerInfo.fullAddress,
                    city: customerInfo.city,
                    state: customerInfo.state,
                    pincode: customerInfo.pincode
                },
                userId: currentUser?.uid || '',
                createdAt: new Date().toISOString(),
                status: OrderStatus.Ordered,
                paymentStatus: 'Unpaid' as PaymentStatus,
                paidAmount: 0,
                remainingAmount: grandTotal
            }

            // 5. Upload to Firestore
            await setDoc(doc(firestore, 'orders', orderId), orderData)

            // 6. Customer/Admin emails are handled server-side by Cloud Functions on order creation.

            // 7. Clear Cart & Navigate
            setIsOrderConfirmed(true)
            clearCart()
            router.push(`/order-confirmation/${orderId}`)

        } catch (err) {
            console.error('Order placement failed:', err)
            setError('Failed to place order. Please check your internet connection and try again.')
            setShowErrorDialog(true)
        } finally {
            setIsProcessing(false)
        }
    }

    if (!isHydrated || authLoading || isGuestSigningIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">{isGuestSigningIn ? 'Preparing guest checkout...' : 'Loading checkout...'}</p>
                </div>
            </div>
        )
    }

    if (isOrderConfirmed) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Placing your order...</h2>
                    <p className="text-gray-600">Please wait while we confirm your order.</p>
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some crackers to your cart before checkout.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Sign in to place your order</h1>
                        <p className="text-gray-600 mb-6">
                            Login for a faster checkout, or continue as guest.
                        </p>

                        <Button
                            onClick={handleLogin}
                            className="w-full h-12 text-base flex items-center justify-center gap-3 bg-white text-slate-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Login with Google
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <span className="relative bg-white px-3 text-sm text-gray-500 mx-auto block w-max">or</span>
                        </div>

                        <Button
                            onClick={handleContinueAsGuest}
                            disabled={isGuestSigningIn}
                            variant="outline"
                            className="w-full h-12 text-base"
                        >
                            Continue as guest
                        </Button>

                        <p className="text-sm text-gray-500 mt-6 text-center">
                            No login needed for guest checkout. We only need your phone number and address to deliver your order.
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium"
                        >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Back to shopping
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 pb-48 lg:pb-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Checkout</h1>

                {/* Minimum Order Banner */}
                {(!isStateSelected || isBelowMinOrder) && (
                    <div className={`mb-6 p-4 rounded-xl border ${isBelowMinOrder ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <p className={`text-sm font-medium ${isBelowMinOrder ? 'text-red-800' : 'text-blue-800'}`}>
                            {isStateSelected ? (
                                <>
                                    Minimum order for {customerInfo.state} is ₹{minOrder.toLocaleString('en-IN')}.
                                    <span className="block mt-1">Add items worth ₹{shortfall.toLocaleString('en-IN')} more to place the order.</span>
                                </>
                            ) : (
                                <>
                                    Minimum order: ₹3,000 for Tamil Nadu / Pondicherry and ₹6,000 for other states.
                                    <span className="block mt-1">Select your state in the customer information section to see your exact minimum.</span>
                                </>
                            )}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Customer Info & Shipping */}
                    <div className="lg:col-span-2 space-y-6">
                        <CustomerInfoSection />

                        {/* Shipping Information */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 shadow-sm border border-amber-200">
                            <h2 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12 a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Shipping Information
                            </h2>
                            <div className="space-y-3 text-sm text-amber-800">
                                <p className="font-semibold text-amber-900">⚠️ Important Note:</p>
                                <div className="bg-white rounded-lg p-4 border border-amber-300 mt-3">
                                    <ul className="space-y-2 list-disc list-inside">
                                        <li><strong>Tamil Nadu / Pondicherry:</strong> Delivery charges will be added based on location and can be paid after delivery to the courier partner. No GST applicable for orders within Tamil Nadu and Pondicherry.</li>
                                        <li><strong>Other States:</strong> Flat 18% GST will be added to the order total. Delivery charges must be paid priorly along with the order amount.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary - Mobile Only */}
                        <div className="lg:hidden">
                            <OrderItemsSection />
                        </div>

                        {/* QR Code - Mobile Only */}
                        <div className="lg:hidden">
                            <PayViaSection amount={grandTotal} customer={{ name: customerInfo.name, mobileNumber: customerInfo.mobileNumber }} />
                        </div>
                    </div>

                    {/* Right Column - Order Summary & Payment (Desktop) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <OrderItemsSection />
                            <PayViaSection amount={grandTotal} customer={{ name: customerInfo.name, mobileNumber: customerInfo.mobileNumber }} />

                            {/* Confirm Order Section - Desktop */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-green-800 leading-relaxed mb-3">
                                        <strong>Order & Payment:</strong> You can scan the QR code and send the payment amount. Our team will contact you to confirm. If you have any queries, you can still place your order and text us for payment assistance. Both options available!
                                    </p>
                                    <a
                                        href="https://wa.me/918248817401"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        8248817401
                                    </a>
                                </div>

                                <button
                                    onClick={handleConfirmOrder}
                                    disabled={isProcessing || isBelowMinOrder}
                                    title={isBelowMinOrder ? `Minimum order is ₹${minOrder.toLocaleString('en-IN')}` : undefined}
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
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <p className="text-xs text-green-800 leading-relaxed mb-2">
                                <strong>Order & Payment:</strong> You can scan the QR code and send the payment amount. Our team will contact you to confirm. If you have any queries, you can still place your order and text us for payment assistance. Both options available!
                            </p>
                            <a
                                href="https://wa.me/918248817401"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer text-xs"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                8248817401
                            </a>
                        </div>

                        <button
                            onClick={handleConfirmOrder}
                            disabled={isProcessing || isBelowMinOrder}
                            title={isBelowMinOrder ? `Minimum order is ₹${minOrder.toLocaleString('en-IN')}` : undefined}
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
                        <DialogTitle className="sr-only">Error</DialogTitle>
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
