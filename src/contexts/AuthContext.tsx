import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Transaction, TrustNetworkActivity } from '../types/user';
import { generateTransactionHash as generateTransactionHashAsync, mockData } from '../utils/mock';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password?: string) => void;
  logout: () => void;
  pendingTransactions: Transaction[];
  createTransaction: (sender: string, recipient: string, amount: number) => void;
  executeTransaction: (recipient: string, amount: number) => Promise<void>;
  approveTx: (id: string) => void;
  rejectTx: (id: string, reason: string) => void;
  flagTx: (id: string) => void;
  reviewTx: (id: string) => void;
  addUser: (name: string, email: string, password: string, isAdmin: boolean) => void;
  adjustTrustPoints: (userId: string, points: number, reason: string) => void;
  trustNetworkActivities: TrustNetworkActivity[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [trustNetworkActivities, setTrustNetworkActivities] = useState<TrustNetworkActivity[]>([]);
  
  useEffect(() => {
    // Check if there's a stored user in localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUsers = localStorage.getItem('allUsers');
    const storedTransactions = localStorage.getItem('pendingTransactions');
    
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        setAllUsers(users);
      } catch (error) {
        console.error('Error parsing stored users:', error);
        setAllUsers(mockData.users as User[]);
      }
    } else {
      setAllUsers(mockData.users as User[]);
    }
    
    if (storedTransactions) {
      try {
        const transactions = JSON.parse(storedTransactions);
        setPendingTransactions(transactions);
      } catch (error) {
        console.error('Error parsing stored transactions:', error);
        setPendingTransactions(mockData.transactions as Transaction[]);
      }
    } else {
      setPendingTransactions(mockData.transactions as Transaction[]);
    }
    
    if (storedUser && storedAuth === 'true') {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, []);
  
  // Sync currentUser with latest allUsers data for real-time dashboard updates
  useEffect(() => {
    if (currentUser && allUsers.length > 0) {
      const updated = allUsers.find(u => u.email === currentUser.email);
      if (updated && (updated.reputation !== currentUser.reputation || updated.trustScore !== currentUser.trustScore)) {
        setCurrentUser(updated);
        localStorage.setItem('currentUser', JSON.stringify(updated));
      }
    }
  }, [allUsers]);
  
  const login = async (email: string, password: string) => {
    const user = allUsers.find(user => user.email === email && user.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Login successful');
    } else {
      toast.error('Invalid credentials');
      throw new Error('Invalid credentials');
    }
  };
  
  const register = async (name: string, email: string, password?: string) => {
    const existingUser = allUsers.find(user => user.email === email);
    if (existingUser) {
      toast.error('Email already in use');
      throw new Error('Email already in use');
    }
    const strongPassword = password && password.length >= 12 ? password : generateStrongPassword();
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password: strongPassword,
      role: 'user',
      reputation: 100,
      trustScore: 50,
      pendingApprovals: 0,
      balance: 1000,
      reputationGrowth: 0,
      trustNetworkStrength: 60,
      transactionSuccessRate: 90,
      trustPoints: 0,
      createdAt: new Date().toISOString(),
    };
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('isAuthenticated', 'true');
    toast.success('Registration successful');
  };
  
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    toast.success('Logged out successfully');
  };

  const isAdmin = currentUser?.role === 'admin';
  
  const calculateTrustScore = (user: User): number => {
    const baseScore = 50;
    const reputationBonus = user.reputation * 0.2;
    const transactionBonus = user.transactionSuccessRate * 0.3;
    const trustPointsBonus = user.trustPoints * 0.1;
    const networkBonus = user.trustNetworkStrength * 0.2;
    
    const totalScore = baseScore + reputationBonus + transactionBonus + trustPointsBonus + networkBonus;
    return Math.min(100, Math.max(0, Math.round(totalScore)));
  };

  const updateUserTrustMetrics = (user: User, transaction: Transaction, isApproved: boolean) => {
    const trustPointsChange = isApproved ? Math.floor(transaction.amount / 100) : -5;
    const reputationChange = isApproved ? 1 : -2;
    const successRateChange = isApproved ? 1 : -1;
    
    return {
      ...user,
      trustPoints: Math.max(0, user.trustPoints + trustPointsChange),
      reputation: Math.max(0, user.reputation + reputationChange),
      transactionSuccessRate: Math.max(0, Math.min(100, user.transactionSuccessRate + successRateChange)),
      trustScore: calculateTrustScore({
        ...user,
        trustPoints: user.trustPoints + trustPointsChange,
        reputation: user.reputation + reputationChange,
        transactionSuccessRate: user.transactionSuccessRate + successRateChange
      })
    };
  };

  const createTransaction = async (sender: string, recipient: string, amount: number) => {
    const senderUser = allUsers.find(u => u.email === sender);
    const recipientUser = allUsers.find(u => u.email === recipient);
    
    if (!senderUser || !recipientUser) {
      toast.error('Invalid sender or recipient');
      return;
    }

    if (amount > senderUser.balance) {
      toast.error('Insufficient funds');
      return;
    }

    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const hash = await generateTransactionHashAsync(sender, recipient, amount);
    
    const newTransaction: Transaction = {
      id,
      sender,
      recipient,
      amount,
      timestamp: new Date().toISOString(),
      status: 'pending',
      hash,
    };
    
    const updatedTransactions = [newTransaction, ...pendingTransactions];
    setPendingTransactions(updatedTransactions);
    localStorage.setItem('pendingTransactions', JSON.stringify(updatedTransactions));
    
    const activity: TrustNetworkActivity = {
      id: `activity-${Date.now()}`,
      type: 'approval',
      description: `Transaction of $${amount} initiated from ${sender} to ${recipient}`,
      timestamp: new Date().toISOString(),
      userId: senderUser.id
    };
    
    setTrustNetworkActivities(prev => [activity, ...prev]);
    toast.success('Transaction created and pending approval');
  };
  
  const executeTransaction = async (recipient: string, amount: number): Promise<void> => {
    if (!currentUser) {
      toast.error('No user is logged in');
      throw new Error('No user is logged in');
    }
    
    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      throw new Error('Amount must be greater than 0');
    }
    
    if (amount > currentUser.balance) {
      toast.error('Insufficient funds');
      throw new Error('Insufficient funds');
    }
    
    await createTransaction(currentUser.email, recipient, amount);
    return Promise.resolve();
  };
  
  const approveTx = (id: string) => {
    if (!isAdmin) {
      toast.error('Only admins can approve transactions');
      return;
    }
    const txIndex = pendingTransactions.findIndex(tx => tx.id === id);
    if (txIndex === -1) {
      toast.error('Transaction not found');
      return;
    }
    const tx = pendingTransactions[txIndex];
    const senderUser = allUsers.find(u => u.email === tx.sender);
    const recipientUser = allUsers.find(u => u.email === tx.recipient);
    if (!senderUser || !recipientUser) {
      toast.error('Invalid transaction participants');
      return;
    }
    const updatedTx = {
      ...tx,
      status: 'approved' as const,
      reviewedBy: currentUser?.email,
      reviewedAt: new Date().toISOString(),
      trustPointsEarned: Math.floor(tx.amount / 100)
    };
    const updatedTransactions = [...pendingTransactions];
    updatedTransactions[txIndex] = updatedTx;
    setPendingTransactions(updatedTransactions);
    localStorage.setItem('pendingTransactions', JSON.stringify(updatedTransactions));
    setAllUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => {
        if (user.email === tx.sender) {
          return {
            ...updateUserTrustMetrics(user, tx, true),
            balance: Math.max(0, user.balance - tx.amount)
          };
        } else if (user.email === tx.recipient) {
          return {
            ...updateUserTrustMetrics(user, tx, true),
            balance: user.balance + tx.amount
          };
        }
        return user;
      });
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
    const activity: TrustNetworkActivity = {
      id: `activity-${Date.now()}`,
      type: 'approval',
      description: `Transaction ${id} approved by ${currentUser?.email}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || ''
    };
    setTrustNetworkActivities(prev => [activity, ...prev]);
    toast.success('Transaction approved successfully');
  };
  
  const rejectTx = (id: string, reason: string) => {
    if (!isAdmin) {
      toast.error('Only admins can reject transactions');
      return;
    }
    const txIndex = pendingTransactions.findIndex(tx => tx.id === id);
    if (txIndex === -1) {
      toast.error('Transaction not found');
      return;
    }
    const tx = pendingTransactions[txIndex];
    const senderUser = allUsers.find(u => u.email === tx.sender);
    if (!senderUser) {
      toast.error('Invalid transaction participants');
      return;
    }
    const updatedTx = {
      ...tx,
      status: 'rejected' as const,
      reviewedBy: currentUser?.email,
      reviewedAt: new Date().toISOString(),
      rejectionReason: reason
    };
    const updatedTransactions = [...pendingTransactions];
    updatedTransactions[txIndex] = updatedTx;
    setPendingTransactions(updatedTransactions);
    localStorage.setItem('pendingTransactions', JSON.stringify(updatedTransactions));
    let senderNew = null;
    setAllUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => {
        if (user.email === tx.sender) {
          senderNew = updateUserTrustMetrics(user, tx, false);
          return senderNew;
        }
        return user;
      });
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
      setTimeout(() => {
        toast.error(
          `Transaction rejected.\nSender: ${senderNew?.name} now has Trust Score: ${senderNew?.trustScore}, Reputation: ${senderNew?.reputation}.`
        );
      }, 100);
      return updatedUsers;
    });
    const activity: TrustNetworkActivity = {
      id: `activity-${Date.now()}`,
      type: 'rejection',
      description: `Transaction ${id} rejected by ${currentUser?.email}: ${reason}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || ''
    };
    setTrustNetworkActivities(prev => [activity, ...prev]);
  };
  
  const flagTx = (id: string) => {
    if (!isAdmin) {
      toast.error('Only admins can flag transactions');
      return;
    }

    const txIndex = pendingTransactions.findIndex(tx => tx.id === id);
    if (txIndex === -1) {
      toast.error('Transaction not found');
      return;
    }
    
    const tx = pendingTransactions[txIndex];
    const updatedTx = {
      ...tx,
      status: 'flagged' as const,
      reviewedBy: currentUser?.email,
      reviewedAt: new Date().toISOString()
    };
    
    const updatedTransactions = [...pendingTransactions];
    updatedTransactions[txIndex] = updatedTx;
    setPendingTransactions(updatedTransactions);
    localStorage.setItem('pendingTransactions', JSON.stringify(updatedTransactions));
    
    const activity: TrustNetworkActivity = {
      id: `activity-${Date.now()}`,
      type: 'flag',
      description: `Transaction ${id} flagged for review by ${currentUser?.email}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || ''
    };
    
    setTrustNetworkActivities(prev => [activity, ...prev]);
    toast.warning('Transaction flagged for review');
  };
  
  const reviewTx = (id: string) => {
    if (!isAdmin) {
      toast.error('Only admins can review transactions');
      return;
    }

    const txIndex = pendingTransactions.findIndex(tx => tx.id === id);
    if (txIndex === -1) {
      toast.error('Transaction not found');
      return;
    }
    
    const tx = pendingTransactions[txIndex];
    const updatedTx = {
      ...tx,
      status: 'under_review' as const,
      reviewedBy: currentUser?.email,
      reviewedAt: new Date().toISOString()
    };
    
    const updatedTransactions = [...pendingTransactions];
    updatedTransactions[txIndex] = updatedTx;
    setPendingTransactions(updatedTransactions);
    localStorage.setItem('pendingTransactions', JSON.stringify(updatedTransactions));
    
    const activity: TrustNetworkActivity = {
      id: `activity-${Date.now()}`,
      type: 'review',
      description: `Transaction ${id} marked for review by ${currentUser?.email}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || ''
    };
    
    setTrustNetworkActivities(prev => [activity, ...prev]);
    toast.info('Transaction marked for review');
  };
  
  const addUser = (name: string, email: string, password: string, isAdmin: boolean) => {
    if (!isAdmin) {
      toast.error('Only admins can add users');
      return;
    }
    const existingUser = allUsers.find(user => user.email === email);
    if (existingUser) {
      toast.error('Email already in use');
      return;
    }
    const strongPassword = password && password.length >= 12 ? password : generateStrongPassword();
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password: strongPassword,
      role: isAdmin ? 'admin' : 'user',
      reputation: 100,
      trustScore: 50,
      pendingApprovals: 0,
      balance: 1000,
      reputationGrowth: 0,
      trustNetworkStrength: 60,
      transactionSuccessRate: 90,
      trustPoints: 0,
      createdAt: new Date().toISOString(),
    };
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    const activity: TrustNetworkActivity = {
      id: `activity-${Date.now()}`,
      type: 'user_creation',
      description: `New user ${name} created by ${currentUser?.name}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || ''
    };
    setTrustNetworkActivities(prev => [activity, ...prev]);
    toast.success('User added successfully');
  };
  
  const adjustTrustPoints = (userId: string, points: number, reason: string) => {
    if (!isAdmin) {
      toast.error('Only admins can adjust trust points');
      return;
    }

    const userIndex = allUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      toast.error('User not found');
      return;
    }
    
    const user = allUsers[userIndex];
    const newTrustPoints = Math.max(0, user.trustPoints + points);
    
    // Create a new user object with updated trust points and trust score
    const updatedUser = {
      ...user,
      trustPoints: newTrustPoints,
      trustScore: Math.max(0, Math.min(100, user.trustScore + points)) // Directly adjust trust score
    };
    
    // Update the users array
    const updatedUsers = [...allUsers];
    updatedUsers[userIndex] = updatedUser;
    
    // Update state and storage
    setAllUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    
    // If this is the current user, update their data as well
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    // Create activity log
    const activity: TrustNetworkActivity = {
      id: `activity-${Date.now()}`,
      type: 'trust_adjustment',
      description: `Trust points adjusted for ${user.name} by ${currentUser?.name}: ${points} points (${reason}). New trust score: ${updatedUser.trustScore}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || ''
    };
    
    setTrustNetworkActivities(prev => [activity, ...prev]);
    
    // Show success message with updated values
    toast.success(`Trust points adjusted successfully. New trust score: ${updatedUser.trustScore}`);
  };
  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        pendingTransactions,
        createTransaction,
        executeTransaction,
        approveTx,
        rejectTx,
        flagTx,
        reviewTx,
        addUser,
        adjustTrustPoints,
        trustNetworkActivities,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// Helper to generate a strong password
function generateStrongPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=~';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
