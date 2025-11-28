'use client';

import { initData } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';
import { validateInitData } from '@/utils/initDataApi';
import Link from 'next/link';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface GameInfo {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  thumbnail: string;
}

export default function Home() {
  const [authStatus, setAuthStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [games, setGames] = useState<GameInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user from SDK init data
    const sdkUser = initData.user();
    if (sdkUser) {
      setUser({
        id: sdkUser.id,
        first_name: sdkUser.first_name,
        last_name: sdkUser.last_name,
        username: sdkUser.username,
        language_code: sdkUser.language_code,
      });
    }

    // Validate init data with backend
    validateInitData().then(({ valid, user: validatedUser }) => {
      if (valid) {
        setAuthStatus('success');
        if (validatedUser) {
          setUser(validatedUser as TelegramUser);
        }
      } else {
        setAuthStatus('error');
      }
    });

    // Fetch games
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        setGames(data.games || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const displayName = user?.first_name || user?.username || 'Gamer';

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color,#1a1a2e)]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--tg-theme-bg-color,#1a1a2e)]/90 border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm">Hey, {displayName}! 👋</h1>
              <p className="text-xs text-gray-400">
                {authStatus === 'checking' && '⏳ Verifying...'}
                {authStatus === 'success' && '✓ Verified'}
                {authStatus === 'error' && '⚠ Guest Mode'}
              </p>
            </div>
          </div>
          <div className="text-2xl">🎮</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-6">
        <div className="rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2">
            Ready to Play? 🚀
          </h2>
          <p className="text-gray-300 text-sm">
            Choose from our collection of exciting arcade games and start having fun!
          </p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="px-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">🕹️ Games</h3>
          <span className="text-xs text-gray-400">{games.length} available</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {games.map((game) => (
              <Link
                key={game.slug}
                href={`/play/${game.slug}`}
                className="group block"
              >
                <div className="rounded-xl overflow-hidden bg-[var(--tg-theme-secondary-bg-color,#16213e)] border border-white/5 transition-transform active:scale-95">
                  {/* Game Thumbnail */}
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/games/' + game.slug + '/images/cover.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/80 text-white font-medium">
                      {game.category}
                    </span>
                  </div>
                  
                  {/* Game Info */}
                  <div className="p-3">
                    <h4 className="text-white font-semibold text-sm truncate">
                      {game.title}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {game.description.slice(0, 60)}...
                    </p>
                    
                    {/* Play Button */}
                    <button className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold transition-opacity hover:opacity-90">
                      Play Now 🎯
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[var(--tg-theme-bg-color,#1a1a2e)]/95 backdrop-blur-lg border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
          <span>Made with ❤️ for Telegram</span>
        </div>
      </footer>
    </div>
  );
}
