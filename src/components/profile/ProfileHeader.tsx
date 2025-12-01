'use client';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface ProfileHeaderProps {
  photoUrl?: string | null;
  firstName: string;
  lastName?: string;
  username?: string;
  level: number;
  levelTitle: string;
  joinDate?: Date;
  isVerified?: boolean;
  onEditPhoto?: () => void;
  className?: string;
}

export function ProfileHeader({ 
  photoUrl,
  firstName,
  lastName,
  username,
  level,
  levelTitle,
  joinDate,
  isVerified = false,
  onEditPhoto,
  className = '' 
}: ProfileHeaderProps) {
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;
  
  const formattedJoinDate = joinDate 
    ? joinDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <div className={`px-4 py-6 text-center ${className}`}>
      {/* Avatar with edit overlay */}
      <div className="relative inline-block mb-4">
        <Avatar 
          src={photoUrl} 
          name={firstName} 
          size="xl" 
          className="w-20 h-20 text-2xl ring-4 ring-gaming-purple/30"
        />
        {onEditPhoto && (
          <button
            onClick={onEditPhoto}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gaming-purple flex items-center justify-center text-white text-sm shadow-lg hover:bg-gaming-pink transition-colors"
          >
            ✏️
          </button>
        )}
      </div>
      
      {/* Name */}
      <h1 className="text-xl font-bold text-white flex items-center justify-center gap-2">
        {fullName}
        {isVerified && (
          <span className="text-blue-400 text-base">✓</span>
        )}
      </h1>
      
      {/* Username */}
      {username && (
        <p className="text-tg-hint text-sm mt-1">
          @{username}
        </p>
      )}
      
      {/* Level badge */}
      <div className="mt-3 inline-flex">
        <Badge variant="premium" size="md" className="shadow-lg">
          ⭐ Level {level} • {levelTitle}
        </Badge>
      </div>
      
      {/* Join date */}
      {formattedJoinDate && (
        <p className="text-tg-hint text-xs mt-3">
          Member since {formattedJoinDate}
        </p>
      )}
    </div>
  );
}
