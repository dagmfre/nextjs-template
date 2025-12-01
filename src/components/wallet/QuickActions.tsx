'use client';

interface QuickAction {
  icon: string;
  label: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  className?: string;
}

const defaultActions: QuickAction[] = [
  { icon: '💳', label: 'Top Up', onClick: () => console.log('Top Up') },
  { icon: '🎁', label: 'Gift', onClick: () => console.log('Gift') },
  { icon: '📊', label: 'History', onClick: () => console.log('History') },
  { icon: '⚙️', label: 'Settings', onClick: () => console.log('Settings') },
];

export function QuickActions({ 
  actions = defaultActions,
  className = '' 
}: QuickActionsProps) {
  return (
    <div className={`px-4 ${className}`}>
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <span>⚡</span> Quick Actions
      </h3>
      
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-tg-secondary border border-white/5 hover:border-gaming-purple/30 transition-all active:scale-95"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gaming-purple/20 to-gaming-pink/20 flex items-center justify-center text-2xl">
              {action.icon}
            </div>
            <span className="text-xs text-tg-hint font-medium">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
