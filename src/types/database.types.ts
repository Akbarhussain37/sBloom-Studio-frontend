export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profile_studio: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'creator' | 'kid'
          portfolio_url: string | null
          bio: string | null
          primary_software: string | null
          parent_email: string | null
          kid_age: number | null
          interest: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role: 'creator' | 'kid'
          portfolio_url?: string | null
          bio?: string | null
          primary_software?: string | null
          parent_email?: string | null
          kid_age?: number | null
          interest?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'creator' | 'kid'
          portfolio_url?: string | null
          bio?: string | null
          primary_software?: string | null
          parent_email?: string | null
          kid_age?: number | null
          interest?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profile_images_studio: {
        Row: {
          id: string
          user_id: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          created_at?: string
        }
      }
      bookings_studio: {
        Row: {
          id: string
          full_name: string
          email: string
          project_type: string
          source: string
          status: 'pending' | 'confirmed' | 'cancelled'
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          project_type: string
          source?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          project_type?: string
          source?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          user_id?: string | null
          created_at?: string
        }
      }
      contact_submissions_studio: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
