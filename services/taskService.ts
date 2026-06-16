import * as Crypto from 'expo-crypto'
import { getAllAsync, getFirstAsync, runAsync } from '../lib/database'

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
  synced: boolean
}

function rowToTask(row: Record<string, unknown>): Task {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    title: String(row.title),
    description: row.description ? String(row.description) : undefined,
    completed: Number(row.completed) === 1,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    synced: Number(row.synced) === 1,
  }
}

async function enqueueOperation(operation: 'INSERT' | 'UPDATE' | 'DELETE', tableName: string, recordId: string, payload: object) {
  await runAsync(
    `INSERT INTO sync_queue (operation, table_name, record_id, payload, created_at) VALUES (?, ?, ?, ?, ?)`,
    [operation, tableName, recordId, JSON.stringify(payload), new Date().toISOString()]
  )
}

export const taskService = {
  async getAll(userId: string): Promise<Task[]> {
    const rows = await getAllAsync<Record<string, unknown>>('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId])
    return rows.map(rowToTask)
  },

  async create(userId: string, title: string, description?: string): Promise<Task> {
    const id = await Crypto.randomUUID()
    const now = new Date().toISOString()

    const task: Task = {
      id, user_id: userId, title,
      description: description ?? '',
      completed: false,
      created_at: now, updated_at: now,
      synced: false,
    }

    await runAsync(
      `INSERT INTO tasks (id, user_id, title, description, completed, created_at, updated_at, synced) VALUES (?, ?, ?, ?, 0, ?, ?, 0)`,
      [task.id, task.user_id, task.title, task.description ?? '', task.created_at, task.updated_at]
    )

    await enqueueOperation('INSERT', 'tasks', id, task)
    return task
  },

  async update(id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>) {
    const now = new Date().toISOString()

    await runAsync(
      `UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), completed = COALESCE(?, completed), updated_at = ?, synced = 0 WHERE id = ?`,
      [updates.title ?? null, updates.description ?? null, updates.completed !== undefined ? (updates.completed ? 1 : 0) : null, now, id]
    )

    const updated = await getFirstAsync<Record<string, unknown>>('SELECT * FROM tasks WHERE id = ?', [id])
    if (updated) await enqueueOperation('UPDATE', 'tasks', id, rowToTask(updated))
  },

  async delete(id: string) {
    await runAsync('DELETE FROM tasks WHERE id = ?', [id])
    await enqueueOperation('DELETE', 'tasks', id, { id })
  },

  async pullFromCloud(_userId: string, pullHandler?: (remoteRows: Record<string, unknown>[]) => Promise<void>) {
    // This function is a placeholder: the project currently has no Supabase client configured.
    // If you add Supabase or another backend client, pass a pullHandler that fetches remote rows
    // and calls runAsync to upsert them locally.
    if (pullHandler) {
      const meta = await getFirstAsync<{ value: string }>("SELECT value FROM sync_meta WHERE key = 'last_pull'", [])
      const lastPull = meta?.value ?? '1970-01-01T00:00:00Z'
      await pullHandler([{ lastPull }])
      await runAsync(`INSERT INTO sync_meta (key, value) VALUES ('last_pull', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`, [new Date().toISOString()])
    }
  }
}
