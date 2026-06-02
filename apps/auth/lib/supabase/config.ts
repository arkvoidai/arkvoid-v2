export const SUPABASE_PLACEHOLDER_URL = 'https://placeholder.supabase.co'
export const SUPABASE_PLACEHOLDER_ANON_KEY = 'placeholder'

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isConfigured = Boolean(url && anonKey)

  return {
    url: url || SUPABASE_PLACEHOLDER_URL,
    anonKey: anonKey || SUPABASE_PLACEHOLDER_ANON_KEY,
    isConfigured,
  }
}
