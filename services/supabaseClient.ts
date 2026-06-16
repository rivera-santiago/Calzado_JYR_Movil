import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Replace these with your real project values or use environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'public-anon-key'

export function createSupabaseClient(token?: string): SupabaseClient {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  })

  return client
}
