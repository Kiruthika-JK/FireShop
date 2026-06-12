'use client'

import { Card } from '@/components/ui/card'
import { QRCodeSVG } from 'qrcode.react'
import { formatPrice } from '@/lib/utils'

export interface PayViaCustomerModel {
    name: string;
    mobileNumber: string;
}

interface PayViaSectionProps {
    amount: number;
    customer?: PayViaCustomerModel;
}

export function PayViaSection({ amount, customer }: PayViaSectionProps) {
    // Generate UPI payment URL
    const generateUPIUrl = () => {
        const pa = '8248817401-2@ibl'
        const pn = customer?.name ? encodeURIComponent(customer.name) : 'Ganishkhasri Crackers'
        // If customer exists, format "Number - Rs Amount", else just "Rs Amount"
        const tnText = customer?.mobileNumber
            ? `${customer.mobileNumber} - Rs ${amount.toFixed(2)}`
            : `Order Payment - Rs ${amount.toFixed(2)}`
        const tn = encodeURIComponent(tnText)
        const am = amount.toFixed(2)
        const cu = 'INR'

        return `upi://pay?pa=${pa}&pn=${pn}&tn=${tn}&am=${am}&cu=${cu}`
    }

    const upiUrl = generateUPIUrl()

    return (
        <Card className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-48 lg:mb-0">
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
                    <p className="text-lg font-bold text-green-600">₹{formatPrice(amount)}</p>
                </div>

                <div className="text-xs text-gray-500 text-center max-w-[240px] pb-8">
                    Open any UPI app and scan this QR code to complete your payment
                </div>
            </div>
        </Card>
    )
}
