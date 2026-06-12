'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/features/cart/store'
import { Card } from '@/components/ui/card'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { ChevronDown, ChevronUp, Plus, Minus, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export function OrderItemsSection() {
    const { items, updateQuantity, removeItem } = useCartStore()
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
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 w-24">
                                        Image
                                    </th>
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
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 w-20">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <tr key={item.productId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            {item.thumbnail ? (
                                                <OptimizedImage
                                                    src={item.thumbnail}
                                                    alt={item.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">No image</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <div className="font-medium">{item.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 text-right">
                                            ₹{formatPrice(item.price)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">
                                            ₹{formatPrice(item.price * item.quantity)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 text-center">
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                                                title="Remove item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
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
