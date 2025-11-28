'use client';

import { GameCard, GameInfo } from './GameCard';
import { GameGridSkeleton } from '@/components/ui/Skeleton';

interface GameGridProps {
  games: GameInfo[];
  isLoading?: boolean;
  title?: string;
  showCount?: boolean;
}

export function GameGrid({ 
  games, 
  isLoading = false, 
  title = '🕹️ Games',
  showCount = true,
}: GameGridProps) {
  return (
    <section className="px-4 pb-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {showCount && (
          <span className="text-xs text-tg-hint">
            {isLoading ? '...' : `${games.length} available`}
          </span>
        )}
      </div>

      {/* Loading state */}
      {isLoading ? (
        <GameGridSkeleton count={4} />
      ) : games.length === 0 ? (
        /* Empty state */
        <div className="py-12 text-center">
          <span className="text-4xl mb-3 block">🎮</span>
          <p className="text-tg-hint text-sm">No games found</p>
        </div>
      ) : (
        /* Games grid */
        <div className="grid grid-cols-2 gap-3">
          {games.map((game, index) => (
            <GameCard key={game.slug} game={game} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
