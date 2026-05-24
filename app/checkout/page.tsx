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
