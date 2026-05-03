import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !key) {
  console.warn('[supabase] .env.local eksik — VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY gerekli')
}

export const sb = createClient(url || '', key || '')
