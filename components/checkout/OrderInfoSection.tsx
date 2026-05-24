'use client'

import { useCartStore } from '@/lib/features/cart/store'
import { Card } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

export function OrderInfoSection() {
    const { items, total } = useCartStore()

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Information</h2>

                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                        <p className="text-sm text-gray-600">Items</p>
                        <p className="text-base text-slate-900 font-semibold">{totalItems}</p>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    <div className="flex justify-between items-center py-2">
                        <p className="text-sm text-gray-600">Final Price</p>
                        <p className="text-xl text-green-600 font-bold">₹{formatPrice(total)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 border-t border-amber-200 px-6 py-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>Note:</strong> Final Price excludes Shipment / Courier charge. Customer has to pay the courier charge to the courier partner during delivery.
                </p>
            </div>
        </Card>
    )
}
