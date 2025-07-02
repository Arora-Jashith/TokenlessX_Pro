
import { Transaction, TrustNetworkActivity } from '../types/user';
import { generateTransactionHash } from './hashGenerator';

// Generate mock transaction data
export const generateMockTransactions = (userId: string): Transaction[] => {
  const recipients = [
    'alice@example.com',
    'bob@example.com',
    'charlie@example.com',
    'dave@example.com'
  ];
  
  const transactions: Transaction[] = [];
  
  // Generate 10 random transactions
  for (let i = 0; i < 10; i++) {
    const recipient = recipients[Math.floor(Math.random() * recipients.length)];
    const amount = Math.floor(Math.random() * 200) + 50;
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString();
    const hash = generateTransactionHash(userId, recipient, amount, timestamp);
    
    transactions.push({
      id: `tx-${i}`,
      sender: userId,
      recipient,
      amount,
      timestamp,
      status: Math.random() > 0.2 ? 'approved' : Math.random() > 0.5 ? 'pending' : 'rejected',
      hash,
      trustPointsEarned: Math.floor(Math.random() * 5) + 1
    });
  }
  
  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate mock trust network activity
export const generateMockTrustNetworkActivity = (): TrustNetworkActivity[] => {
  const activities: TrustNetworkActivity[] = [
    {
      id: 'activity-1',
      type: 'approval',
      description: 'Transaction Approved',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      trustPointsChange: 5
    },
    {
      id: 'activity-2',
      type: 'fraud_attempt',
      description: 'Fraud Attempt Detected',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      networkProtected: true
    },
    {
      id: 'activity-3',
      type: 'approval',
      description: 'Transaction Approved',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      trustPointsChange: 3
    }
  ];
  
  return activities;
};
