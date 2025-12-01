'use client';

import { ProgressBar } from '@/components/ui/ProgressBar';

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  className?: string;
}

export function LevelProgress({ 
  currentLevel, 
  currentXP, 
  xpForNextLevel,
  className = '' 
}: LevelProgressProps) {
  const progress = (currentXP / xpForNextLevel) * 100;
  const xpRemaining = xpForNextLevel - currentXP;

  return (
    <div className={`px-4 ${className}`}>
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <span>📈</span> Level Progress
      </h3>
      
      <div className="bg-tg-secondary rounded-xl border border-white/5 p-4">
        {/* Level indicators */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-pink flex items-center justify-center text-white text-sm font-bold">
              {currentLevel}
            </div>
            <span className="text-white text-sm font-medium">Level {currentLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-tg-hint text-sm">Level {currentLevel + 1}</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-tg-hint text-sm font-bold">
              {currentLevel + 1}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <ProgressBar value={progress} size="lg" gradient />
        
        {/* XP info */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <span className="text-gaming-purple font-medium">
            {currentXP.toLocaleString()} XP
          </span>
          <span className="text-tg-hint">
            {xpRemaining.toLocaleString()} XP to next level
          </span>
        </div>
      </div>
    </div>
  );
}
