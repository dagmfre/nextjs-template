'use client';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const trendColors = {
  up: 'text-green-400',
  down: 'text-red-400',
  neutral: 'text-tg-hint',
};

const trendIcons = {
  up: '↑',
  down: '↓',
  neutral: '→',
};

export function StatCard({ 
  value, 
  label, 
  icon,
  trend,
  className = '' 
}: StatCardProps) {
  return (
    <div className={`bg-tg-secondary rounded-xl p-4 border border-white/5 text-center ${className}`}>
      {icon && (
        <span className="text-2xl mb-2 block">{icon}</span>
      )}
      <div className="flex items-center justify-center gap-1">
        <span className="text-xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trend && (
          <span className={`text-xs ${trendColors[trend]}`}>
            {trendIcons[trend]}
          </span>
        )}
      </div>
      <span className="text-xs text-tg-hint mt-1 block">{label}</span>
    </div>
  );
}
