'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { backButton } from '@telegram-apps/sdk-react';

interface GameInfo {
  title: string;
  slug: string;
  description: string;
  instructions: string;
  category: string;
}

export default function PlayGame() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Setup back button
    if (backButton.mount.isAvailable()) {
      backButton.mount();
      backButton.show();
      backButton.onClick(() => {
        router.push('/');
      });
    }

    // Fetch game info
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        const game = data.games?.find((g: GameInfo) => g.slug === slug);
        setGameInfo(game || null);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    return () => {
      if (backButton.hide.isAvailable()) {
        backButton.hide();
      }
    };
  }, [slug, router]);

  const handleStartGame = () => {
    setShowInstructions(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!gameInfo) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white p-4">
        <p className="text-xl mb-4">Game not found 😢</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-purple-500 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Show instructions overlay before starting
  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-[#1a1a2e] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-white mb-2">{gameInfo.title}</h1>
          <span className="inline-block px-3 py-1 bg-purple-500/30 text-purple-300 text-xs rounded-full mb-4">
            {gameInfo.category}
          </span>
          
          <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-purple-300 mb-2">📖 How to Play</h3>
            <p className="text-gray-300 text-sm">{gameInfo.instructions}</p>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg transition-transform active:scale-95"
          >
            Start Game 🎮
          </button>

          <button
            onClick={() => router.push('/')}
            className="mt-3 text-gray-400 text-sm underline"
          >
            ← Back to Games
          </button>
        </div>
      </div>
    );
  }

  // Game iframe - fullscreen
  return (
    <div className="fixed inset-0 bg-black">
      <iframe
        src={`/games/${slug}/index.html`}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        allowFullScreen
      />
      
      {/* Floating back button */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white text-xl"
      >
        ←
      </button>
    </div>
  );
}
