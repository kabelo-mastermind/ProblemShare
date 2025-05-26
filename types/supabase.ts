export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      problems: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          requirements: string | null
          tags: string[] | null
          user_id: string
          contact_info: {
            email?: string
            whatsapp?: string
            phone?: string
            telegram?: string
            preferred_method?: string
            other?: string
          } | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          requirements?: string | null
          tags?: string[] | null
          user_id: string
          contact_info?: {
            email?: string
            whatsapp?: string
            phone?: string
            telegram?: string
            preferred_method?: string
            other?: string
          } | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          requirements?: string | null
          tags?: string[] | null
          user_id?: string
          contact_info?: {
            email?: string
            whatsapp?: string
            phone?: string
            telegram?: string
            preferred_method?: string
            other?: string
          } | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
