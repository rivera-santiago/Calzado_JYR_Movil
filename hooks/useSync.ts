import { useCallback, useEffect, useState } from 'react'
import { syncManager } from '../services/syncManager'
import { useAuthStore } from '../store/authStore'

export function useSync() {
  const { user } = useAuthStore()
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (!user) return

    try {
      syncManager.startListening()
    } catch (e) {
      // NetInfo not available (web) — fallback to navigator.onLine
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    const interval = setInterval(async () => {
      setPendingCount(await syncManager.getPendingCount())
    }, 5000)

    return () => {
      syncManager.stopListening()
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
      clearInterval(interval)
    }
  }, [user])

  const syncNow = useCallback(async () => {
    if (!user || isSyncing) return
    setIsSyncing(true)
    try {
      await syncManager.syncAll()
      setPendingCount(await syncManager.getPendingCount())
    } finally {
      setIsSyncing(false)
    }
  }, [user, isSyncing])

  return { isOnline, isSyncing, pendingCount, syncNow }
}
