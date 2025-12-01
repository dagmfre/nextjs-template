'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'game' | 'referral' | 'subscription';
  description: string;
  amount: number;
  currency: string;
  date: Date;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onSeeAll?: () => void;
  className?: string;
}

const typeIcons: Record<Transaction['type'], string> = {
  deposit: '↓',
  withdrawal: '↑',
  game: '🎮',
  referral: '👥',
  subscription: '👑',
};

const typeColors: Record<Transaction['type'], { icon: string; amount: string }> = {
  deposit: { icon: 'text-green-400 bg-green-400/20', amount: 'text-green-400' },
  withdrawal: { icon: 'text-red-400 bg-red-400/20', amount: 'text-red-400' },
  game: { icon: 'text-gaming-purple bg-gaming-purple/20', amount: 'text-red-400' },
  referral: { icon: 'text-blue-400 bg-blue-400/20', amount: 'text-green-400' },
  subscription: { icon: 'text-yellow-400 bg-yellow-400/20', amount: 'text-red-400' },
};

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatAmount(amount: number, currency: string): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}${formatted} ${currency}`;
}

export function TransactionList({ 
  transactions, 
  isLoading = false,
  onSeeAll,
  className = '' 
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className={`px-4 ${className}`}>
        <SectionHeader title="Recent Transactions" emoji="📜" />
        <div className="bg-tg-secondary rounded-xl border border-white/5 divide-y divide-white/5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={`px-4 ${className}`}>
        <SectionHeader title="Recent Transactions" emoji="📜" />
        <div className="bg-tg-secondary rounded-xl border border-white/5 p-8 text-center">
          <span className="text-4xl mb-3 block">💸</span>
          <p className="text-tg-hint text-sm">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-4 ${className}`}>
      <SectionHeader 
        title="Recent Transactions" 
        emoji="📜"
        action={onSeeAll ? { label: 'See All', onClick: onSeeAll } : undefined}
      />
      
      <div className="bg-tg-secondary rounded-xl border border-white/5 divide-y divide-white/5 overflow-hidden">
        {transactions.map((tx) => {
          const colors = typeColors[tx.type];
          
          return (
            <div 
              key={tx.id} 
              className="p-4 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer"
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${colors.icon}`}>
                {typeIcons[tx.type]}
              </div>
              
              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {tx.description}
                </p>
                <p className="text-tg-hint text-xs">
                  {formatDate(tx.date)}
                </p>
              </div>
              
              {/* Amount */}
              <span className={`text-sm font-semibold ${colors.amount}`}>
                {formatAmount(tx.amount, tx.currency)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
