import { firestore } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, startAfter, getDocs, QueryConstraint, Timestamp, DocumentSnapshot } from "firebase/firestore";
import { normalizePhoneNumber } from "@/lib/utils";
import { Order, OrderFilters, OrderStatus, PaymentStatus } from "./types";

const ORDERS_COLLECTION = "orders";
const PAGE_LIMIT = 50;

export interface FetchOrdersResult {
    orders: Order[];
    lastDoc: DocumentSnapshot | null;
    hasMore: boolean;
}

export const OrderService = {
    async fetchOrders(
        isAdmin: boolean,
        userEmail?: string | null,
        lastDoc?: DocumentSnapshot | null,
        filters?: OrderFilters
    ): Promise<FetchOrdersResult> {
        if (!isAdmin && !userEmail) {
            return { orders: [], lastDoc: null, hasMore: false };
        }

        const ordersRef = collection(firestore, ORDERS_COLLECTION);
        const constraints: QueryConstraint[] = [];

        if (!isAdmin) {
            // Customer: filter by email only (single-field index), sort client-side.
            constraints.push(where("customerInfo.emailId", "==", userEmail));
        } else {
            // Admin: fetch recent orders by createdAt (single-field index),
            // then apply status/search filters client-side — no composite index needed.
            constraints.push(orderBy("createdAt", "desc"));
        }

        if (lastDoc) {
            constraints.push(startAfter(lastDoc));
        }
        constraints.push(limit(isAdmin ? PAGE_LIMIT * 4 : PAGE_LIMIT));

        const q = query(ordersRef, ...constraints);
        const snapshot = await getDocs(q);

        let orders: Order[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate().toISOString()
                    : data.createdAt || new Date().toISOString()
            } as Order;
        });

        if (!isAdmin) {
            orders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        if (isAdmin && filters?.status && filters.status !== 'All') {
            orders = orders.filter(o => o.status === filters.status);
        }
        if (isAdmin && filters?.search?.trim()) {
            const term = filters.search.trim().toLowerCase();
            orders = orders.filter(o =>
                o.customerInfo.name?.toLowerCase().includes(term) ||
                o.customerInfo.mobileNo?.includes(term) ||
                o.customerInfo.emailId?.toLowerCase().includes(term)
            );
        }

        return {
            orders: orders.slice(0, PAGE_LIMIT),
            lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
            hasMore: snapshot.docs.length === (isAdmin ? PAGE_LIMIT * 4 : PAGE_LIMIT)
        };
    },

    async fetchOrdersByPhone(phone: string): Promise<Order[]> {
        const normalizedPhone = normalizePhoneNumber(phone)
        const ordersRef = collection(firestore, ORDERS_COLLECTION);
        const q = query(
            ordersRef,
            where("customerInfo.mobileNo", "==", normalizedPhone)
        );
        const snapshot = await getDocs(q);

        const orders: Order[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate().toISOString()
                    : data.createdAt || new Date().toISOString()
            } as Order;
        });

        return orders.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return dateB - dateA
        })
    },

    async getOrderById(orderId: string): Promise<Order | null> {
        try {
            const { doc, getDoc } = await import("firebase/firestore");
            const orderRef = doc(firestore, ORDERS_COLLECTION, orderId);
            const snapshot = await getDoc(orderRef);

            if (!snapshot.exists()) {
                return null;
            }

            const data = snapshot.data();
            return {
                id: snapshot.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate().toISOString()
                    : data.createdAt || new Date().toISOString()
            } as Order;
        } catch (error) {
            console.error("Error fetching order details:", error);
            return null;
        }
    },

    async updateOrderStatus(orderId: string, status: OrderStatus, comment?: string): Promise<void> {
        try {
            const { doc, updateDoc } = await import("firebase/firestore");
            const orderRef = doc(firestore, ORDERS_COLLECTION, orderId);

            const updateData: Record<string, unknown> = { status };
            if (comment) {
                updateData.adminComment = comment;
            }

            await updateDoc(orderRef, updateData);
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    },

    async updatePaymentStatus(
        orderId: string,
        paymentStatus: PaymentStatus,
        paidAmount: number,
        remainingAmount: number
    ): Promise<void> {
        try {
            const { doc, updateDoc } = await import("firebase/firestore");
            const orderRef = doc(firestore, ORDERS_COLLECTION, orderId);

            await updateDoc(orderRef, {
                paymentStatus,
                paidAmount,
                remainingAmount
            });
        } catch (error) {
            console.error("Error updating payment status:", error);
            throw error;
        }
    }
};
