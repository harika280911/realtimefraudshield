import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/transaction';
import { generateInitialTransactions, generateNewTransaction, computeMetrics } from '@/lib/transaction-engine';
import { MetricsGrid } from '@/components/MetricsGrid';
import { TransactionList } from '@/components/TransactionList';
import { TransactionDetail } from '@/components/TransactionDetail';
import { FraudAlertToast } from '@/components/FraudAlertToast';
import { AppSidebar } from '@/components/AppSidebar';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => generateInitialTransactions(25));
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [alertTxn, setAlertTxn] = useState<Transaction | null>(null);

  const metrics = computeMetrics(transactions);

  // Simulate real-time incoming transactions
  useEffect(() => {
    const interval = setInterval(() => {
      const newTxn = generateNewTransaction();
      setTransactions(prev => {
        const updated = [newTxn, ...prev].slice(0, 50);
        return updated;
      });

      if (newTxn.status === 'suspicious') {
        setAlertTxn(newTxn);
        setTimeout(() => setAlertTxn(prev => (prev?.id === newTxn.id ? null : prev)), 6000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleViewAlert = useCallback((txn: Transaction) => {
    setSelectedTxn(txn);
    setAlertTxn(null);
  }, []);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <div className="flex flex-1 min-w-0">
        <main className="flex-1 p-6 space-y-4 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Transaction Monitor</h1>
              <p className="text-xs text-muted-foreground">Real-time fraud detection dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>

          <MetricsGrid metrics={metrics} />

          <TransactionList
            transactions={transactions}
            onSelect={setSelectedTxn}
            selectedId={selectedTxn?.id}
          />
        </main>

        <TransactionDetail
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
        />
      </div>

      <FraudAlertToast
        transaction={alertTxn}
        onDismiss={() => setAlertTxn(null)}
        onView={handleViewAlert}
      />
    </div>
  );
};

export default Index;
