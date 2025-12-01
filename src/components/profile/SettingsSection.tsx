'use client';

import { ListItem } from '@/components/ui/ListItem';
import { SectionHeader } from '@/components/ui/SectionHeader';

export interface SettingItem {
  id: string;
  icon: string;
  label: string;
  type: 'link' | 'toggle' | 'value';
  value?: string;
  checked?: boolean;
  onClick?: () => void;
  onToggle?: (checked: boolean) => void;
}

interface SettingsSectionProps {
  title: string;
  emoji: string;
  items: SettingItem[];
  className?: string;
}

export function SettingsSection({ 
  title, 
  emoji, 
  items,
  className = '' 
}: SettingsSectionProps) {
  return (
    <div className={`px-4 ${className}`}>
      <SectionHeader title={title} emoji={emoji} />
      
      <div className="bg-tg-secondary rounded-xl border border-white/5 divide-y divide-white/5 overflow-hidden">
        {items.map((item) => (
          <ListItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            value={item.type === 'value' ? item.value : undefined}
            showArrow={item.type === 'link'}
            toggle={item.type === 'toggle' ? {
              checked: item.checked || false,
              onChange: item.onToggle || (() => {}),
            } : undefined}
            onClick={item.type === 'link' ? item.onClick : undefined}
          />
        ))}
      </div>
    </div>
  );
}
