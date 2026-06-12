'use client'

import { useCartStore } from '@/lib/features/cart/store'
import { useCustomerInfoStore } from '@/lib/features/checkout/customer-info-store'
import { Card } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

export function OrderInfoSection() {
    const { items, total } = useCartStore()
    const { customerInfo } = useCustomerInfoStore()

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    // Calculate GST based on location
    const calculateGST = () => {
        const isTNOrPondicherry = customerInfo.state === 'Tamil Nadu' || customerInfo.state === 'Pondicherry'
        if (isTNOrPondicherry) {
            return 0
        }
        return Math.round(total * 0.18) // 18% GST
    }

    const gstAmount = calculateGST()
    const grandTotal = total + gstAmount

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
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="text-base text-slate-900 font-semibold">₹{formatPrice(total)}</p>
                    </div>

                    {gstAmount > 0 && (
                        <>
                            <div className="flex justify-between items-center py-2">
                                <p className="text-sm text-gray-600">GST (18%)</p>
                                <p className="text-base text-slate-900 font-semibold">₹{formatPrice(gstAmount)}</p>
                            </div>
                            <div className="border-t border-gray-100"></div>
                        </>
                    )}

                    <div className="flex justify-between items-center py-2">
                        <p className="text-sm font-semibold text-gray-700">Grand Total</p>
                        <p className="text-xl text-green-600 font-bold">₹{formatPrice(grandTotal)}</p>
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
