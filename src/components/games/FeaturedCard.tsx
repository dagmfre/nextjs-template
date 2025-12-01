'use client';

import Link from 'next/link';
import { GameInfo } from '@/components/home/GameCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

interface FeaturedCardProps {
  game: GameInfo | null;
  isLoading?: boolean;
  className?: string;
}

export function FeaturedCard({ 
  game, 
  isLoading = false,
  className = '' 
}: FeaturedCardProps) {
  if (isLoading) {
    return (
      <section className={`px-4 ${className}`}>
        <Skeleton className="aspect-video w-full rounded-2xl" />
      </section>
    );
  }
  
  if (!game) return null;
  
  return (
    <section className={`px-4 ${className}`}>
      <Link href={`/play/${game.slug}`} className="block group">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-tg-secondary border border-white/5 group-hover:border-gaming-purple/30 transition-all shadow-xl">
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('img/cover')) {
                target.src = `/games/${game.slug}/img/cover.png`;
              }
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          {/* Featured badge - pulsing */}
          <div className="absolute top-4 left-4">
            <Badge variant="premium" size="md" className="animate-pulse shadow-lg">
              ⭐ Editor&apos;s Pick
            </Badge>
          </div>
          
          {/* Category badge */}
          <Badge variant="default" className="absolute top-4 right-4">
            {game.category}
          </Badge>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 className="text-white text-xl font-bold mb-1">
              {game.title}
            </h2>
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {game.description}
            </p>
            
            <Button 
              variant="primary" 
              size="md"
              rightIcon={<span>🚀</span>}
              className="shadow-lg shadow-gaming-purple/30"
            >
              Play Now
            </Button>
          </div>
        </div>
      </Link>
    </section>
  );
}
