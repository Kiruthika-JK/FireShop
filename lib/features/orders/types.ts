export enum OrderStatus {
    Ordered = 'Ordered',
    ReadyToShip = 'Ready to Ship',
    Shipped = 'Shipped',
    Delivered = 'Delivered',
    Canceled = 'Canceled'
}

export const ORDER_STATUSES: OrderStatus[] = [
    OrderStatus.Ordered,
    OrderStatus.ReadyToShip,
    OrderStatus.Shipped,
    OrderStatus.Delivered,
    OrderStatus.Canceled
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
    adminComment?: string;
}

export interface OrderFilters {
    status?: OrderStatus | 'All';
    search?: string;
}
