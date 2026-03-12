import { DashboardMetrics } from '@/types/transaction';
import { AlertTriangle, Ban, Activity, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: 'default' | 'destructive' | 'warning' | 'success';
}

function MetricCard({ label, value, icon, accent = 'default' }: MetricCardProps) {
  const accentClasses = {
    default: 'text-foreground',
    destructive: 'text-destructive',
    warning: 'text-warning',
    success: 'text-success',
  };

  return (
    <div className="bg-card rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="label-upper">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <span className={`text-2xl font-semibold font-mono-data ${accentClasses[accent]}`}>
        {value}
      </span>
    </div>
  );
}

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard
        label="Transactions"
        value={metrics.totalTransactions}
        icon={<Activity className="h-4 w-4" />}
      />
      <MetricCard
        label="Flagged"
        value={metrics.flaggedToday}
        icon={<AlertTriangle className="h-4 w-4" />}
        accent="warning"
      />
      <MetricCard
        label="Blocked"
        value={metrics.blockedToday}
        icon={<Ban className="h-4 w-4" />}
        accent="destructive"
      />
      <MetricCard
        label="Volume"
        value={`₹${metrics.totalVolume.toLocaleString()}`}
        icon={<TrendingUp className="h-4 w-4" />}
        accent="success"
      />
    </div>
  );
}
