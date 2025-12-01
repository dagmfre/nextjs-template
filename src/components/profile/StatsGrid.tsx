'use client';

import { StatCard } from '@/components/ui/StatCard';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface Stat {
  value: string | number;
  label: string;
  icon?: string;
}

interface StatsGridProps {
  stats: Stat[];
  className?: string;
}

export function StatsGrid({ stats, className = '' }: StatsGridProps) {
  return (
    <div className={`px-4 ${className}`}>
      <SectionHeader title="Your Stats" emoji="📊" />
      
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            value={stat.value}
            label={stat.label}
            icon={stat.icon}
          />
        ))}
      </div>
    </div>
  );
}
