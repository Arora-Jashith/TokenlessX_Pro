import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Tables = Database['public']['Tables'];
type Profiles = Tables['profiles']['Row'];
type Transactions = Tables['transactions']['Row'];
type TrustNetwork = Tables['trust_network']['Row'];

export const databaseService = {
  // Profile operations
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as Profiles;
  },

  updateProfile: async (userId: string, updates: Partial<Profiles>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profiles;
  },

  // Transaction operations
  createTransaction: async (senderId: string, recipientId: string, amount: number) => {
    const { data, error } = await supabase.rpc('process_transaction', {
      sender_id: senderId,
      recipient_id: recipientId,
      amount: amount
    });
    
    if (error) throw error;
    return data;
  },

  getTransactions: async (userId: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Transactions[];
  },

  updateTransactionStatus: async (transactionId: string, status: Transactions['status']) => {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', transactionId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Transactions;
  },

  // Trust network operations
  getTrustNetwork: async (userId: string) => {
    const { data, error } = await supabase
      .from('trust_network')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as TrustNetwork[];
  },

  addTrustConnection: async (userId: string, connectionId: string, trustScore: number) => {
    const { data, error } = await supabase
      .from('trust_network')
      .upsert({
        user_id: userId,
        connection_id: connectionId,
        trust_score: trustScore
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as TrustNetwork;
  },

  updateTrustScore: async (userId: string) => {
    const { data, error } = await supabase.rpc('calculate_trust_score', {
      user_id: userId
    });
    
    if (error) throw error;
    return data;
  },

  // Search operations
  searchUsers: async (query: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, trust_score')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);
    
    if (error) throw error;
    return data as Pick<Profiles, 'id' | 'name' | 'email' | 'trust_score'>[];
  }
}; 