'use client'

import { Card } from '@/components/ui/card'
import { CustomerInfo } from '@/lib/features/orders/types'

interface DeliveryAddressCardProps {
    customerInfo: CustomerInfo;
}

export function DeliveryAddressCard({ customerInfo }: DeliveryAddressCardProps) {
    return (
        <Card className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-gray-100 pb-4">Deliver To</h2>

            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Customer Name</p>
                    <p className="font-medium text-slate-900">{customerInfo.name}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Mobile Number</p>
                    <p className="font-medium text-slate-900">+91 {customerInfo.mobileNo}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Email ID</p>
                    <p className="font-medium text-slate-900">{customerInfo.emailId}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Delivery Address</p>
                    <p className="text-slate-700 mt-1 whitespace-pre-wrap">{customerInfo.address}</p>
                    <p className="text-slate-700 mt-1">{customerInfo.city} - {customerInfo.pincode}</p>
                </div>
            </div>
        </Card>
    )
}
