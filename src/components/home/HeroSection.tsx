'use client';

import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  userName?: string;
  onPlayNow?: () => void;
}

export function HeroSection({ userName = 'Gamer', onPlayNow }: HeroSectionProps) {
  return (
    <section className="px-4 py-6 animate-fade-in">
      <div className="relative rounded-2xl overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/40 via-gaming-pink/30 to-gaming-blue/20" />
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-4xl opacity-30">🎯</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-20">🏆</div>
        
        {/* Content */}
        <div className="relative p-6 border border-white/10 rounded-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-2">
            Ready to Play? 🚀
          </h2>
          <p className="text-gray-300 text-sm mb-4 max-w-xs">
            Choose from our collection of exciting arcade games and start having fun!
          </p>
          
          {onPlayNow && (
            <Button 
              onClick={onPlayNow}
              size="md"
              rightIcon={<span>🎮</span>}
            >
              Play Random Game
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
