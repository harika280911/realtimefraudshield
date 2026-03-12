import { Transaction } from '@/types/transaction';

export interface TrendPoint {
  hour: string;
  total: number;
  suspicious: number;
  warning: number;
}

export interface GeoPoint {
  country: string;
  count: number;
  suspicious: number;
}

export interface ScoreBucket {
  range: string;
  count: number;
}

export function computeTrendData(transactions: Transaction[]): TrendPoint[] {
  const hours: Record<string, { total: number; suspicious: number; warning: number }> = {};
  
  // Generate last 12 hours
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.now() - i * 3600000);
    const key = `${d.getHours().toString().padStart(2, '0')}:00`;
    hours[key] = { total: 0, suspicious: 0, warning: 0 };
  }

  transactions.forEach(t => {
    const key = `${t.timestamp.getHours().toString().padStart(2, '0')}:00`;
    if (hours[key]) {
      hours[key].total++;
      if (t.status === 'suspicious') hours[key].suspicious++;
      if (t.status === 'warning') hours[key].warning++;
    }
  });

  return Object.entries(hours).map(([hour, data]) => ({ hour, ...data }));
}

export function computeGeoData(transactions: Transaction[]): GeoPoint[] {
  const geo: Record<string, { count: number; suspicious: number }> = {};

  transactions.forEach(t => {
    if (!geo[t.country]) geo[t.country] = { count: 0, suspicious: 0 };
    geo[t.country].count++;
    if (t.status === 'suspicious') geo[t.country].suspicious++;
  });

  return Object.entries(geo)
    .map(([country, data]) => ({ country, ...data }))
    .sort((a, b) => b.count - a.count);
}

export function computeScoreDistribution(transactions: Transaction[]): ScoreBucket[] {
  const buckets = [
    { range: '0.0–0.2', min: 0, max: 0.2 },
    { range: '0.2–0.4', min: 0.2, max: 0.4 },
    { range: '0.4–0.6', min: 0.4, max: 0.6 },
    { range: '0.6–0.8', min: 0.6, max: 0.8 },
    { range: '0.8–1.0', min: 0.8, max: 1.01 },
  ];

  return buckets.map(b => ({
    range: b.range,
    count: transactions.filter(t => t.fraudScore >= b.min && t.fraudScore < b.max).length,
  }));
}
