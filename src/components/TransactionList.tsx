import { Transaction } from '@/types/transaction';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

function StatusPill({ status }: { status: Transaction['status'] }) {
  const styles = {
    normal: 'bg-success/10 text-success',
    suspicious: 'bg-destructive/10 text-destructive',
    warning: 'bg-warning/10 text-warning',
    review: 'bg-ring/10 text-ring',
  };
  const labels = { normal: 'Normal', suspicious: 'Suspicious', warning: 'Warning', review: 'Review' };

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', styles[status])}>
      {labels[status]}
    </span>
  );
}

function FraudScore({ score }: { score: number }) {
  const color = score >= 0.8 ? 'text-destructive' : score >= 0.5 ? 'text-warning' : 'text-success';
  return <span className={cn('font-mono-data text-base font-semibold', color)}>{score.toFixed(2)}</span>;
}

interface TransactionListProps {
  transactions: Transaction[];
  onSelect: (txn: Transaction) => void;
  selectedId?: string;
}

export function TransactionList({ transactions, onSelect, selectedId }: TransactionListProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <span className="text-sm font-medium text-foreground">Recent Transactions</span>
        <span className="ml-2 text-xs text-muted-foreground">{transactions.length} total</span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[1fr_100px_120px_100px_80px_80px] gap-2 px-4 py-2 border-b border-border">
        <span className="label-upper">ID / Merchant</span>
        <span className="label-upper">Amount</span>
        <span className="label-upper">Location</span>
        <span className="label-upper">Device</span>
        <span className="label-upper">Score</span>
        <span className="label-upper">Status</span>
      </div>

      {/* Rows */}
      <div className="max-h-[520px] overflow-y-auto">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            onClick={() => onSelect(txn)}
            className={cn(
              'grid grid-cols-[1fr_100px_120px_100px_80px_80px] gap-2 px-4 py-3 cursor-pointer transition-colors duration-150',
              txn.status === 'suspicious' && 'row-suspicious',
              txn.status === 'warning' && 'row-warning',
              txn.status === 'normal' && 'hover:bg-secondary',
              txn.isNew && 'animate-pulse-alert',
              selectedId === txn.id && 'bg-secondary'
            )}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{txn.merchant}</div>
              <div className="text-xs text-muted-foreground font-mono-data truncate">
                {txn.id} · {format(txn.timestamp, 'HH:mm:ss')}
              </div>
            </div>
            <div className="font-mono-data text-sm text-foreground self-center">
              {txn.currency}{txn.amount.toLocaleString()}
            </div>
            <div className="self-center">
              <div className="text-sm text-foreground">{txn.location}</div>
              <div className="text-xs text-muted-foreground">{txn.country}</div>
            </div>
            <div className="text-xs text-muted-foreground self-center truncate">{txn.device}</div>
            <div className="self-center">
              <FraudScore score={txn.fraudScore} />
            </div>
            <div className="self-center">
              <StatusPill status={txn.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
