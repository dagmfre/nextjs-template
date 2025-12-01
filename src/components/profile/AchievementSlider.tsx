'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementSliderProps {
  achievements: Achievement[];
  onAchievementClick?: (achievement: Achievement) => void;
  className?: string;
}

export function AchievementSlider({ 
  achievements, 
  onAchievementClick,
  className = '' 
}: AchievementSliderProps) {
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  return (
    <div className={`${className}`}>
      <div className="px-4">
        <SectionHeader 
          title="Achievements" 
          emoji="🏆"
          action={{ label: 'View All', onClick: () => console.log('View all achievements') }}
        />
      </div>
      
      {/* Horizontal scroll */}
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-3 px-4 pb-2">
          {achievements.map((achievement) => (
            <button
              key={achievement.id}
              onClick={() => onAchievementClick?.(achievement)}
              className={`
                flex-shrink-0 w-16 flex flex-col items-center gap-2 p-3 rounded-xl
                transition-all active:scale-95
                ${achievement.isUnlocked 
                  ? 'bg-gradient-to-br from-gaming-purple/20 to-gaming-pink/20 border border-gaming-purple/30' 
                  : 'bg-tg-secondary border border-white/5 opacity-50 grayscale'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-2xl
                ${achievement.isUnlocked 
                  ? 'bg-gradient-to-br from-gaming-purple to-gaming-pink shadow-lg shadow-gaming-purple/30' 
                  : 'bg-white/10'
                }
              `}>
                {achievement.isUnlocked ? achievement.icon : '🔒'}
              </div>
              <span className="text-[10px] text-center text-tg-hint leading-tight line-clamp-2">
                {achievement.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Progress text */}
      <p className="px-4 text-xs text-tg-hint mt-1">
        {unlockedCount} of {totalCount} unlocked
      </p>
    </div>
  );
}
