'use client';

import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

type PlanType = 'free' | 'premium';

interface SubscriptionCardProps {
  plan: PlanType;
  gamesPlayedToday: number;
  dailyLimit: number;
  onUpgrade?: () => void;
  className?: string;
}

const planInfo = {
  free: {
    name: 'Free Plan',
    icon: '🆓',
    color: 'from-gray-500/20 to-gray-600/20',
    borderColor: 'border-gray-500/30',
  },
  premium: {
    name: 'Premium Plan',
    icon: '👑',
    color: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/30',
  },
};

export function SubscriptionCard({ 
  plan, 
  gamesPlayedToday, 
  dailyLimit,
  onUpgrade,
  className = '' 
}: SubscriptionCardProps) {
  const info = planInfo[plan];
  const progress = Math.min((gamesPlayedToday / dailyLimit) * 100, 100);
  const isLimitReached = gamesPlayedToday >= dailyLimit;

  return (
    <div className={`px-4 ${className}`}>
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <span>👑</span> Subscription Status
      </h3>
      
      <div className={`rounded-xl bg-gradient-to-br ${info.color} border ${info.borderColor} p-4`}>
        {/* Plan header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{info.icon}</span>
            <span className="text-white font-semibold">{info.name}</span>
          </div>
          {plan === 'free' && (
            <span className="text-xs text-gaming-purple bg-gaming-purple/20 px-2 py-1 rounded-full">
              Limited
            </span>
          )}
        </div>
        
        {/* Usage info */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-tg-hint">Games played today</span>
            <span className={`font-medium ${isLimitReached ? 'text-red-400' : 'text-white'}`}>
              {gamesPlayedToday}/{dailyLimit}
            </span>
          </div>
          <ProgressBar 
            value={progress} 
            gradient={!isLimitReached}
            className={isLimitReached ? '[&>div>div]:bg-red-500' : ''}
          />
        </div>
        
        {/* Premium benefits or upgrade CTA */}
        {plan === 'free' ? (
          <div className="space-y-3">
            <div className="text-xs text-tg-hint">
              <span className="text-gaming-pink">✨ Premium benefits:</span> Unlimited games, no ads, exclusive content
            </div>
            <Button
              onClick={onUpgrade}
              variant="primary"
              size="sm"
              fullWidth
              rightIcon={<span>🚀</span>}
            >
              Upgrade to Premium
            </Button>
          </div>
        ) : (
          <div className="text-xs text-green-400 flex items-center gap-1">
            <span>✓</span> Unlimited access active
          </div>
        )}
      </div>
    </div>
  );
}
