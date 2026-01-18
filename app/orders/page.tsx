'use client'

import { useRouter } from 'next/navigation'
import { mockOrders } from '@/lib/features/orders/data/mockOrders'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

export default function OrdersPage() {
    const router = useRouter()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200'
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Order History</h1>

                {mockOrders.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="text-gray-500 text-lg mb-4">No orders found</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            Start Shopping
                        </button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {mockOrders.map((order) => (
                            <Card
                                key={order.id}
                                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => router.push(`/orders/${order.id}`)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-lg text-slate-900">{order.id}</h3>
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>Order Date: <span className="text-slate-900">{formatDate(order.orderDate)}</span></p>
                                            <p>Customer: <span className="text-slate-900">{order.customerName}</span></p>
                                            <p>Items: <span className="text-slate-900">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span></p>
                                        </div>
                                    </div>

                                    {/* Price and Arrow */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                            <p className="text-2xl font-bold text-green-600">₹{formatPrice(order.totalAmount)}</p>
                                        </div>
                                        <ChevronRight className="h-6 w-6 text-gray-400" />
                                    </div>
                                </div>

                                {/* Items Preview */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2">Products:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {order.items.map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                                            >
                                                {item.name} (x{item.quantity})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
