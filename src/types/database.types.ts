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
      projects_studio: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'DRAFT' | 'UPLOADED' | 'SUBMITTED' | 'IN_REVIEW' | 'EDITING' | 'READY_FOR_REVIEW' | 'CHANGES_REQUESTED' | 'COMPLETED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: 'DRAFT' | 'UPLOADED' | 'SUBMITTED' | 'IN_REVIEW' | 'EDITING' | 'READY_FOR_REVIEW' | 'CHANGES_REQUESTED' | 'COMPLETED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: 'DRAFT' | 'UPLOADED' | 'SUBMITTED' | 'IN_REVIEW' | 'EDITING' | 'READY_FOR_REVIEW' | 'CHANGES_REQUESTED' | 'COMPLETED'
          created_at?: string
          updated_at?: string
        }
      }
      media_assets_studio: {
        Row: {
          id: string
          project_id: string | null
          user_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          thumbnail_path: string | null
          duration: number | null
          status: 'DRAFT' | 'UPLOADED' | 'SUBMITTED' | 'IN_REVIEW' | 'EDITING' | 'READY_FOR_REVIEW' | 'CHANGES_REQUESTED' | 'COMPLETED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          user_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          thumbnail_path?: string | null
          duration?: number | null
          status?: 'DRAFT' | 'UPLOADED' | 'SUBMITTED' | 'IN_REVIEW' | 'EDITING' | 'READY_FOR_REVIEW' | 'CHANGES_REQUESTED' | 'COMPLETED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          user_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          storage_path?: string
          thumbnail_path?: string | null
          duration?: number | null
          status?: 'DRAFT' | 'UPLOADED' | 'SUBMITTED' | 'IN_REVIEW' | 'EDITING' | 'READY_FOR_REVIEW' | 'CHANGES_REQUESTED' | 'COMPLETED'
          created_at?: string
          updated_at?: string
        }
      }
      production_jobs_studio: {
        Row: {
          id: string
          media_asset_id: string
          user_id: string
          status: 'DRAFT' | 'UPLOADED' | 'SUBMITTED' | 'IN_REVIEW' | 'EDITING' | 'READY_FOR_REVIEW' | 'CHANGES_REQUESTED' | 'COMPLETED'
          notes: string | null
          submitted_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          media_asset_id: string
          user_id: string
          status?: 'DRAFT' | 'UPLOADED' | 'SUBMITTED' | 'IN_REVIEW' | 'EDITING' | 'READY_FOR_REVIEW' | 'CHANGES_REQUESTED' | 'COMPLETED'
          notes?: string | null
          submitted_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          media_asset_id?: string
          user_id?: string
          status?: 'DRAFT' | 'UPLOADED' | 'SUBMITTED' | 'IN_REVIEW' | 'EDITING' | 'READY_FOR_REVIEW' | 'CHANGES_REQUESTED' | 'COMPLETED'
          notes?: string | null
          submitted_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
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
