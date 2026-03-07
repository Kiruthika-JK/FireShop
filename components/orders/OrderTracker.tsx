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
        <div className="w-full pt-1 pb-2">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Order Status</h3>

            <div className="relative flex justify-between items-start w-full">
                {/* Connecting Lines */}
                <div
                    className="absolute top-3 sm:top-4 -translate-y-1/2 h-1 bg-gray-200 -z-10 rounded-full"
                    style={{ left: `${50 / steps.length}%`, right: `${50 / steps.length}%` }}
                />
                <div
                    className="absolute top-3 sm:top-4 -translate-y-1/2 h-1 bg-green-500 transition-all duration-500 -z-10 rounded-full"
                    style={{
                        left: `${50 / steps.length}%`,
                        width: `${steps.length > 1 ? (currentIndex / (steps.length - 1)) * (100 - 100 / steps.length) : 0}%`,
                        backgroundColor: isCanceled && currentIndex === 1 ? '#ef4444' : '#22c55e'
                    }}
                />

                {/* Steps */}
                {steps.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isLastStepCanceled = isCanceled && index === 1;

                    return (
                        <div key={step} className="flex-1 flex flex-col items-center gap-2 z-10 px-1 sm:px-2" title={step}>
                            <div
                                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isLastStepCanceled && isCompleted
                                    ? 'border-red-500 bg-red-500 text-white'
                                    : isCompleted
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : 'border-gray-300 bg-white text-gray-400'
                                    }`}
                            >
                                {isLastStepCanceled ? <X className="h-3 w-3 sm:h-4 sm:w-4" /> : <Check className="h-3 w-3 sm:h-4 sm:w-4" />}
                            </div>
                            <span className={`text-[10px] sm:text-xs font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis w-full px-1 ${isCompleted ? 'text-slate-800' : 'text-gray-400'
                                }`}>
                                {step}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
