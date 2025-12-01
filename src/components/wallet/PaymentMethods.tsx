'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';

export interface PaymentMethod {
  id: string;
  type: 'fenanpay' | 'telebirr' | 'card' | 'bank';
  name: string;
  isConnected: boolean;
  details?: string;
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  onAddMethod?: () => void;
  onManageMethod?: (method: PaymentMethod) => void;
  className?: string;
}

const typeIcons: Record<PaymentMethod['type'], string> = {
  fenanpay: '🏦',
  telebirr: '📱',
  card: '💳',
  bank: '🏛️',
};

export function PaymentMethods({ 
  methods, 
  onAddMethod,
  onManageMethod,
  className = '' 
}: PaymentMethodsProps) {
  return (
    <div className={`px-4 ${className}`}>
      <SectionHeader title="Payment Methods" emoji="💳" />
      
      <div className="bg-tg-secondary rounded-xl border border-white/5 divide-y divide-white/5 overflow-hidden">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onManageMethod?.(method)}
            className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gaming-purple/20 to-gaming-pink/20 flex items-center justify-center text-xl">
              {typeIcons[method.type]}
            </div>
            
            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">
                {method.name}
              </p>
              {method.details && (
                <p className="text-tg-hint text-xs truncate">
                  {method.details}
                </p>
              )}
            </div>
            
            {/* Status */}
            <span className={`text-xs px-2 py-1 rounded-full ${
              method.isConnected 
                ? 'bg-green-400/20 text-green-400' 
                : 'bg-tg-hint/20 text-tg-hint'
            }`}>
              {method.isConnected ? 'Connected' : 'Not connected'}
            </span>
          </button>
        ))}
        
        {/* Add new method button */}
        <button
          onClick={onAddMethod}
          className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-tg-hint">
            +
          </div>
          <span className="text-gaming-purple text-sm font-medium">
            Add Payment Method
          </span>
        </button>
      </div>
    </div>
  );
}
