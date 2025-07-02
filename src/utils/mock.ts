import { User, Transaction } from '../types/user';
import { generateSHA256Hash } from './hashGenerator';

export const mockData = {
  users: [
    {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'A!d9f$2kLm@1#zQw',
      role: 'admin',
      reputation: 98,
      trustScore: 95,
      pendingApprovals: 3,
      balance: 5000,
      reputationGrowth: 15,
      trustNetworkStrength: 85,
      transactionSuccessRate: 98,
      trustPoints: 250,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-2',
      name: 'Regular User',
      email: 'user@example.com',
      password: 'S7@pL!x9#vQ2$wE3',
      role: 'user',
      reputation: 87,
      trustScore: 84,
      pendingApprovals: 1,
      balance: 2500,
      reputationGrowth: 8,
      trustNetworkStrength: 72,
      transactionSuccessRate: 94,
      trustPoints: 120,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-3',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'Xy!8@zQw#2Lm$1Df',
      role: 'user',
      reputation: 92,
      trustScore: 88,
      pendingApprovals: 2,
      balance: 3200,
      reputationGrowth: 12,
      trustNetworkStrength: 78,
      transactionSuccessRate: 96,
      trustPoints: 180,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-4',
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'B0b$M!tH#7x2@qW',
      role: 'user',
      reputation: 85,
      trustScore: 81,
      pendingApprovals: 0,
      balance: 1800,
      reputationGrowth: 5,
      trustNetworkStrength: 68,
      transactionSuccessRate: 92,
      trustPoints: 95,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-5',
      name: 'Manager',
      email: 'manager@example.com',
      password: 'M@nAg3r!2024#xY',
      role: 'admin',
      reputation: 96,
      trustScore: 92,
      pendingApprovals: 5,
      balance: 4500,
      reputationGrowth: 10,
      trustNetworkStrength: 82,
      transactionSuccessRate: 97,
      trustPoints: 220,
      createdAt: new Date().toISOString()
    }
  ],
  transactions: [
    {
      id: 'tx-1',
      sender: 'user@example.com',
      recipient: 'alice@example.com',
      amount: 250,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'approved',
      hash: 'abc123def456',
      trustPointsEarned: 3
    },
    {
      id: 'tx-2',
      sender: 'alice@example.com',
      recipient: 'bob@example.com',
      amount: 175,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'pending',
      hash: 'ghi789jkl012'
    },
    {
      id: 'tx-3',
      sender: 'admin@example.com',
      recipient: 'user@example.com',
      amount: 500,
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      status: 'approved',
      hash: 'mno345pqr678',
      trustPointsEarned: 5
    }
  ]
};

export const generateTransactionHash = async (sender: string, recipient: string, amount: number, timestamp?: string) => {
  const data = `${sender}:${recipient}:${amount}:${timestamp || new Date().toISOString()}`;
  return await generateSHA256Hash(data);
};
