'use client'

import { Card } from '@/components/ui/card'
import { QRCodeSVG } from 'qrcode.react'
import { formatPrice } from '@/lib/utils'

interface OrderConfirmCardProps {
    amount: number;
    customer?: { name: string; mobileNumber: string };
    isProcessing: boolean;
    isBelowMinOrder: boolean;
    minOrder: number;
    onConfirm: () => void;
}

export function OrderConfirmCard({ amount, customer, isProcessing, isBelowMinOrder, minOrder, onConfirm, bare = false }: OrderConfirmCardProps & { bare?: boolean }) {
    const generateUPIUrl = () => {
        const pa = '8248817401-2@ibl'
        const pn = customer?.name ? encodeURIComponent(customer.name) : 'Ganishkhasri Crackers'
        const tnText = customer?.mobileNumber
            ? `${customer.mobileNumber} - Rs ${amount.toFixed(2)}`
            : `Order Payment - Rs ${amount.toFixed(2)}`
        const tn = encodeURIComponent(tnText)
        const am = amount.toFixed(2)
        const cu = 'INR'

        return `upi://pay?pa=${pa}&pn=${pn}&tn=${tn}&am=${am}&cu=${cu}`
    }

    const upiUrl = generateUPIUrl()

    const content = (
        <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800 leading-relaxed mb-3">
                    <strong>Order & Payment:</strong> You can scan the QR code and send the payment amount. Our team will contact you to confirm. If you have any queries, you can still place your order and text us for payment assistance. Both options available!
                </p>
                <a
                    href="https://wa.me/918248817401"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    8248817401
                </a>
            </div>

            <button
                onClick={onConfirm}
                disabled={isProcessing || isBelowMinOrder}
                title={isBelowMinOrder ? `Minimum order is ₹${minOrder.toLocaleString('en-IN')}` : undefined}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center"
            >
                {isProcessing ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                    </>
                ) : (
                    'Place Order'
                )}
            </button>

            <div className="flex flex-col items-center justify-center space-y-3 mt-6">
                <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                    <QRCodeSVG
                        value={upiUrl}
                        size={160}
                        level="H"
                        includeMargin={false}
                    />
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600">Scan QR code to pay</p>
                    <p className="text-lg font-bold text-green-600">₹{formatPrice(amount)}</p>
                </div>
            </div>
        </>
    )

    if (bare) return <div className="px-4 pb-4 pt-2">{content}</div>

    return (
        <Card className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            {content}
        </Card>
    )
}
