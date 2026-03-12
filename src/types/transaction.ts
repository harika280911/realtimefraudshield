export type TransactionStatus = 'normal' | 'suspicious' | 'warning' | 'review';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  location: string;
  country: string;
  device: string;
  timestamp: Date;
  fraudScore: number;
  status: TransactionStatus;
  merchant: string;
  isNew?: boolean;
}

export interface DashboardMetrics {
  totalTransactions: number;
  flaggedToday: number;
  blockedToday: number;
  avgFraudScore: number;
  totalVolume: number;
}
