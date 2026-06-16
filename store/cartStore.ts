import { deleteItem, getItem, setItem } from '@/lib/secureStore'
import { create } from 'zustand'

export type CartItem = {
  id: string
  name: string
  price?: number
  image_url?: string | null
  qty: number
  size?: string | null
}

type CartState = {
  items: Record<string, CartItem>
  add: (item: CartItem) => Promise<void>
  remove: (id: string) => Promise<void>
  updateQty: (id: string, qty: number) => Promise<void>
  clear: () => Promise<void>
  load: () => Promise<void>
}

const KEY = 'calzado_jyr_cart'

export const useCartStore = create<CartState>((set, get) => ({
  items: {},
  add: async (item) => {
    const items = { ...(get().items || {}) }
    const existing = items[item.id]
    if (existing) {
      existing.qty = Math.min(99, existing.qty + item.qty)
      items[item.id] = existing
    } else {
      items[item.id] = item
    }
    set({ items })
    try { await setItem(KEY, JSON.stringify(items)) } catch (e) { console.warn('cart add failed', e) }
  },
  remove: async (id) => {
    const items = { ...(get().items || {}) }
    delete items[id]
    set({ items })
    try { await setItem(KEY, JSON.stringify(items)) } catch (e) { console.warn('cart remove failed', e) }
  },
  updateQty: async (id, qty) => {
    const items = { ...(get().items || {}) }
    if (items[id]) {
      items[id].qty = Math.max(1, Math.min(99, qty))
      set({ items })
      try { await setItem(KEY, JSON.stringify(items)) } catch (e) { console.warn('cart updateQty failed', e) }
    }
  },
  clear: async () => {
    set({ items: {} })
    try { await deleteItem(KEY) } catch (e) { console.warn('cart clear failed', e) }
  },
  load: async () => {
    try {
      const raw = await getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, CartItem>
        set({ items: parsed })
      }
    } catch (e) {
      console.warn('cart load failed', e)
    }
  }
}))
