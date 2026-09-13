'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Order, PaymentStatus, PAYMENT_STATUSES } from '@/lib/features/orders/types'
import { OrderService } from '@/lib/features/orders/service'
import { Loader2 } from 'lucide-react'

interface PaymentStatusUpdateProps {
    order: Order;
    onUpdateComplete: (paymentStatus: PaymentStatus, paidAmount: number, remainingAmount: number) => void;
}

export function PaymentStatusUpdate({ order, onUpdateComplete }: PaymentStatusUpdateProps) {
    const totalDue = order.grandTotal ?? order.totalPrice
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus || 'Unpaid')
    const [remainingInput, setRemainingInput] = useState<string>(
        order.remainingAmount !== undefined ? String(order.remainingAmount) : String(totalDue)
    )
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleUpdate = async () => {
        setIsUpdating(true)
        setError(null)

        let paidAmount = 0
        let remainingAmount = totalDue

        try {
            switch (paymentStatus) {
                case 'Fully Paid':
                    paidAmount = totalDue
                    remainingAmount = 0
                    break
                case 'Partially Paid':
                    const parsed = Number(remainingInput)
                    if (Number.isNaN(parsed) || parsed < 0 || parsed > totalDue) {
                        throw new Error(`Remaining amount must be between 0 and ₹${totalDue}`)
                    }
                    remainingAmount = Math.round(parsed)
                    paidAmount = totalDue - remainingAmount
                    break
                case 'Unpaid':
                    paidAmount = 0
                    remainingAmount = totalDue
                    break
            }

            await OrderService.updatePaymentStatus(order.id, paymentStatus, paidAmount, remainingAmount)
            onUpdateComplete(paymentStatus, paidAmount, remainingAmount)
        } catch (err) {
            console.error('Failed to update payment status:', err)
            setError(err instanceof Error ? err.message : 'Failed to update payment status. Please try again.')
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <Card className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Update Payment Status</h2>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Payment Status</label>
                    <Select value={paymentStatus} onValueChange={(val) => setPaymentStatus(val as PaymentStatus)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                            {PAYMENT_STATUSES.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {paymentStatus === 'Partially Paid' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Remaining Amount (₹)</label>
                        <Input
                            type="number"
                            min={0}
                            max={totalDue}
                            value={remainingInput}
                            onChange={(e) => setRemainingInput(e.target.value)}
                            placeholder={`Remaining amount out of ₹${totalDue}`}
                        />
                        <p className="text-xs text-gray-500">Total due: ₹{totalDue}</p>
                    </div>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button
                    onClick={handleUpdate}
                    disabled={isUpdating || paymentStatus === order.paymentStatus}
                    className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                >
                    {isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Update Payment Status'}
                </Button>
            </div>
        </Card>
    )
}
