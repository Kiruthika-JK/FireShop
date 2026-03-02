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

        // 1. Base Filters
        if (!isAdmin) {
            // User: Fetch only their orders
            if (userEmail) {
                constraints.push(where("customerInfo.emailId", "==", userEmail));
            }
        } else {
            // Admin: Status Filter
            if (filters?.status && filters.status !== 'All') {
                constraints.push(where("status", "==", filters.status));
            }
        }

        // 2. Sorting
        // Default sort by creation time (Recent first)
        // Note: Firestore requires index for complex queries.
        // If searching, we might need to adjust sorting or indexes.

        let applyDefaultSort = true;

        // 3. Admin Search Logic
        if (isAdmin && filters?.search) {
            const term = filters.search.trim();
            if (term) {
                applyDefaultSort = false; // Search usually requires sorting by the search field for prefix queries

                // Heuristic for Search Field
                let searchField = "customerInfo.name"; // Default
                if (/^\d+$/.test(term)) {
                    searchField = "customerInfo.mobileNo";
                } else if (term.includes('@')) {
                    searchField = "customerInfo.emailId";
                }

                // Prefix Search: where('field', '>=', term) .where('field', '<=', term + '\uf8ff')
                // This implies we MUST sort by this field first.
                constraints.push(orderBy(searchField));
                constraints.push(where(searchField, ">=", term));
                constraints.push(where(searchField, "<=", term + '\uf8ff'));
            }
        }

        if (applyDefaultSort) {
            constraints.push(orderBy("createdAt", "desc"));
        }

        // 4. Pagination
        constraints.push(limit(PAGE_LIMIT));
        if (lastDoc) {
            constraints.push(startAfter(lastDoc));
        }

        // Execute Query
        // Note: This might throw "Index needed" errors in console initially.
        // The user will need to create indexes via the Firebase Console link provided in the error.
        const q = query(ordersRef, ...constraints);
        const snapshot = await getDocs(q);

        const orders: Order[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Ensure createdAt is parsed correctly (it might be a Timestamp or string depending on how it was saved)
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

            const updateData: any = { status };
            if (comment) {
                updateData.adminComment = comment; // Note: We might want to track history later, but simple field for now
            }

            await updateDoc(orderRef, updateData);
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    }
};
