// Placeholder para o client real (Supabase) — trocar quando o backend estiver pronto.
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export function mockDelay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}
