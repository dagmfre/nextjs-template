'use client';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({ src, name = '?', size = 'md', className = '' }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={`
          rounded-full object-cover
          ${sizeStyles[size]}
          ${className}
        `}
      />
    );
  }
  
  return (
    <div
      className={`
        rounded-full bg-gradient-to-br from-gaming-purple to-gaming-pink
        flex items-center justify-center text-white font-bold
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {initial}
    </div>
  );
}
