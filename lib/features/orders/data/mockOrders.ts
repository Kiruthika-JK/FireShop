export interface OrderModel {
    id: string
    orderDate: Date
    customerName: string
    totalAmount: number
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
    items: Array<{
        productId: string
        name: string
        quantity: number
        price: number
    }>
}

// Mock orders data
export const mockOrders: OrderModel[] = [
    {
        id: 'ORD-2026-001',
        orderDate: new Date('2026-01-15'),
        customerName: 'Test User',
        totalAmount: 2450.50,
        status: 'delivered',
        items: [
            { productId: '1', name: '7cm Electric Sparklers', quantity: 5, price: 450.10 },
            { productId: '2', name: '15cm Electric Sparklers', quantity: 3, price: 550.00 },
        ],
    },
    {
        id: 'ORD-2026-002',
        orderDate: new Date('2026-01-16'),
        customerName: 'John Doe',
        totalAmount: 5850.75,
        status: 'confirmed',
        items: [
            { productId: '3', name: '30cm Electric Sparklers', quantity: 10, price: 585.00 },
        ],
    },
    {
        id: 'ORD-2026-003',
        orderDate: new Date('2026-01-17'),
        customerName: 'Jane Smith',
        totalAmount: 3200.00,
        status: 'pending',
        items: [
            { productId: '1', name: '7cm Electric Sparklers', quantity: 2, price: 450.10 },
            { productId: '4', name: '50cm Electric Sparklers', quantity: 4, price: 674.95 },
        ],
    },
    {
        id: 'ORD-2026-004',
        orderDate: new Date('2026-01-18'),
        customerName: 'Mike Johnson',
        totalAmount: 1800.00,
        status: 'pending',
        items: [
            { productId: '2', name: '15cm Electric Sparklers', quantity: 2, price: 550.00 },
            { productId: '5', name: 'Ground Spinners', quantity: 5, price: 140.00 },
        ],
    },
]
