import { Transaction, TransactionStatus, DashboardMetrics } from '@/types/transaction';

const merchants = [
  'Amazon India', 'Flipkart', 'Swiggy', 'Zomato', 'BigBasket',
  'MakeMyTrip', 'BookMyShow', 'PhonePe Transfer', 'GPay Transfer',
  'Uber India', 'Ola Cabs', 'IRCTC', 'Myntra', 'Ajio',
  'Steam Games', 'Netflix', 'Spotify', 'Adobe Creative',
  'Western Union', 'MoneyGram', 'Binance', 'Unknown Merchant',
];

const locations = [
  { city: 'Mumbai', country: 'India' },
  { city: 'Delhi', country: 'India' },
  { city: 'Bangalore', country: 'India' },
  { city: 'Chennai', country: 'India' },
  { city: 'Hyderabad', country: 'India' },
  { city: 'Kolkata', country: 'India' },
  { city: 'Lagos', country: 'Nigeria' },
  { city: 'Moscow', country: 'Russia' },
  { city: 'Shenzhen', country: 'China' },
  { city: 'Unknown', country: 'VPN/Proxy' },
];

const devices = ['iPhone 15', 'Samsung S24', 'Pixel 8', 'OnePlus 12', 'Desktop Chrome', 'Desktop Firefox', 'Unknown Device', 'Rooted Android'];

function randomId(): string {
  return 'txn_' + Math.random().toString(36).substring(2, 10);
}

function randomUserId(): string {
  return 'usr_' + Math.random().toString(36).substring(2, 8);
}

function generateTransaction(forceStatus?: TransactionStatus): Transaction {
  const roll = Math.random();
  const isSuspicious = forceStatus === 'suspicious' || (!forceStatus && roll > 0.88);
  const isWarning = forceStatus === 'warning' || (!forceStatus && !isSuspicious && roll > 0.78);

  const loc = isSuspicious
    ? locations[Math.floor(Math.random() * 4) + 6]
    : locations[Math.floor(Math.random() * 6)];

  const amount = isSuspicious
    ? Math.round((Math.random() * 80000 + 15000) * 100) / 100
    : isWarning
    ? Math.round((Math.random() * 20000 + 5000) * 100) / 100
    : Math.round((Math.random() * 4000 + 50) * 100) / 100;

  const fraudScore = isSuspicious
    ? Math.round((Math.random() * 0.2 + 0.8) * 100) / 100
    : isWarning
    ? Math.round((Math.random() * 0.25 + 0.5) * 100) / 100
    : Math.round((Math.random() * 0.35) * 100) / 100;

  const status: TransactionStatus = isSuspicious ? 'suspicious' : isWarning ? 'warning' : 'normal';

  const device = isSuspicious
    ? devices[Math.floor(Math.random() * 2) + 6]
    : devices[Math.floor(Math.random() * 6)];

  const merchant = isSuspicious
    ? merchants[Math.floor(Math.random() * 4) + 18]
    : merchants[Math.floor(Math.random() * 18)];

  return {
    id: randomId(),
    userId: randomUserId(),
    amount,
    currency: '₹',
    location: loc.city,
    country: loc.country,
    device,
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    fraudScore,
    status,
    merchant,
    isNew: false,
  };
}

export function generateInitialTransactions(count: number = 20): Transaction[] {
  const txns: Transaction[] = [];
  // Ensure at least 2 suspicious and 3 warning
  txns.push(generateTransaction('suspicious'));
  txns.push(generateTransaction('suspicious'));
  txns.push(generateTransaction('warning'));
  txns.push(generateTransaction('warning'));
  txns.push(generateTransaction('warning'));
  for (let i = 5; i < count; i++) {
    txns.push(generateTransaction());
  }
  return txns.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateNewTransaction(): Transaction {
  const txn = generateTransaction();
  txn.timestamp = new Date();
  txn.isNew = true;
  return txn;
}

export function computeMetrics(transactions: Transaction[]): DashboardMetrics {
  const flagged = transactions.filter(t => t.status === 'suspicious' || t.status === 'warning').length;
  const blocked = transactions.filter(t => t.status === 'suspicious').length;
  const totalVolume = transactions.reduce((s, t) => s + t.amount, 0);
  const avgScore = transactions.length
    ? transactions.reduce((s, t) => s + t.fraudScore, 0) / transactions.length
    : 0;

  return {
    totalTransactions: transactions.length,
    flaggedToday: flagged,
    blockedToday: blocked,
    avgFraudScore: Math.round(avgScore * 100) / 100,
    totalVolume: Math.round(totalVolume),
  };
}
