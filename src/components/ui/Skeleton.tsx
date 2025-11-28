'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };
  
  return (
    <div
      className={`skeleton ${variantClasses[variant]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

// Pre-composed skeletons for common use cases
export function GameCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-tg-secondary border border-white/5">
      <Skeleton className="aspect-video w-full" />
      <div className="p-3 space-y-2">
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="90%" height={12} />
        <Skeleton variant="rectangular" height={36} className="mt-3" />
      </div>
    </div>
  );
}

export function GameGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}
