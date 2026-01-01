import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

import { formatCartTotal } from '@/lib/features/product/domain/formatting'

export interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  formattedTotal: string
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      formattedTotal: '0.00',
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.productId === item.productId)

        if (existingItem) {
          const newItems = items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
          set({ items: newItems, ...calculateCartState(newItems) })
        } else {
          const newItems = [...items, item]
          set({ items: newItems, ...calculateCartState(newItems) })
        }
      },
      removeItem: (productId) => {
        const newItems = get().items.filter((i) => i.productId !== productId)
        set({ items: newItems, ...calculateCartState(newItems) })
      },
      updateQuantity: (productId, quantity) => {
        const items = get().items
        if (quantity <= 0) {
          const newItems = items.filter((i) => i.productId !== productId)
          set({ items: newItems, ...calculateCartState(newItems) })
        } else {
          const existingItem = items.find((i) => i.productId === productId)
          if (existingItem) {
            const newItems = items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            )
            set({ items: newItems, ...calculateCartState(newItems) })
          }
        }
      },
      clearCart: () => set({ items: [], total: 0, formattedTotal: '0.00' }),
    }),
    {
      name: 'cart-storage',
    }
  )
)

function calculateCartState(items: CartItem[]) {
  const total = items.reduce((total, item) => total + item.price * item.quantity, 0)
  return {
    total,
    formattedTotal: formatCartTotal(total)
  }
}
