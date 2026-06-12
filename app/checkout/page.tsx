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
                setError('Please login to place an order. Or call 📞 +91 8248817401')
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
                gstAmount: gstAmount,
                grandTotal: grandTotal,
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
                    state: customerInfo.state,
                    pincode: customerInfo.pincode
                },
                createdAt: new Date().toISOString(),
                status: OrderStatus.Ordered
            }

            // 5. Upload to Firestore
            await setDoc(doc(firestore, 'orders', orderId), orderData)

            // 6. Send customer confirmation email
            try {
                const { sendEmail } = await import('@/lib/email')
                
                // Generate order confirmation HTML
                const emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">🎆 FireShop</h1>
                            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order Confirmation</p>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <h2 style="color: #333; margin-top: 0;">Thank You for Your Order!</h2>
                            <p style="color: #666; line-height: 1.6;">We've received your order and are processing it. Here are your order details:</p>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                                <h3 style="color: #333; margin-top: 0;">Order #${orderId}</h3>
                                <p style="color: #666; margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                                <p style="color: #666; margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Processing</span></p>
                            </div>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h4 style="color: #333; margin-top: 0;">Delivery Address</h4>
                                <p style="color: #666; margin: 5px 0;">${orderData.customerInfo.name}</p>
                                <p style="color: #666; margin: 5px 0;">${orderData.customerInfo.address}, ${orderData.customerInfo.city}</p>
                                <p style="color: #666; margin: 5px 0;">${orderData.customerInfo.pincode}</p>
                                <p style="color: #666; margin: 5px 0;">📱 ${orderData.customerInfo.mobileNo}</p>
                            </div>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h4 style="color: #333; margin-top: 0;">Order Items (${orderData.products.length} items)</h4>
                                ${orderData.products.map((item: any) => `
                                    <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                                        <p style="color: #333; margin: 5px 0; font-weight: bold;">${item.name}</p>
                                        <p style="color: #666; margin: 5px 0;">Quantity: ${item.quantity} × ₹${item.discountedPrice}</p>
                                    </div>
                                `).join('')}
                                <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #667eea;">
                                    <p style="color: #333; font-size: 18px; font-weight: bold;">Total: ₹${orderData.totalPrice}</p>
                                </div>
                            </div>
                            
                            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                                <p style="color: #856404; margin: 0; font-size: 14px;"><strong>⚠️ Important:</strong> Final price excludes courier charges. You'll need to pay the courier charge directly to the delivery partner.</p>
                            </div>
                            
                            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                                <h4 style="color: #155724; margin-top: 0;">What's Next?</h4>
                                <ol style="color: #155724; margin: 10px 0; padding-left: 20px;">
                                    <li>We'll process your order within 24 hours</li>
                                    <li>You'll receive updates when order status changes</li>
                                    <li>Courier partner will contact you for delivery</li>
                                    <li>Pay courier charge directly to delivery partner</li>
                                </ol>
                            </div>
                            
                            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                                <p style="color: #666; margin: 0; font-size: 14px;">Need help? Contact us:</p>
                                <p style="color: #666; margin: 5px 0;">📧 support@fireshop.com | 📞 +91-XXXXXXXXXX</p>
                            </div>
                        </div>
                    </div>
                `
                
                await sendEmail({
                    to: orderData.customerInfo.emailId,
                    subject: `Order Confirmation - #${orderId}`,
                    html: emailHtml,
                    replyTo: 'orders@fireshop.com'
                })
                
                console.log('Customer confirmation email queued successfully')
            } catch (error) {
                console.error('Error sending customer confirmation:', error)
                // Don't block order completion if notifications fail
            }

            // 7. Clear Cart & Navigate
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
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.P157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        8248817401
                                    </a>
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
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.P157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                8248817401
                            </a>
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
