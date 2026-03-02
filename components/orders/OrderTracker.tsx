'use client'

import { Card } from '@/components/ui/card'
import { OrderStatus } from '@/lib/features/orders/types'
import { Check, X } from 'lucide-react'

interface OrderTrackerProps {
    status: OrderStatus;
}

export function OrderTracker({ status }: OrderTrackerProps) {
    const isCanceled = status === OrderStatus.Canceled

    // Define the timeline steps
    const steps = isCanceled
        ? [OrderStatus.Ordered, OrderStatus.Canceled]
        : [OrderStatus.Ordered, OrderStatus.ReadyToShip, OrderStatus.Shipped, OrderStatus.Delivered]

    // Determine current index
    let currentIndex = 0
    if (isCanceled) {
        currentIndex = 1 // Last step is Canceled
    } else {
        currentIndex = steps.indexOf(status)
        if (currentIndex === -1) currentIndex = 0 // Fallback
    }

    return (
        <Card className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Order Status</h2>

            <div className="relative flex justify-between items-center w-full">
                {/* Connecting Lines */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full" />
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 transition-all duration-500 -z-10 rounded-full"
                    style={{
                        width: `${steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 0}%`,
                        backgroundColor: isCanceled && currentIndex === 1 ? '#ef4444' : '#22c55e'
                    }}
                />

                {/* Steps */}
                {steps.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isLastStepCanceled = isCanceled && index === 1;

                    return (
                        <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isLastStepCanceled && isCompleted
                                    ? 'bg-red-500 border-red-500 text-white'
                                    : isCompleted
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'bg-white border-gray-300 text-gray-400'
                                    }`}
                            >
                                {isLastStepCanceled ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </div>
                            <span className={`text-xs md:text-sm font-medium text-center max-w-[80px] ${isCompleted ? 'text-slate-800' : 'text-gray-400'
                                }`}>
                                {step}
                            </span>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}
