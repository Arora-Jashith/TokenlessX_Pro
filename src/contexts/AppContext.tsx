import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabase } from '../providers/SupabaseProvider';
import { databaseService } from '../services/database';
import { Database } from '../types/database';

type Tables = Database['public']['Tables'];
type Profiles = Tables['profiles']['Row'];
type Transactions = Tables['transactions']['Row'];
type TrustNetwork = Tables['trust_network']['Row'];

interface AppContextType {
  profile: Profiles | null;
  transactions: Transactions[];
  trustNetwork: TrustNetwork[];
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshTrustNetwork: () => Promise<void>;
  createTransaction: (recipientId: string, amount: number) => Promise<void>;
  updateTransactionStatus: (transactionId: string, status: Transactions['status']) => Promise<void>;
  addTrustConnection: (connectionId: string, trustScore: number) => Promise<void>;
  searchUsers: (query: string) => Promise<Pick<Profiles, 'id' | 'name' | 'email' | 'trust_score'>[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSupabase();
  const [profile, setProfile] = useState<Profiles | null>(null);
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [trustNetwork, setTrustNetwork] = useState<TrustNetwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const data = await databaseService.getProfile(user.id);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    }
  };

  const refreshTransactions = async () => {
    if (!user) return;
    try {
      const data = await databaseService.getTransactions(user.id);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    }
  };

  const refreshTrustNetwork = async () => {
    if (!user) return;
    try {
      const data = await databaseService.getTrustNetwork(user.id);
      setTrustNetwork(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trust network');
    }
  };

  const createTransaction = async (recipientId: string, amount: number) => {
    if (!user) return;
    try {
      await databaseService.createTransaction(user.id, recipientId, amount);
      await refreshTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
    }
  };

  const updateTransactionStatus = async (transactionId: string, status: Transactions['status']) => {
    try {
      await databaseService.updateTransactionStatus(transactionId, status);
      await refreshTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
    }
  };

  const addTrustConnection = async (connectionId: string, trustScore: number) => {
    if (!user) return;
    try {
      await databaseService.addTrustConnection(user.id, connectionId, trustScore);
      await refreshTrustNetwork();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add trust connection');
    }
  };

  const searchUsers = async (query: string) => {
    try {
      return await databaseService.searchUsers(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search users');
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([
        refreshProfile(),
        refreshTransactions(),
        refreshTrustNetwork()
      ]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const value = {
    profile,
    transactions,
    trustNetwork,
    loading,
    error,
    refreshProfile,
    refreshTransactions,
    refreshTrustNetwork,
    createTransaction,
    updateTransactionStatus,
    addTrustConnection,
    searchUsers
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 