import { getAllAsync, runAsync } from '../lib/database';

let NetInfo: { addEventListener?: (cb: (state: { isConnected?: boolean; isInternetReachable?: boolean }) => void) => (() => void) } | null = null
try {
  // NetInfo only available on native; require conditionally to avoid web errors
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  NetInfo = require('@react-native-community/netinfo')
} catch (e) {
  NetInfo = null
}

type RemoteHandlers = {
  insert?: (table: string, payload: Record<string, unknown>) => Promise<unknown>
  update?: (table: string, payload: Record<string, unknown>) => Promise<unknown>
  delete?: (table: string, payload: Record<string, unknown>) => Promise<unknown>
}

const MAX_ATTEMPTS = 3

type PendingRow = { id: number; operation: string; table_name: string; record_id: string; payload: string }

export const syncManager = (function () {
  let _unsubscribe: (() => void) | null = null
  let handlers: RemoteHandlers = {}

  return {
    configure(remoteHandlers: RemoteHandlers) {
      handlers = remoteHandlers || {}
    },

    startListening() {
      if (_unsubscribe) return
      if (!NetInfo || !NetInfo.addEventListener) {
        // No NetInfo (web) — do not attempt to listen, but consumer can call syncAll manually
        return
      }

      _unsubscribe = NetInfo.addEventListener((state) => {
        if (state.isConnected && state.isInternetReachable) {
          console.log('[Sync] Conexion detectada, iniciando sincronizacion...')
          void this.syncAll()
        }
      })
    },

    stopListening() {
      _unsubscribe?.()
      _unsubscribe = null
    },

    async syncAll() {
      try {
        await this.pushPending()
        console.log('[Sync] SyncAll completed')
      } catch (err) {
        console.error('[Sync] syncAll error', err)
      }
    },

    async pushPending() {
      const pending = await getAllAsync<PendingRow>('SELECT * FROM sync_queue WHERE attempts < ? ORDER BY id ASC', [MAX_ATTEMPTS])
      if (!pending.length) return
      console.log(`[Sync] Procesando ${pending.length} operaciones pendientes`)

      for (const item of pending) {
        try {
          const payload = JSON.parse(item.payload) as Record<string, unknown>
          await this.executeOperation(item.operation, item.table_name, payload)
          await runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id])
        } catch (err) {
          await runAsync('UPDATE sync_queue SET attempts = attempts + 1 WHERE id = ?', [item.id])
          console.warn(`[Sync] Fallo en operacion ${item.id}`, err)
        }
      }
    },

    async executeOperation(operation: string, tableName: string, payload: Record<string, unknown>) {
      try {
        switch (operation) {
          case 'INSERT':
            if (!handlers.insert) return
            await handlers.insert(tableName, payload)
            break
          case 'UPDATE':
            if (!handlers.update) return
            await handlers.update(tableName, payload)
            break
          case 'DELETE':
            if (!handlers.delete) return
            await handlers.delete(tableName, payload)
            break
          default:
            throw new Error(`Operacion desconocida: ${operation}`)
        }
      } catch (err) {
        throw err
      }
    },

    async getPendingCount() {
      const rows = await getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM sync_queue', [])
      return rows?.[0]?.count ?? 0
    }
  }
})()
