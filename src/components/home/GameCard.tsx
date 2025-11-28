'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface GameInfo {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags?: string;
  thumbnail: string;
  isPremium?: boolean;
  playCount?: number;
}

interface GameCardProps {
  game: GameInfo;
  index?: number;
}

export function GameCard({ game, index = 0 }: GameCardProps) {
  return (
    <Link
      href={`/play/${game.slug}`}
      className="group block animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="rounded-xl overflow-hidden bg-tg-secondary border border-white/5 transition-all duration-300 hover:border-gaming-purple/30 hover:shadow-lg hover:shadow-gaming-purple/10 active:scale-[0.98]">
        {/* Game Thumbnail */}
        <div className="aspect-video relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              // Fallback to alternative path
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('img/cover')) {
                target.src = `/games/${game.slug}/img/cover.png`;
              }
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {/* Category badge */}
          <Badge 
            variant="default" 
            className="absolute top-2 right-2"
          >
            {game.category}
          </Badge>
          
          {/* Premium indicator */}
          {game.isPremium && (
            <Badge 
              variant="premium" 
              className="absolute top-2 left-2"
            >
              👑 Premium
            </Badge>
          )}
          
          {/* Play count */}
          {game.playCount !== undefined && (
            <span className="absolute bottom-2 left-2 text-[10px] text-white/70 flex items-center gap-1">
              ▶ {game.playCount.toLocaleString()} plays
            </span>
          )}
        </div>
        
        {/* Game Info */}
        <div className="p-3">
          <h4 className="text-white font-semibold text-sm truncate mb-1">
            {game.title}
          </h4>
          <p className="text-tg-hint text-xs line-clamp-2 min-h-[2rem]">
            {game.description.length > 60 
              ? `${game.description.slice(0, 60)}...` 
              : game.description
            }
          </p>
          
          {/* Play Button */}
          <Button 
            variant="primary" 
            size="sm" 
            fullWidth 
            className="mt-3"
            rightIcon={<span>🎯</span>}
          >
            Play Now
          </Button>
        </div>
      </div>
    </Link>
  );
}
