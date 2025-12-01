'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// Layout components
import { Container } from '@/components/layout/Container';
import { BottomNav } from '@/components/layout/BottomNav';

// Games components
import { SearchBar } from '@/components/games/SearchBar';
import { FilterChips } from '@/components/games/FilterChips';
import { TrendingSection } from '@/components/games/TrendingSection';
import { FeaturedCard } from '@/components/games/FeaturedCard';
import { GameListSection } from '@/components/games/GameListSection';

// Types
import { GameInfo } from '@/components/home/GameCard';

export default function GamesPage() {
  // State
  const [games, setGames] = useState<GameInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch games
  useEffect(() => {
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        // Add mock play counts for trending
        const gamesWithCounts = (data.games || []).map((game: GameInfo, index: number) => ({
          ...game,
          playCount: Math.floor(Math.random() * 10000) + 500,
        }));
        setGames(gamesWithCounts);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(games.map(g => g.category));
    return Array.from(cats).sort();
  }, [games]);

  // Trending games (top 3 by play count)
  const trendingGames = useMemo(() => {
    return [...games]
      .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
      .slice(0, 3);
  }, [games]);

  // Featured game (random selection)
  const featuredGame = useMemo(() => {
    if (games.length === 0) return null;
    // Pick a game that's not in trending
    const nonTrending = games.filter(
      g => !trendingGames.find(t => t.slug === g.slug)
    );
    if (nonTrending.length > 0) {
      return nonTrending[Math.floor(Math.random() * nonTrending.length)];
    }
    return games[0];
  }, [games, trendingGames]);

  // Filter games by search and category
  const filteredGames = useMemo(() => {
    let result = games;
    
    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(g => g.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.title.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [games, activeCategory, searchQuery]);

  // Handle search with debounce
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle filter button click
  const handleFilterClick = useCallback(() => {
    // TODO: Show filter modal
    console.log('Filter clicked');
  }, []);

  // Determine if we should show sections or just search results
  const showFullLayout = !searchQuery.trim();

  return (
    <>
      <Container withBottomNav>
        {/* Page Header */}
        <div className="sticky top-0 z-40 bg-tg-bg/95 backdrop-blur-lg border-b border-white/5 pb-4">
          {/* Title */}
          <div className="px-4 pt-4 pb-3">
            <h1 className="text-xl font-bold text-white">
              🎮 Games Library
            </h1>
            <p className="text-tg-hint text-sm mt-1">
              Discover and play amazing games
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="px-4">
            <SearchBar 
              onSearch={handleSearch}
              onFilterClick={handleFilterClick}
              placeholder="Search games..."
            />
          </div>
          
          {/* Filter Chips */}
          {categories.length > 0 && (
            <div className="mt-3">
              <FilterChips
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-4">
          {showFullLayout ? (
            <>
              {/* Trending Section */}
              <TrendingSection 
                games={trendingGames}
                isLoading={isLoading}
                className="mb-6"
              />

              {/* Featured Card */}
              <FeaturedCard 
                game={featuredGame}
                isLoading={isLoading}
                className="mb-6"
              />

              {/* All Games */}
              <GameListSection
                games={filteredGames}
                isLoading={isLoading}
                title={activeCategory === 'all' ? 'All Games' : activeCategory}
                emoji={activeCategory === 'all' ? '🎮' : '🕹️'}
              />
            </>
          ) : (
            /* Search Results */
            <GameListSection
              games={filteredGames}
              isLoading={isLoading}
              title={`Search Results`}
              emoji="🔍"
              showCount={true}
            />
          )}
        </div>
      </Container>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}
