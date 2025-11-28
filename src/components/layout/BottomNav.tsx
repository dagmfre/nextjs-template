'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  activeIcon: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: '🏠', activeIcon: '🏠' },
  { href: '/games', label: 'Games', icon: '🎮', activeIcon: '🎮' },
  { href: '/wallet', label: 'Wallet', icon: '💰', activeIcon: '💰' },
  { href: '/profile', label: 'Profile', icon: '👤', activeIcon: '👤' },
];

export function BottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on game play pages
  if (pathname?.startsWith('/play/')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-tg-bg/95 backdrop-blur-lg border-t border-white/10 safe-area-bottom">
      <div className="h-16 px-4 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl
                transition-all duration-200
                ${isActive 
                  ? 'text-white bg-white/10' 
                  : 'text-tg-hint hover:text-white hover:bg-white/5'
                }
              `}
            >
              <span className="text-xl">
                {isActive ? item.activeIcon : item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-gaming-purple" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
