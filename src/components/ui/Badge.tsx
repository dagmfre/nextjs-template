'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'premium';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-gaming-purple/30 text-purple-300',
  success: 'bg-green-500/30 text-green-300',
  warning: 'bg-yellow-500/30 text-yellow-300',
  error: 'bg-red-500/30 text-red-300',
  premium: 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-300',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '' 
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
