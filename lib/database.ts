import { Platform } from 'react-native'

// Lightweight typed wrappers for expo-sqlite / in-memory fallback.

type SQLResultRow = { [key: string]: unknown }

type SQLResult = {
  rows: {
    length: number
    item: (index: number) => SQLResultRow
  }
}

type ExecuteSqlFn = (sql: string, params?: unknown[], successCb?: (tx: unknown, result: SQLResult) => void, errorCb?: (tx: unknown, err: unknown) => void) => boolean

type TxLike = { executeSql?: ExecuteSqlFn }

type DBLike = { transaction: (cb: (tx: TxLike) => void, err?: (e: unknown) => void, success?: () => void) => void }

let db: DBLike

function createInMemoryDB(): DBLike {
  return {
    transaction(cb: (tx: TxLike) => void, err?: (e: unknown) => void, success?: () => void) {
      const tx: TxLike = {
        executeSql(_sql: string, _params: unknown[] = [], successCb?: (tx: unknown, result: SQLResult) => void, errorCb?: (tx: unknown, err: unknown) => void) {
          const result: SQLResult = { rows: { length: 0, item: (_: number) => ({} as SQLResultRow) } }
          try {
            successCb && successCb(tx, result)
            return true
          } catch (e) {
            errorCb && errorCb(tx, e)
            return false
          }
        }
      }
      try {
        cb(tx)
        success && success()
      } catch (e) {
        err && err(e)
      }
    }
  }
}

// Try to open the real SQLite DB only on native platforms and when runtime has window
if (Platform.OS !== 'web' && typeof window !== 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const SQLite = require('expo-sqlite')
    db = SQLite.openDatabase('app_local.db') as DBLike
  } catch (e) {
    console.warn('expo-sqlite not available, using in-memory fallback', e)
    db = createInMemoryDB()
  }
} else {
  db = createInMemoryDB()
}

// Inicializar esquema (se ejecuta al iniciar la app)
export async function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        tx.executeSql && tx.executeSql('PRAGMA foreign_keys = ON;')

        tx.executeSql && tx.executeSql(`
          CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            completed INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            synced INTEGER NOT NULL DEFAULT 0
          );
        `)

        tx.executeSql && tx.executeSql(`
          CREATE TABLE IF NOT EXISTS sync_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            operation TEXT NOT NULL,
            table_name TEXT NOT NULL,
            record_id TEXT NOT NULL,
            payload TEXT NOT NULL,
            attempts INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
          );
        `)

        tx.executeSql && tx.executeSql(`
          CREATE TABLE IF NOT EXISTS sync_meta (
            key TEXT PRIMARY KEY,
            value TEXT
          );
        `)
      } catch (e) {
        console.error('initDatabase transaction error', e)
        reject(e)
      }
    }, (err) => {
      console.error('initDatabase outer transaction error', err)
      reject(err)
    }, () => resolve())
  })
}

// Helper promisified wrappers
export function runAsync(sql: string, params: unknown[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql && tx.executeSql(sql, params, () => resolve(), (_tx, err) => { reject(err); return false })
    }, (err) => reject(err))
  })
}

export function getAllAsync<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql && tx.executeSql(sql, params, (_tx, result) => {
        const rows: T[] = []
        if (result && result.rows) {
          for (let i = 0; i < result.rows.length; i++) {
            rows.push(result.rows.item(i) as unknown as T)
          }
        }
        resolve(rows)
      }, (_tx, err) => { reject(err); return false })
    }, (err) => reject(err))
  })
}

export async function getFirstAsync<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await getAllAsync<T>(sql, params)
  return rows.length ? rows[0] : null
}

export { db }
