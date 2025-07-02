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
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          reputation: number
          trust_score: number
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          reputation?: number
          trust_score?: number
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          reputation?: number
          trust_score?: number
          balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          amount: number
          status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'under_review'
          hash: string
          trust_points_earned: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          amount: number
          status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'under_review'
          hash: string
          trust_points_earned?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          amount?: number
          status?: 'pending' | 'approved' | 'rejected' | 'flagged' | 'under_review'
          hash?: string
          trust_points_earned?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      trust_network: {
        Row: {
          id: string
          user_id: string
          connection_id: string
          trust_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          connection_id: string
          trust_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          connection_id?: string
          trust_score?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_trust_score: {
        Args: { user_id: string }
        Returns: number
      }
      process_transaction: {
        Args: { 
          sender_id: string, 
          recipient_id: string, 
          amount: number 
        }
        Returns: { 
          success: boolean, 
          message: string 
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 