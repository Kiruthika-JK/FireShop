'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/features/cart/store'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const BASE_MIN_ORDER = 3000

export function CheckoutFloatingBar() {
    const { formattedTotal, total, items } = useCartStore()
    const hasItems = items.length > 0
    const router = useRouter()
    const [showWarning, setShowWarning] = useState(false)

    if (!hasItems) return null

    const handleCheckout = () => {
        if (total < BASE_MIN_ORDER) {
            setShowWarning(true)
            return
        }
        router.push('/cart')
    }

    return (
        <>
            <div className="fixed bottom-6 left-0 right-0 z-[60] px-4 flex justify-center pointer-events-none animate-in slide-in-from-bottom-4 fade-in duration-300">
                <div className="bg-[#f0f0f0] shadow-xl rounded-[2rem] px-6 py-3 w-full max-w-md flex items-stretch justify-between pointer-events-auto border border-white/50 backdrop-blur-sm">
                    <div className="flex flex-col justify-center">
                        <span className="text-slate-500 text-sm font-medium">Total Price</span>
                        <span className="text-slate-900 text-2xl font-bold leading-none mt-1">₹{formattedTotal}</span>
                    </div>
                    <Button
                        onClick={handleCheckout}
                        className="bg-[#E0E7FF] hover:bg-[#C7D2FE] text-slate-800 font-semibold rounded-full px-8 h-auto text-base"
                    >
                        Go to Cart
                    </Button>
                </div>
            </div>

            {showWarning && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
                        <h3 className="text-lg font-bold text-red-700 mb-3">Minimum Order Required</h3>
                        <p className="text-gray-700 mb-2">
                            Your total order value is ₹{formattedTotal}.
                        </p>
                        <p className="text-sm text-gray-600 mb-6">
                            Minimum order is <strong>₹3,000</strong> for Tamil Nadu / Pondicherry and <strong>₹6,000</strong> for Other States.
                        </p>
                        <Button
                            onClick={() => setShowWarning(false)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-slate-800 font-semibold rounded-lg"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}
