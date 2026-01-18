'use client'

import { useCartStore } from '@/lib/features/cart/store'
import { useCustomerInfoStore } from '@/lib/features/checkout/customer-info-store'
import { Card } from '@/components/ui/card'
import { QRCodeSVG } from 'qrcode.react'
import { formatPrice } from '@/lib/utils'

export function PayViaSection() {
    const { total } = useCartStore()
    const { customerInfo } = useCustomerInfoStore()

    // Generate timestamp in yyMMddHHmmss format
    const generateTimestamp = () => {
        const now = new Date()
        const yy = now.getFullYear().toString().slice(-2)
        const MM = (now.getMonth() + 1).toString().padStart(2, '0')
        const dd = now.getDate().toString().padStart(2, '0')
        const HH = now.getHours().toString().padStart(2, '0')
        const mm = now.getMinutes().toString().padStart(2, '0')
        const ss = now.getSeconds().toString().padStart(2, '0')
        return `${yy}${MM}${dd}${HH}${mm}${ss}`
    }

    // Generate UPI payment URL
    const generateUPIUrl = () => {
        const pa = '7639464976@ybl'
        const pn = encodeURIComponent(customerInfo.name || 'Customer')
        const tn = generateTimestamp()
        const am = total.toFixed(2)
        const cu = 'INR'

        return `upi://pay?pa=${pa}&pn=${pn}&tn=${tn}&am=${am}&cu=${cu}`
    }

    const upiUrl = generateUPIUrl()

    return (
        <Card className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Pay Via UPI</h2>

            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <QRCodeSVG
                        value={upiUrl}
                        size={200}
                        level="H"
                        includeMargin={false}
                    />
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Scan QR code to pay</p>
                    <p className="text-lg font-bold text-green-600">₹{formatPrice(total)}</p>
                </div>

                <div className="text-xs text-gray-500 text-center max-w-[240px]">
                    Open any UPI app and scan this QR code to complete your payment
                </div>
            </div>
        </Card>
    )
}
