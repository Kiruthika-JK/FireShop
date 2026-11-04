import { create } from 'zustand'
import { Order } from './types'

interface OrdersCacheStore {
    key: string | null
    orders: Order[]
    setCache: (key: string, orders: Order[]) => void
}

export const useOrdersCache = create<OrdersCacheStore>()((set) => ({
    key: null,
    orders: [],
    setCache: (key, orders) => set({ key, orders }),
}))
