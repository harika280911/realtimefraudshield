import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';
import { X, MapPin, Smartphone, Clock, User, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TransactionDetailProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDetail({ transaction, onClose }: TransactionDetailProps) {
  return (
    <AnimatePresence>
      {transaction && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          className="w-[380px] shrink-0 border-l border-border bg-card h-screen sticky top-0 overflow-y-auto"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <span className="text-sm font-medium text-foreground">Transaction Detail</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Score */}
            <div className="text-center py-4">
              <div className="label-upper mb-1">Fraud Score</div>
              <div
                className={cn(
                  'font-mono-data text-4xl font-semibold',
                  transaction.fraudScore >= 0.8
                    ? 'text-destructive'
                    : transaction.fraudScore >= 0.5
                    ? 'text-warning'
                    : 'text-success'
                )}
              >
                {transaction.fraudScore.toFixed(2)}
              </div>
            </div>

            {/* Amount */}
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="label-upper mb-1">Amount</div>
              <div className="text-2xl font-semibold font-mono-data text-foreground">
                {transaction.currency}{transaction.amount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{transaction.merchant}</div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <DetailRow icon={<Hash className="h-3.5 w-3.5" />} label="Transaction ID" value={transaction.id} mono />
              <DetailRow icon={<User className="h-3.5 w-3.5" />} label="User ID" value={transaction.userId} mono />
              <DetailRow icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={`${transaction.location}, ${transaction.country}`} />
              <DetailRow icon={<Smartphone className="h-3.5 w-3.5" />} label="Device" value={transaction.device} />
              <DetailRow icon={<Clock className="h-3.5 w-3.5" />} label="Time" value={format(transaction.timestamp, 'dd MMM yyyy, HH:mm:ss')} />
            </div>

            {/* Actions */}
            {transaction.status === 'suspicious' && (
              <div className="space-y-2 pt-2">
                <button className="w-full py-2.5 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
                  Block Transaction
                </button>
                <button className="w-full py-2.5 px-4 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-accent transition-colors">
                  Mark as Safe
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetailRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div className="min-w-0">
        <div className="label-upper text-[11px]">{label}</div>
        <div className={cn('text-sm text-foreground break-all', mono && 'font-mono-data text-xs')}>{value}</div>
      </div>
    </div>
  );
}
