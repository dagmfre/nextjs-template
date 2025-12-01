'use client';

import { GameCard, GameInfo } from '@/components/home/GameCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { GameGridSkeleton } from '@/components/ui/Skeleton';

interface GameListSectionProps {
  games: GameInfo[];
  isLoading?: boolean;
  title?: string;
  emoji?: string;
  showCount?: boolean;
  onSeeAll?: () => void;
  className?: string;
}

export function GameListSection({ 
  games, 
  isLoading = false,
  title = 'All Games',
  emoji = '🎮',
  showCount = true,
  onSeeAll,
  className = '' 
}: GameListSectionProps) {
  return (
    <section className={`px-4 pb-6 ${className}`}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>{emoji}</span>
          {title}
        </h3>
        <div className="flex items-center gap-3">
          {showCount && !isLoading && (
            <span className="text-xs text-tg-hint">
              {games.length} games
            </span>
          )}
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="text-xs text-gaming-purple hover:text-gaming-pink transition-colors font-medium"
            >
              See All →
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <GameGridSkeleton count={4} />
      ) : games.length === 0 ? (
        /* Empty state */
        <EmptyState
          icon="🔍"
          title="No games found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
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
