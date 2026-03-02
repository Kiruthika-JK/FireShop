'use client'

import { Card } from '@/components/ui/card'
import { OrderItem } from '@/lib/features/orders/types'
import { formatPrice } from '@/lib/utils'

interface OrderItemsListProps {
    items: OrderItem[];
    totalAmount: number;
}

export function OrderItemsList({ items, totalAmount }: OrderItemsListProps) {
    return (
        <Card className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-slate-800">Ordered Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</h2>
            </div>

            <div className="divide-y divide-gray-100">
                {items.map((item, index) => (
                    <div key={index} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                        <div className="flex-1">
                            <h3 className="font-medium text-slate-900 leading-tight mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right sm:text-left min-w-[100px]">
                            <p className="font-semibold text-slate-900">₹{formatPrice(item.discountedPrice * item.quantity)}</p>
                            <p className="text-xs text-gray-400">₹{formatPrice(item.discountedPrice)} each</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-slate-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-800">Total Value</span>
                    <span className="text-2xl font-bold text-green-600">₹{formatPrice(totalAmount)}</span>
                </div>
            </div>
        </Card>
    )
}
