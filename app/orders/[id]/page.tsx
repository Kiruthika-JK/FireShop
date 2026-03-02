'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderService } from '@/lib/features/orders/service'
import { Order } from '@/lib/features/orders/types'
import { useAuth } from '@/lib/auth-context'
import { Loader2, ArrowLeft } from 'lucide-react'
import { OrderTracker } from '@/components/orders/OrderTracker'
import { OrderStatusUpdate } from '@/components/orders/OrderStatusUpdate'
import { DeliveryAddressCard } from '@/components/orders/DeliveryAddressCard'
import { OrderItemsList } from '@/components/orders/OrderItemsList'
import { PayViaSection } from '@/components/checkout/PayViaSection'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { user, isAdmin, loading: authLoading } = useAuth()
    const { id } = React.use(params)
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && user) {
            loadOrder()
        }
    }, [authLoading, user, id])

    const loadOrder = async () => {
        try {
            setLoading(true)
            const data = await OrderService.getOrderById(id)
            if (data) {
                // simple ownership check for users
                if (!isAdmin && data.customerInfo.emailId !== user?.email) {
                    router.push('/orders')
                    return
                }
                setOrder(data)
            } else {
                setOrder(null)
            }
        } catch (error) {
            console.error("Failed to load order:", error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        try {
            return new Intl.DateTimeFormat('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(new Date(dateString))
        } catch (e) {
            return 'Invalid Date'
        }
    }

    if (authLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
    }

    if (!user || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">Order not found or you don't have access.</p>
                <button onClick={() => router.push('/orders')} className="text-primary hover:underline">Return to Orders</button>
            </div>
        )
    }

    const StatusBadgeRow = () => (
        <div className="flex justify-between items-center mb-6">
            <div>
                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                <p className="font-semibold text-slate-800">{order.id}</p>
            </div>
            <Badge className="bg-slate-100 text-slate-800 border-slate-200 shadow-none px-3 py-1">
                {order.status}
            </Badge>
        </div>
    )

    const OrderMetaInfo = () => (
        <div className="flex flex-wrap gap-y-4 justify-between border-t border-gray-100 pt-4 mt-6">
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">

                <button
                    onClick={() => router.back()}
                    className="flex items-center text-sm text-gray-500 hover:text-slate-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </button>

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
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-1">Order ID</p>
                                        <p className="font-medium text-slate-800 text-sm">{order.id} <span className="text-xs text-gray-400 ml-2">({order.products.reduce((acc, p) => acc + p.quantity, 0)} items)</span></p>
                                    </div>
                                    <div className="mb-6">
                                        <OrderTracker status={order.status} />
                                    </div>
                                </>
                            )}
                            <OrderMetaInfo />
                        </Card>

                        {/* 2. Admin Status Update */}
                        {isAdmin && (
                            <OrderStatusUpdate
                                orderId={order.id}
                                currentStatus={order.status}
                                onUpdateComplete={(newStatus) => setOrder({ ...order, status: newStatus })}
                            />
                        )}

                        {/* 3. Delivery Address */}
                        <DeliveryAddressCard customerInfo={order.customerInfo} />

                        {/* 4. Pay Via Section (Hidden on Mobile here, shown at bottom) */}
                        {!isAdmin && (
                            <div className="hidden lg:block">
                                <PayViaSection amount={order.totalPrice} customer={customerModelInfo} />
                            </div>
                        )}
                    </div>

                    {/* Mobile Only Pay Via Section (Rendered Last) */}
                    {!isAdmin && (
                        <div className="lg:hidden w-full order-5 mt-6">
                            <PayViaSection amount={order.totalPrice} customer={customerModelInfo} />
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
