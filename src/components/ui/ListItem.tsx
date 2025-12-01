'use client';

interface ListItemProps {
  icon: string;
  label: string;
  value?: string;
  description?: string;
  onClick?: () => void;
  toggle?: { 
    checked: boolean; 
    onChange: (checked: boolean) => void;
  };
  showArrow?: boolean;
  className?: string;
}

export function ListItem({ 
  icon, 
  label, 
  value,
  description,
  onClick, 
  toggle,
  showArrow = false,
  className = '' 
}: ListItemProps) {
  const isClickable = onClick || toggle;
  
  const handleClick = () => {
    if (toggle) {
      toggle.onChange(!toggle.checked);
    } else if (onClick) {
      onClick();
    }
  };
  
  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      className={`
        flex items-center gap-3 px-4 py-3.5 
        ${isClickable ? 'cursor-pointer active:bg-white/5' : ''}
        transition-colors
        ${className}
      `}
    >
      {/* Icon */}
      <span className="text-xl w-8 text-center flex-shrink-0">{icon}</span>
      
      {/* Label & Description */}
      <div className="flex-1 min-w-0">
        <span className="text-white text-sm font-medium block">{label}</span>
        {description && (
          <span className="text-tg-hint text-xs block truncate">{description}</span>
        )}
      </div>
      
      {/* Value / Toggle / Arrow */}
      {toggle ? (
        <div 
          className={`
            w-11 h-6 rounded-full p-0.5 transition-colors duration-200
            ${toggle.checked ? 'bg-gaming-purple' : 'bg-white/20'}
          `}
        >
          <div 
            className={`
              w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
              ${toggle.checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </div>
      ) : value ? (
        <span className="text-tg-hint text-sm">{value}</span>
      ) : showArrow ? (
        <span className="text-tg-hint text-sm">→</span>
      ) : null}
    </div>
  );
}
