export interface User {
  id: string;
  email: string;
  name: string;
  reputation: number;
  trustScore: number;
  pendingApprovals: number;
  balance: number;
  reputationGrowth: number;
  trustNetworkStrength: number;
  transactionSuccessRate: number;
  trustPoints: number;
  password?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Transaction {
  id: string;
  sender: string;
  recipient: string;
  amount: number;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'under_review';
  hash: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  trustPointsEarned?: number;
}

export interface TrustNetworkActivity {
  id: string;
  type: 'approval' | 'rejection' | 'flag' | 'review' | 'user_creation' | 'trust_adjustment' | 'fraud_attempt';
  description: string;
  timestamp: string;
  userId: string;
}

export interface TrustAction {
  type: 'approve' | 'reject' | 'flag' | 'review';
  transactionId: string;
  reason?: string;
}
