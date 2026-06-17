import { Platform } from 'react-native'

let SecureStore: typeof import('expo-secure-store') | null = null

async function getSecureStore() {
  if (!SecureStore) {
    SecureStore = await import('expo-secure-store')
  }
  return SecureStore
}

export async function getItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS !== 'web') {
      const ss = await getSecureStore()
      if (ss && typeof ss.getItemAsync === 'function') {
        return await ss.getItemAsync(key)
      }
    }
  } catch (e) {
    // fall through to localStorage
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    const v = window.localStorage.getItem(key)
    return v
  }

  return null
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS !== 'web') {
      const ss = await getSecureStore()
      if (ss && typeof ss.setItemAsync === 'function') {
        await ss.setItemAsync(key, value)
        return
      }
    }
  } catch (e) {
    // fall back
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value)
  }
}

export async function deleteItem(key: string): Promise<void> {
  try {
    if (Platform.OS !== 'web') {
      const ss = await getSecureStore()
      if (ss && typeof ss.deleteItemAsync === 'function') {
        await ss.deleteItemAsync(key)
        return
      }
    }
  } catch (e) {
    // fall back
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key)
  }
}
