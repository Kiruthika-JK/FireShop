'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/features/cart/store'
import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export function OrderItemsSection() {
    const { items } = useCartStore()
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
            >
                <h2 className="text-lg font-semibold text-slate-800">Order Items ({items.length})</h2>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
            </button>

            {isExpanded && (
                <div className="border-t border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        Product name
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 w-24">
                                        Qty
                                    </th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 w-32">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 w-32">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <tr key={item.productId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 text-center">
                                            x{item.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 text-right">
                                            ₹{formatPrice(item.price)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">
                                            ₹{formatPrice(item.price * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Card>
    )
}
