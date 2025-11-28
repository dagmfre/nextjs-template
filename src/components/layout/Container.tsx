'use client';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  withBottomNav?: boolean;
}

export function Container({ 
  children, 
  className = '',
  withBottomNav = true,
}: ContainerProps) {
  return (
    <main 
      className={`
        min-h-screen bg-tg-bg
        ${withBottomNav ? 'pb-20' : ''}
        ${className}
      `}
    >
      {children}
    </main>
  );
}
