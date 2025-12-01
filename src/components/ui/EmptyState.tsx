'use client';

import { Button } from './Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: { 
    label: string; 
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`py-12 px-6 text-center ${className}`}>
      <span className="text-5xl mb-4 block animate-pulse">{icon}</span>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-tg-hint text-sm max-w-xs mx-auto mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="primary" size="md">
          {action.label}
        </Button>
      )}
    </div>
  );
}
