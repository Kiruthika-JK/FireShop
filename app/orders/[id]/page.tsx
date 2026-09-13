'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderService } from '@/lib/features/orders/service'
import { Order } from '@/lib/features/orders/types'
import { useAuth } from '@/lib/auth-context'
import { Loader2 } from 'lucide-react'
import { OrderTracker } from '@/components/orders/OrderTracker'
import { OrderStatusUpdate } from '@/components/orders/OrderStatusUpdate'
import { PaymentStatusUpdate } from '@/components/orders/PaymentStatusUpdate'
import { DeliveryAddressCard } from '@/components/orders/DeliveryAddressCard'
import { OrderItemsList } from '@/components/orders/OrderItemsList'
import { PayViaSection } from '@/components/checkout/PayViaSection'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice, normalizePhoneNumber } from '@/lib/utils'
import { buildGmailComposeUrl, buildWhatsAppAcknowledgeUrl, getStatusColor } from '@/lib/features/orders/utils'

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { user, isAdmin, loading: authLoading } = useAuth()
    const { id } = React.use(params)
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [phoneInput, setPhoneInput] = useState('')
    const [verifiedPhone, setVerifiedPhone] = useState('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedVerified = sessionStorage.getItem(`order-phone-${id}`) || ''
            const guestPhone = normalizePhoneNumber(sessionStorage.getItem('guest-order-phone') || '')
            if (savedVerified) {
                setVerifiedPhone(savedVerified)
            } else if (guestPhone) {
                setVerifiedPhone(guestPhone)
            }
        }
    }, [id])

    useEffect(() => {
        if (!authLoading) {
            loadOrder()
        }
    }, [authLoading, id])

    const loadOrder = async () => {
        try {
            setLoading(true)
            const data = await OrderService.getOrderById(id)
            setOrder(data || null)
        } catch (error) {
            console.error("Failed to load order:", error)
        } finally {
            setLoading(false)
        }
    }

    const isAuthorized = order && (
        isAdmin ||
        order.customerInfo.emailId === user?.email ||
        order.userId === user?.uid ||
        (verifiedPhone && order.customerInfo.mobileNo === verifiedPhone)
    )

    const handlePhoneVerify = (e: React.FormEvent) => {
        e.preventDefault()
        const normalized = normalizePhoneNumber(phoneInput)
        setVerifiedPhone(normalized)
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(`order-phone-${id}`, normalized)
        }
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return new Intl.DateTimeFormat('en-GB', {
                day: 'numeric',
                month: 'short',
                year: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).format(date).replace(',', '')
        } catch (e) {
            return 'Invalid Date'
        }
    }

    const openAcknowledgeMail = () => {
        if (!order) return
        if (order.customerInfo.emailId) {
            window.open(buildGmailComposeUrl(order), '_blank', 'noopener,noreferrer')
        } else {
            window.open(buildWhatsAppAcknowledgeUrl(order), '_blank', 'noopener,noreferrer')
        }
    }

    if (authLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">Order not found.</p>
                <button onClick={() => router.push('/orders')} className="text-primary hover:underline">Return to Orders</button>
            </div>
        )
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Card className="p-8 max-w-sm w-full text-center">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Verify to View Order</h2>
                    <p className="text-gray-600 mb-6">Enter the mobile number used while placing this order.</p>
                    <form onSubmit={handlePhoneVerify} className="flex flex-col gap-3">
                        <Input
                            type="tel"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            placeholder="Enter mobile number"
                            className="text-center"
                        />
                        <Button type="submit" className="w-full">Verify</Button>
                    </form>
                </Card>
            </div>
        )
    }

    const StatusBadgeRow = () => (
        <div className="flex justify-between items-center mb-6">
            <div>
                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                <p className="font-semibold text-slate-800">{order.id}</p>
            </div>
            <Badge className={`${getStatusColor(order.status)} shadow-none px-3 py-1 font-medium`}>
                {order.status}
            </Badge>
        </div>
    )

    const OrderMetaInfo = () => (
        <div className="flex flex-wrap gap-y-4 justify-between border-t border-gray-100 pt-4 mt-4">
            <div>
                <p className="text-xs text-gray-400">Order Date</p>
                <p className="text-sm font-medium text-slate-700">{formatDate(order.createdAt)}</p>
            </div>
            <div>
                <p className="text-xs text-gray-400">Items</p>
                <p className="text-sm font-medium text-slate-700">{order.products.reduce((acc, p) => acc + p.quantity, 0)}</p>
            </div>
            <div>
                <p className="text-xs text-gray-400">Total Value</p>
                <p className="text-sm font-bold text-green-600">₹{formatPrice(order.totalPrice)}</p>
            </div>
        </div>
    )

    const customerModelInfo = {
        name: order.customerInfo.name,
        mobileNumber: order.customerInfo.mobileNo
    }

    const currentPaymentStatus = order.paymentStatus || 'Unpaid'
    const showPayment = (order.status === 'Ordered' || order.status === 'Processing') &&
        currentPaymentStatus !== 'Fully Paid'
    const paymentAmount = order.remainingAmount ?? order.grandTotal ?? order.totalPrice

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">

                    {/* MOBILE LAYOUT & COLUMN ORDER */}
                    {/* On Desktop, left column (col-span-2) is Items List. Right column (col-span-1) is Tracker, Deliver To, PayVia. */}

                    {/* Left Column (Desktop) */}
                    <div className="lg:col-span-2 space-y-6 order-4 lg:order-1">
                        <OrderItemsList items={order.products} totalAmount={order.totalPrice} />
                    </div>

                    {/* Right Column (Desktop) */}
                    <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
                        {/* 1. Tracker or Badge Card */}
                        <Card className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            {isAdmin ? <StatusBadgeRow /> : (
                                <>
                                    <h2 className="text-lg font-semibold text-slate-800 mb-2 border-b border-gray-100 pb-2">Order Summary</h2>
                                    <div className="mb-2">
                                        <p className="text-xs text-gray-500 mb-1">Order ID</p>
                                        <p className="font-medium text-slate-800 text-sm">{order.id} <span className="text-xs text-gray-400 ml-2">({order.products.reduce((acc, p) => acc + p.quantity, 0)} items)</span></p>
                                    </div>
                                    <div className="mb-0">
                                        <OrderTracker status={order.status} />
                                    </div>
                                    {order.adminComment && (
                                        <div className="mt-1 bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                                            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">Message from Admin</p>
                                            <p className="text-sm text-blue-900 leading-relaxed">{order.adminComment}</p>
                                        </div>
                                    )}
                                </>
                            )}
                            <OrderMetaInfo />
                        </Card>

                        {/* 2. Admin Status Update */}
                        {isAdmin && (
                            <div className="space-y-4">
                                <OrderStatusUpdate
                                    orderId={order.id}
                                    currentStatus={order.status}
                                    onUpdateComplete={(newStatus, comment) => setOrder({ ...order, status: newStatus, adminComment: comment || order.adminComment })}
                                />
                                <PaymentStatusUpdate
                                    order={order}
                                    onUpdateComplete={(paymentStatus, paidAmount, remainingAmount) =>
                                        setOrder({ ...order, paymentStatus, paidAmount, remainingAmount })
                                    }
                                />
                                <div className="rounded-lg border border-slate-200 bg-white p-4">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Customer Acknowledge</p>
                                    <Button
                                        type="button"
                                        className="w-full"
                                        onClick={openAcknowledgeMail}
                                        disabled={!order.customerInfo.emailId && !order.customerInfo.mobileNo}
                                    >
                                        {order.customerInfo.emailId ? 'Send Acknowledge Mail' : 'Send WhatsApp Acknowledge'}
                                    </Button>
                                    <p className="text-xs text-slate-500 mt-2 break-all">
                                        To: {order.customerInfo.emailId || `+91 ${order.customerInfo.mobileNo}`}
                                    </p>
                                </div>
                                {order.adminComment && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Latest Reason</p>
                                        <p className="text-sm text-slate-700 italic">&quot;{order.adminComment}&quot;</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. Delivery Address */}
                        <DeliveryAddressCard customerInfo={order.customerInfo} />

                        {/* 4. Pay Via Section (Hidden on Mobile here, shown at bottom) */}
                        {/* Payment Info for Customer */}
                        {!isAdmin && (
                            <Card className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">Payment Details</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className="font-semibold text-slate-800">{currentPaymentStatus}</span>
                                    </div>
                                    {order.paidAmount !== undefined && order.paidAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Paid Amount</span>
                                            <span className="font-semibold text-green-600">₹{formatPrice(order.paidAmount)}</span>
                                        </div>
                                    )}
                                    {paymentAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{'Remaining Amount'}</span>
                                            <span className="font-semibold text-slate-800">₹{formatPrice(paymentAmount)}</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* 4. Pay Via Section (Hidden on Mobile here, shown at bottom) */}
                        {!isAdmin && showPayment && (
                            <div className="hidden lg:block">
                                <PayViaSection amount={paymentAmount} customer={customerModelInfo} />
                            </div>
                        )}
                    </div>

                    {/* Mobile Only Pay Via Section (Rendered Last) */}
                    {!isAdmin && showPayment && (
                        <div className="lg:hidden w-full order-5 mt-6">
                            <PayViaSection amount={paymentAmount} customer={customerModelInfo} />
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
