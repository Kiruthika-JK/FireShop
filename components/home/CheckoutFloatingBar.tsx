'use client'

import { useCartStore } from '@/lib/features/cart/store'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function CheckoutFloatingBar() {
    const { formattedTotal, items } = useCartStore()
    const hasItems = items.length > 0
    const router = useRouter()

    if (!hasItems) return null

    const handleCheckout = () => {
        router.push('/cart')
    }

    return (
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
                    Cart
                </Button>
            </div>
        </div>
    )
}
