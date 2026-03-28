import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  originalPrice?: number
  quantity: number
  thumbnail?: string;
}

import { formatPrice } from '@/lib/utils'

export interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  formattedTotal: string
  discount: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      formattedTotal: '0.00',
      discount: 0,
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
      clearCart: () => set({ items: [], total: 0, formattedTotal: '0.00', discount: 0 }),
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        // Always reset to clean state first
        if (state) {
          state.items = [];
          state.total = 0;
          state.formattedTotal = '0.00';
          state.discount = 0;
        }
      },
    }
  )
)

function calculateCartState(items: CartItem[]) {
  const total = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const originalTotal = items.reduce((total, item) => {
    // Handle legacy items that don't have originalPrice
    const itemOriginalPrice = item.originalPrice ?? item.price
    return total + itemOriginalPrice * item.quantity
  }, 0)
  const discount = originalTotal - total
  return {
    total,
    formattedTotal: formatPrice(total),
    discount
  }
}
