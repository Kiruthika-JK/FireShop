export type OrderStatus = 'Ordered' | 'Ready to Ship' | 'Shipped' | 'Delivered' | 'Canceled';

export const ORDER_STATUSES: OrderStatus[] = [
    'Ordered',
    'Ready to Ship',
    'Shipped',
    'Delivered',
    'Canceled'
];

export interface OrderItem {
    name: string;
    quantity: number;
    discountedPrice: number;
    productId?: string; // Optional as it might not be strictly needed for display if name is enough, but good to have
}

export interface CustomerInfo {
    name: string;
    mobileNo: string;
    emailId: string;
    address: string;
    city: string;
    pincode: string;
}

export interface Order {
    id: string;
    createdAt: string; // ISO String
    totalPrice: number;
    status: OrderStatus;
    products: OrderItem[];
    customerInfo: CustomerInfo;
}

export interface OrderFilters {
    status?: OrderStatus | 'All';
    search?: string;
}
