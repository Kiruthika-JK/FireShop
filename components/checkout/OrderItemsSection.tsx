'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/features/cart/store'
import { useCustomerInfoStore } from '@/lib/features/checkout/customer-info-store'
import { Card } from '@/components/ui/card'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { ChevronDown, ChevronUp, Plus, Minus, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export function OrderItemsSection() {
    const { items, updateQuantity, removeItem, total } = useCartStore()
    const { customerInfo } = useCustomerInfoStore()
    const [isExpanded, setIsExpanded] = useState(true)

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

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

    return (
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4">
                <h2 className="text-base font-semibold text-slate-800 mb-3">Order Summary</h2>

                {/* Order Summary */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center py-1">
                        <p className="text-xs text-gray-600">Items ({totalItems})</p>
                        <p className="text-sm text-slate-900 font-semibold">₹{formatPrice(total)}</p>
                    </div>

                    {gstAmount > 0 && (
                        <div className="flex justify-between items-center py-1">
                            <p className="text-xs text-gray-600">GST (18%)</p>
                            <p className="text-sm text-slate-900 font-semibold">₹{formatPrice(gstAmount)}</p>
                        </div>
                    )}

                    <div className="border-t border-gray-200 my-2"></div>

                    <div className="flex justify-between items-center py-1">
                        <p className="text-sm font-semibold text-gray-700">Total</p>
                        <p className="text-lg text-green-600 font-bold">₹{formatPrice(grandTotal)} + delivery charges</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
