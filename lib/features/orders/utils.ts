import { OrderStatus } from "./types"

export const getStatusColor = (status: OrderStatus | string) => {
    switch (status) {
        case OrderStatus.Delivered: return 'bg-green-100 text-green-800 border-green-200'
        case OrderStatus.Shipped: return 'bg-blue-100 text-blue-800 border-blue-200'
        case OrderStatus.ReadyToShip: return 'bg-purple-100 text-purple-800 border-purple-200'
        case OrderStatus.Processing: return 'bg-orange-100 text-orange-800 border-orange-200'
        case OrderStatus.Ordered: return 'bg-amber-100 text-amber-800 border-amber-200'
        case OrderStatus.Canceled: return 'bg-red-100 text-red-800 border-red-200'
        default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
}
