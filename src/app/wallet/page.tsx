'use client';

import { useState, useEffect } from 'react';

// Layout components
import { Container } from '@/components/layout/Container';
import { BottomNav } from '@/components/layout/BottomNav';

// Wallet components
import { BalanceCard } from '@/components/wallet/BalanceCard';
import { QuickActions } from '@/components/wallet/QuickActions';
import { SubscriptionCard } from '@/components/wallet/SubscriptionCard';
import { TransactionList, Transaction } from '@/components/wallet/TransactionList';
import { PaymentMethods, PaymentMethod } from '@/components/wallet/PaymentMethods';

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    description: 'Deposit via FenanPay',
    amount: 100,
    currency: 'ETB',
    date: new Date(),
  },
  {
    id: '2',
    type: 'game',
    description: 'Ninja Leap - Game Credit',
    amount: -5,
    currency: 'ETB',
    date: new Date(Date.now() - 86400000), // Yesterday
  },
  {
    id: '3',
    type: 'referral',
    description: 'Referral Bonus - @friend',
    amount: 20,
    currency: 'ETB',
    date: new Date(Date.now() - 86400000 * 2), // 2 days ago
  },
  {
    id: '4',
    type: 'game',
    description: 'Asteroid - Game Credit',
    amount: -5,
    currency: 'ETB',
    date: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: '5',
    type: 'deposit',
    description: 'Deposit via TeleBirr',
    amount: 50,
    currency: 'ETB',
    date: new Date(Date.now() - 86400000 * 5),
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'fenanpay',
    name: 'FenanPay',
    isConnected: true,
    details: 'Primary payment method',
  },
  {
    id: '2',
    type: 'telebirr',
    name: 'TeleBirr',
    isConnected: false,
  },
];

export default function WalletPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setBalance(160); // Mock balance in ETB
      setTransactions(mockTransactions);
      setPaymentMethods(mockPaymentMethods);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleAddFunds = () => {
    console.log('Add funds clicked');
    // TODO: Open add funds modal
  };

  const handleSend = () => {
    console.log('Send clicked');
    // TODO: Open send modal
  };

  const handleUpgrade = () => {
    console.log('Upgrade clicked');
    // TODO: Open subscription modal
  };

  const handleSeeAllTransactions = () => {
    console.log('See all transactions');
    // TODO: Navigate to transactions page
  };

  const handleAddPaymentMethod = () => {
    console.log('Add payment method');
    // TODO: Open payment method modal
  };

  const handleManagePaymentMethod = (method: PaymentMethod) => {
    console.log('Manage payment method:', method);
    // TODO: Open payment method details
  };

  return (
    <>
      <Container withBottomNav>
        {/* Page Header */}
        <div className="px-4 pt-4 pb-6">
          <h1 className="text-xl font-bold text-white">
            💰 Wallet
          </h1>
          <p className="text-tg-hint text-sm mt-1">
            Manage your balance and payments
          </p>
        </div>

        {/* Balance Card */}
        <BalanceCard
          balance={balance}
          currency="ETB"
          onAddFunds={handleAddFunds}
          onSend={handleSend}
          isLoading={isLoading}
          className="mb-6"
        />

        {/* Quick Actions */}
        <QuickActions className="mb-6" />

        {/* Subscription Status */}
        <SubscriptionCard
          plan="free"
          gamesPlayedToday={3}
          dailyLimit={5}
          onUpgrade={handleUpgrade}
          className="mb-6"
        />

        {/* Recent Transactions */}
        <TransactionList
          transactions={transactions.slice(0, 5)}
          isLoading={isLoading}
          onSeeAll={handleSeeAllTransactions}
          className="mb-6"
        />

        {/* Payment Methods */}
        <PaymentMethods
          methods={paymentMethods}
          onAddMethod={handleAddPaymentMethod}
          onManageMethod={handleManagePaymentMethod}
          className="mb-6"
        />

        {/* Bottom padding for scroll */}
        <div className="h-4" />
      </Container>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}
