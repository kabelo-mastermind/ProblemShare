import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// For server components
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

// For client components - using singleton pattern
let clientSupabase: ReturnType<typeof createClient<Database>> | null = null

export const createBrowserSupabaseClient = () => {
  if (clientSupabase) return clientSupabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables:", {
      url: !!supabaseUrl,
      key: !!supabaseKey,
    })
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables")
  }

  try {
    clientSupabase = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
    return clientSupabase
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}

// Legacy client for backward compatibility
export const supabase = typeof window !== "undefined" ? createBrowserSupabaseClient() : createServerSupabaseClient()
