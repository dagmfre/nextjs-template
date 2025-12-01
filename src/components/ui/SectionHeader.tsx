'use client';

interface SectionHeaderProps {
  title: string;
  emoji?: string;
  action?: { 
    label: string; 
    onClick: () => void;
  };
  className?: string;
}

export function SectionHeader({ 
  title, 
  emoji, 
  action,
  className = '' 
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        {emoji && <span>{emoji}</span>}
        {title}
      </h3>
      {action && (
        <button
          onClick={action.onClick}
          className="text-xs text-gaming-purple hover:text-gaming-pink transition-colors font-medium"
        >
          {action.label} →
        </button>
      )}
    </div>
  );
}
