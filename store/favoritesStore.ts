import { getItem, setItem } from '@/lib/secureStore'
import { create } from 'zustand'

type FavoritesMap = Record<string, boolean>

type FavoritesState = {
  favorites: FavoritesMap
  setFavorites: (f: FavoritesMap) => void
  isFavorite: (id: string) => boolean
  toggle: (id: string) => Promise<void>
  load: () => Promise<void>
}

const KEY = 'calzado_jyr_favorites'

let persistTimer: ReturnType<typeof setTimeout> | null = null
function persistFavs(items: FavoritesMap) {
  if (persistTimer) clearTimeout(persistTimer)
  persistTimer = setTimeout(() => {
    setItem(KEY, JSON.stringify(items)).catch((e) => console.warn('fav persist failed', e))
  }, 300)
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: {},
  setFavorites: (f) => set({ favorites: f }),
  isFavorite: (id: string) => !!get().favorites[id],
  toggle: async (id: string) => {
    const current = { ...(get().favorites || {}) }
    const next = !current[id]
    current[id] = next
    set({ favorites: current })
    persistFavs(current)
  },
  load: async () => {
    try {
      const raw = await getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as FavoritesMap
        set({ favorites: parsed })
      }
    } catch (e) {
      console.warn('Failed to load favorites', e)
    }
  },
}))

// Nota: la carga persistente se realiza al montar la app desde `app/_layout.tsx`
