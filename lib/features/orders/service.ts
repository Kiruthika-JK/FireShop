import { firestore } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, startAfter, getDocs, QueryConstraint, Timestamp, DocumentSnapshot } from "firebase/firestore";
import { Order, OrderFilters, OrderStatus } from "./types";

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

        const constraints: QueryConstraint[] = [];
        const ordersRef = collection(firestore, ORDERS_COLLECTION);

        if (!isAdmin) {
            // Customer: fetch only their orders by email, latest first.
            constraints.push(where("customerInfo.emailId", "==", userEmail));
            constraints.push(orderBy("createdAt", "desc"));
        } else {
            // Admin: apply status filter if selected (backed by composite index)
            if (filters?.status && filters.status !== 'All') {
                constraints.push(where("status", "==", filters.status));
            }

            // Admin Search Logic
            if (filters?.search) {
                const term = filters.search.trim();
                if (term) {
                    // Determine search field from the term shape
                    let searchField = "customerInfo.name";
                    if (/^\d+$/.test(term)) {
                        searchField = "customerInfo.mobileNo";
                    } else if (term.includes('@')) {
                        searchField = "customerInfo.emailId";
                    }

                    // Prefix search — orderBy on searched field must come first,
                    // then secondary sort by createdAt desc (backed by composite index)
                    constraints.push(orderBy(searchField));
                    constraints.push(where(searchField, ">=", term));
                    constraints.push(where(searchField, "<=", term + '\uf8ff'));
                    constraints.push(orderBy("createdAt", "desc"));
                } else {
                    // No search term — sort by creation time desc
                    constraints.push(orderBy("createdAt", "desc"));
                }
            } else {
                // No search — sort by creation time desc
                constraints.push(orderBy("createdAt", "desc"));
            }
        }

        // Pagination — startAfter MUST come before limit
        if (lastDoc) {
            constraints.push(startAfter(lastDoc));
        }
        constraints.push(limit(PAGE_LIMIT));

        const q = query(ordersRef, ...constraints);
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

        return {
            orders,
            lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
            hasMore: snapshot.docs.length === PAGE_LIMIT
        };
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
    }
};
