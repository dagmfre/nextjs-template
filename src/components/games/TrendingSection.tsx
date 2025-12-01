'use client';

import Link from 'next/link';
import { GameInfo } from '@/components/home/GameCard';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';

interface TrendingSectionProps {
  games: GameInfo[];
  isLoading?: boolean;
  className?: string;
}

export function TrendingSection({ 
  games, 
  isLoading = false,
  className = '' 
}: TrendingSectionProps) {
  if (isLoading) {
    return (
      <section className={`px-4 ${className}`}>
        <SectionHeader title="Trending Now" emoji="🔥" />
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-36">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4 mt-2 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  if (games.length === 0) return null;
  
  return (
    <section className={`px-4 ${className}`}>
      <SectionHeader title="Trending Now" emoji="🔥" />
      
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
        {games.map((game, index) => (
          <Link
            key={game.slug}
            href={`/play/${game.slug}`}
            className="flex-shrink-0 w-36 snap-start group"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-tg-secondary border border-white/5 group-hover:border-gaming-purple/30 transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.thumbnail}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('img/cover')) {
                    target.src = `/games/${game.slug}/img/cover.png`;
                  }
                }}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Rank badge */}
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black shadow-lg">
                {index + 1}
              </div>
              
              {/* Fire indicator */}
              <div className="absolute top-2 right-2 text-sm animate-pulse">
                🔥
              </div>
              
              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <h4 className="text-white text-xs font-semibold truncate">
                  {game.title}
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
