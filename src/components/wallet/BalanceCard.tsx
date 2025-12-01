'use client';

import { Button } from '@/components/ui/Button';

interface BalanceCardProps {
  balance: number;
  currency?: string;
  onAddFunds?: () => void;
  onSend?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function BalanceCard({ 
  balance, 
  currency = 'ETB',
  onAddFunds, 
  onSend,
  isLoading = false,
  className = '' 
}: BalanceCardProps) {
  const formattedBalance = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  if (isLoading) {
    return (
      <div className={`mx-4 ${className}`}>
        <div className="rounded-2xl bg-gradient-to-br from-gaming-purple to-gaming-pink p-6 animate-pulse">
          <div className="h-4 w-24 bg-white/20 rounded mx-auto mb-4" />
          <div className="h-10 w-32 bg-white/20 rounded mx-auto mb-6" />
          <div className="flex gap-3 justify-center">
            <div className="h-10 w-28 bg-white/20 rounded-xl" />
            <div className="h-10 w-28 bg-white/20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mx-4 ${className}`}>
      <div className="relative rounded-2xl bg-gradient-to-br from-gaming-purple to-gaming-pink p-6 overflow-hidden shadow-xl shadow-gaming-purple/20">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-4xl opacity-20">💰</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-10">✨</div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        
        {/* Content */}
        <div className="relative text-center">
          <p className="text-white/80 text-sm mb-1">Your Balance</p>
          
          {/* Balance display */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-4xl font-bold text-white">
              {formattedBalance}
            </span>
            <span className="text-white/70 text-lg font-medium">
              {currency}
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onAddFunds}
              variant="secondary"
              size="md"
              leftIcon={<span>➕</span>}
              className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur"
            >
              Add Funds
            </Button>
            <Button
              onClick={onSend}
              variant="secondary"
              size="md"
              leftIcon={<span>➡️</span>}
              className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
