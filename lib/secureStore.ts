import { Platform } from 'react-native'

export async function getItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS !== 'web') {
      const SecureStore = await import('expo-secure-store')
      if (SecureStore && typeof SecureStore.getItemAsync === 'function') {
        return await SecureStore.getItemAsync(key)
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
      const SecureStore = await import('expo-secure-store')
      if (SecureStore && typeof SecureStore.setItemAsync === 'function') {
        await SecureStore.setItemAsync(key, value)
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
      const SecureStore = await import('expo-secure-store')
      if (SecureStore && typeof SecureStore.deleteItemAsync === 'function') {
        await SecureStore.deleteItemAsync(key)
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
