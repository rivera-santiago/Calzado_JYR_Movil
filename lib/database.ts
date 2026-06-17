import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('app_local.db');
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDb();
  await database.execAsync('PRAGMA foreign_keys = ON;');
  await database.execAsync(`
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
  `);
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      operation TEXT NOT NULL,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      attempts INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

export async function runAsync(sql: string, params: SQLite.SQLiteBindValue[] = []): Promise<void> {
  const database = await getDb();
  await database.runAsync(sql, params);
}

export async function getAllAsync<T = unknown>(sql: string, params: SQLite.SQLiteBindValue[] = []): Promise<T[]> {
  const database = await getDb();
  return await database.getAllAsync(sql, params) as T[];
}

export async function getFirstAsync<T = unknown>(sql: string, params: SQLite.SQLiteBindValue[] = []): Promise<T | null> {
  const database = await getDb();
  return await database.getFirstAsync(sql, params) as T | null;
}

export { db };
