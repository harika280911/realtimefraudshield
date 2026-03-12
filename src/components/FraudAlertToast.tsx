import { Transaction } from '@/types/transaction';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface FraudAlertToastProps {
  transaction: Transaction | null;
  onDismiss: () => void;
  onView: (txn: Transaction) => void;
}

export function FraudAlertToast({ transaction, onDismiss, onView }: FraudAlertToastProps) {
  return (
    <AnimatePresence>
      {transaction && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          className="fixed top-4 right-4 z-50 w-[380px] rounded-xl bg-card p-4 shadow-[0_0_0_1px_hsl(var(--destructive)),0_4px_12px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">
                ⚠ Suspicious Transaction Detected
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {transaction.currency}{transaction.amount.toLocaleString()} from {transaction.location} ({transaction.country})
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">Score:</span>
                <span className="font-mono-data text-sm font-semibold text-destructive">
                  {transaction.fraudScore.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => onView(transaction)}
                className="mt-2 text-xs font-medium text-ring hover:underline"
              >
                View Details →
              </button>
            </div>
            <button onClick={onDismiss} className="p-1 hover:bg-secondary rounded transition-colors">
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
