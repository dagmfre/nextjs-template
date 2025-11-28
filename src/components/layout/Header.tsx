'use client';

import { Avatar } from '@/components/ui/Avatar';

interface HeaderProps {
  userName?: string;
  userPhoto?: string | null;
  authStatus?: 'checking' | 'success' | 'error';
}

export function Header({ userName = 'Gamer', userPhoto, authStatus = 'checking' }: HeaderProps) {
  const statusIndicator = {
    checking: { text: 'Verifying...', icon: '⏳' },
    success: { text: 'Verified', icon: '✓' },
    error: { text: 'Guest Mode', icon: '⚠' },
  };

  const status = statusIndicator[authStatus];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-tg-bg/90 border-b border-white/10 safe-area-top">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar src={userPhoto} name={userName} size="md" />
          <div>
            <h1 className="text-white font-semibold text-sm leading-tight">
              Hey, {userName}! 👋
            </h1>
            <p className="text-xs text-tg-hint flex items-center gap-1">
              <span>{status.icon}</span>
              <span>{status.text}</span>
            </p>
          </div>
        </div>

        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎮</span>
        </div>
      </div>
    </header>
  );
}
