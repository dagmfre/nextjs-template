'use client';

import { initData } from '@telegram-apps/sdk-react';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { validateInitData } from '@/utils/initDataApi';

// Layout components
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Container } from '@/components/layout/Container';

// Home components
import { HeroSection } from '@/components/home/HeroSection';
import { GameGrid } from '@/components/home/GameGrid';
import { CategoryTabs } from '@/components/home/CategoryTabs';
import { GameInfo } from '@/components/home/GameCard';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export default function Home() {
  const router = useRouter();
  
  // Auth state
  const [authStatus, setAuthStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [user, setUser] = useState<TelegramUser | null>(null);
  
  // Games state
  const [games, setGames] = useState<GameInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Initialize user from SDK and validate
  useEffect(() => {
    // Get user from SDK init data
    try {
      const sdkUser = initData.user();
      if (sdkUser) {
        setUser({
          id: sdkUser.id,
          first_name: sdkUser.first_name,
          last_name: sdkUser.last_name,
          username: sdkUser.username,
          language_code: sdkUser.language_code,
          photo_url: sdkUser.photo_url,
        });
      }
    } catch (e) {
      console.log('[Home] Could not get SDK user');
    }

    // Validate init data with backend
    validateInitData().then(({ valid, user: validatedUser }) => {
      if (valid) {
        setAuthStatus('success');
        if (validatedUser) {
          setUser(prev => ({
            ...prev,
            ...(validatedUser as TelegramUser),
          }));
        }
      } else {
        setAuthStatus('error');
      }
    });
  }, []);

  // Fetch games
  useEffect(() => {
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        setGames(data.games || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // Extract unique categories from games
  const categories = useMemo(() => {
    const cats = new Set(games.map(g => g.category));
    return Array.from(cats).sort();
  }, [games]);

  // Filter games by category
  const filteredGames = useMemo(() => {
    if (activeCategory === 'all') {
      return games;
    }
    return games.filter(g => g.category === activeCategory);
  }, [games, activeCategory]);

  // Play random game
  const handlePlayRandom = () => {
    if (games.length > 0) {
      const randomGame = games[Math.floor(Math.random() * games.length)];
      router.push(`/play/${randomGame.slug}`);
    }
  };

  const displayName = user?.first_name || user?.username || 'Gamer';

  return (
    <>
      <Container withBottomNav>
        {/* Header */}
        <Header 
          userName={displayName}
          userPhoto={user?.photo_url}
          authStatus={authStatus}
        />

        {/* Hero Section */}
        <HeroSection 
          userName={displayName}
          onPlayNow={games.length > 0 ? handlePlayRandom : undefined}
        />

        {/* Category Tabs */}
        {categories.length > 1 && (
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}

        {/* Games Grid */}
        <GameGrid 
          games={filteredGames}
          isLoading={isLoading}
          title={activeCategory === 'all' ? '🕹️ All Games' : `🕹️ ${activeCategory}`}
        />
      </Container>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}
