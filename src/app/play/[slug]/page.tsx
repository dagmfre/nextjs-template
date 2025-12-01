'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  backButton,
  requestFullscreen,
  exitFullscreen,
  on,
} from '@telegram-apps/sdk-react';
import { getInitialHash } from '@/utils/launchParamsCache';
import { isFullscreenSupported } from '@/utils/versionCheck';

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
  
  // State
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  
  // Refs
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check fullscreen support based on tgWebAppVersion
  useEffect(() => {
    try {
      const hash = getInitialHash();
      const params = new URLSearchParams(hash);
      const version = params.get('tgWebAppVersion');
      
      if (version) {
        const supported = isFullscreenSupported(version);
        setFullscreenSupported(supported);
        console.log(`[GamePlayer] tgWebAppVersion: ${version}, fullscreen supported: ${supported}`);
      }
    } catch (e) {
      console.warn('[GamePlayer] Could not check version for fullscreen support');
    }
  }, []);

  // Listen for fullscreen events
  useEffect(() => {
    // Listen to fullscreen state changes
    try {
      const unsubscribeChanged = on('fullscreen_changed', (payload) => {
        setIsFullscreen(payload.is_fullscreen);
        console.log('[GamePlayer] Fullscreen changed:', payload.is_fullscreen);
      });

      const unsubscribeFailed = on('fullscreen_failed', (payload) => {
        console.warn('[GamePlayer] Fullscreen failed:', payload.error);
        setIsFullscreen(false);
      });

      return () => {
        unsubscribeChanged();
        unsubscribeFailed();
      };
    } catch (e) {
      // Events may not be available
    }
  }, []);

  // Setup back button
  useEffect(() => {
    if (backButton.mount.isAvailable()) {
      backButton.mount();
      backButton.show();
      backButton.onClick(() => {
        router.push('/');
      });
    }

    return () => {
      if (backButton.hide.isAvailable()) {
        backButton.hide();
      }
    };
  }, [router]);

  // Fetch game info
  useEffect(() => {
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        const game = data.games?.find((g: GameInfo) => g.slug === slug);
        setGameInfo(game || null);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [slug]);

  // Auto-hide controls after 3 seconds of inactivity
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Start auto-hide when game is playing
  useEffect(() => {
    if (!showInstructions && gameLoaded) {
      resetControlsTimeout();
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showInstructions, gameLoaded, resetControlsTimeout]);

  // Handle screen interaction (tap or mouse move) to show controls
  const handleScreenInteraction = useCallback(() => {
    if (!showInstructions && gameLoaded) {
      resetControlsTimeout();
    }
  }, [showInstructions, gameLoaded, resetControlsTimeout]);
  
  // Set up global event listeners for mouse/touch to detect user activity
  useEffect(() => {
    if (showInstructions || !gameLoaded) return;
    
    const handleActivity = () => {
      handleScreenInteraction();
    };
    
    // Listen for mouse movement and touch events on the entire document
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('touchstart', handleActivity);
    document.addEventListener('click', handleActivity);
    
    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
      document.removeEventListener('click', handleActivity);
    };
  }, [showInstructions, gameLoaded, handleScreenInteraction]);

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!fullscreenSupported) {
      console.warn('[GamePlayer] Fullscreen not supported on this version');
      return;
    }

    try {
      if (isFullscreen) {
        await exitFullscreen();
      } else {
        await requestFullscreen();
      }
    } catch (e) {
      console.warn('[GamePlayer] Fullscreen toggle failed:', e);
    }
  };

  const handleStartGame = () => {
    setShowInstructions(false);
  };

  const handleBack = () => {
    // Exit fullscreen if active before navigating
    if (isFullscreen && fullscreenSupported) {
      exitFullscreen().catch(() => {});
    }
    router.push('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="game-container flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-white text-sm">Loading game...</p>
        </div>
      </div>
    );
  }

  // Game not found
  if (!gameInfo) {
    return (
      <div className="game-container flex flex-col items-center justify-center text-white p-6">
        <span className="text-5xl mb-4">😢</span>
        <h2 className="text-xl font-bold mb-2">Game not found</h2>
        <p className="text-tg-hint text-sm mb-6">
          The game you&apos;re looking for doesn&apos;t exist.
        </p>
        <button 
          onClick={handleBack}
          className="px-6 py-3 bg-gradient-to-r from-gaming-purple to-gaming-pink rounded-xl font-semibold"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  // Instructions screen
  if (showInstructions) {
    return (
      <div className="game-container with-safe-area flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="max-w-md w-full">
          {/* Game title */}
          <h1 className="text-2xl font-bold text-white mb-2">{gameInfo.title}</h1>
          
          {/* Category badge */}
          <span className="inline-block px-3 py-1 bg-gaming-purple/30 text-purple-300 text-xs rounded-full mb-6">
            {gameInfo.category}
          </span>
          
          {/* Instructions card */}
          <div className="bg-white/5 rounded-2xl p-5 mb-6 text-left border border-white/10">
            <h3 className="text-sm font-semibold text-gaming-purple mb-3 flex items-center gap-2">
              📖 How to Play
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {gameInfo.instructions}
            </p>
          </div>

          {/* Start game button */}
          <button
            onClick={handleStartGame}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-gaming-purple to-gaming-pink text-white font-bold text-lg transition-all active:scale-[0.98] hover:opacity-90"
          >
            Start Game 🎮
          </button>

          {/* Back link */}
          <button
            onClick={handleBack}
            className="mt-4 text-sm hover:text-white transition-colors"
          >
            ← Back to Games
          </button>
        </div>
      </div>
    );
  }

  // Game player - fullscreen
  return (
    <div 
      ref={containerRef}
      className="game-container"
    >
      {/* Loading overlay */}
      {!gameLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-white text-sm">Loading {gameInfo.title}...</p>
          </div>
        </div>
      )}

      {/* Game iframe - TRUE fullscreen */}
      <iframe
        src={`/games/${slug}/index.html`}
        className="game-iframe"
        onLoad={() => setGameLoaded(true)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen"
        allowFullScreen
      />

      {/* Floating controls */}
      <div 
        className={`floating-controls ${showControls ? '' : 'hidden'}`}
        style={{
          bottom: `calc(24px + var(--tg-content-safe-area-inset-bottom, 0px))`,
          right: `calc(24px + var(--tg-content-safe-area-inset-right, 0px))`,
        }}
      >
        {/* Fullscreen button - only show if supported */}
        {fullscreenSupported && (
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              toggleFullscreen(); 
            }}
            className="floating-btn"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? '⊙' : '⛶'}
          </button>
        )}
        
        {/* Back/Close button */}
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            handleBack(); 
          }}
          className="floating-btn"
          aria-label="Close game"
        >
          ✕
        </button>
      </div>

      {/* Top-left back button (always visible when controls shown) */}
      <button
        onClick={(e) => { 
          e.stopPropagation(); 
          handleBack(); 
        }}
        className={`
          fixed z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur 
          flex items-center justify-center text-white text-xl
          transition-opacity duration-300
          ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        style={{
          top: `calc(16px + var(--tg-content-safe-area-inset-top, 0px))`,
          left: `calc(16px + var(--tg-content-safe-area-inset-left, 0px))`,
        }}
        aria-label="Back to home"
      >
        ←
      </button>
    </div>
  );
}
