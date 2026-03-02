'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderStatus, ORDER_STATUSES } from '@/lib/features/orders/types'
import { OrderService } from '@/lib/features/orders/service'
import { Loader2 } from 'lucide-react'

interface OrderStatusUpdateProps {
    orderId: string;
    currentStatus: OrderStatus;
    onUpdateComplete: (newStatus: OrderStatus, comment: string) => void;
}

export function OrderStatusUpdate({ orderId, currentStatus, onUpdateComplete }: OrderStatusUpdateProps) {
    const [status, setStatus] = useState<OrderStatus>(currentStatus)
    const [comment, setComment] = useState('')
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleUpdate = async () => {
        setIsUpdating(true)
        setError(null)
        try {
            await OrderService.updateOrderStatus(orderId, status, comment.trim())
            onUpdateComplete(status, comment)
            setComment('') // Clear comment after success
        } catch (err) {
            console.error('Failed to update status:', err)
            setError('Failed to update status. Please try again.')
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <Card className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Update Order Status</h2>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Select value={status} onValueChange={(val) => setStatus(val as OrderStatus)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                            {ORDER_STATUSES.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Admin Comment (Optional)</label>
                    <Textarea
                        placeholder="Add a note to this update..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="resize-none h-20"
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button
                    onClick={handleUpdate}
                    disabled={isUpdating || (status === currentStatus && !comment)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                    {isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Update Status'}
                </Button>
            </div>
        </Card>
    )
}
