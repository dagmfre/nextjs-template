'use client';

import { useState, useEffect } from 'react';
import { initData } from '@telegram-apps/sdk-react';

// Layout components
import { Container } from '@/components/layout/Container';
import { BottomNav } from '@/components/layout/BottomNav';

// Profile components
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatsGrid } from '@/components/profile/StatsGrid';
import { AchievementSlider, Achievement } from '@/components/profile/AchievementSlider';
import { LevelProgress } from '@/components/profile/LevelProgress';
import { SettingsSection, SettingItem } from '@/components/profile/SettingsSection';

// Mock achievements
const mockAchievements: Achievement[] = [
  { id: '1', icon: '🎯', name: 'First Win', description: 'Win your first game', isUnlocked: true },
  { id: '2', icon: '🔥', name: 'On Fire', description: 'Win 3 games in a row', isUnlocked: true },
  { id: '3', icon: '⭐', name: 'Rising Star', description: 'Reach level 5', isUnlocked: true },
  { id: '4', icon: '🎮', name: 'Game Master', description: 'Play 50 games', isUnlocked: true },
  { id: '5', icon: '💎', name: 'Diamond', description: 'Reach level 10', isUnlocked: false },
  { id: '6', icon: '🏆', name: 'Champion', description: 'Win 100 games', isUnlocked: false },
  { id: '7', icon: '👑', name: 'Legend', description: 'Reach level 20', isUnlocked: false },
  { id: '8', icon: '🌟', name: 'Superstar', description: 'Play every game', isUnlocked: true },
  { id: '9', icon: '💰', name: 'Wealthy', description: 'Save 1000 ETB', isUnlocked: false },
  { id: '10', icon: '👥', name: 'Social', description: 'Refer 5 friends', isUnlocked: true },
];

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export default function ProfilePage() {
  // User state
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Settings state
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Get user from Telegram SDK
  useEffect(() => {
    try {
      const sdkUser = initData.user();
      if (sdkUser) {
        setUser({
          id: sdkUser.id,
          first_name: sdkUser.first_name,
          last_name: sdkUser.last_name,
          username: sdkUser.username,
          photo_url: sdkUser.photo_url,
        });
      }
    } catch (e) {
      console.log('[Profile] Could not get SDK user, using mock data');
      // Mock user for development
      setUser({
        id: 123456789,
        first_name: 'Gamer',
        username: 'gamer123',
      });
    }
    
    setIsLoading(false);
  }, []);

  // Mock stats
  const stats = [
    { value: 42, label: 'Games', icon: '🎮' },
    { value: '12h', label: 'Played', icon: '⏱️' },
    { value: '3.2k', label: 'Score', icon: '🏆' },
  ];

  // Settings items
  const settingsItems: SettingItem[] = [
    {
      id: 'notifications',
      icon: '🔔',
      label: 'Notifications',
      type: 'toggle',
      checked: notifications,
      onToggle: setNotifications,
    },
    {
      id: 'darkMode',
      icon: '🌙',
      label: 'Dark Mode',
      type: 'toggle',
      checked: darkMode,
      onToggle: setDarkMode,
    },
    {
      id: 'language',
      icon: '🌐',
      label: 'Language',
      type: 'value',
      value: 'English',
    },
    {
      id: 'privacy',
      icon: '🔒',
      label: 'Privacy',
      type: 'link',
      onClick: () => console.log('Privacy settings'),
    },
    {
      id: 'linked',
      icon: '📱',
      label: 'Linked Accounts',
      type: 'link',
      onClick: () => console.log('Linked accounts'),
    },
  ];

  // About items
  const aboutItems: SettingItem[] = [
    {
      id: 'terms',
      icon: '📄',
      label: 'Terms of Service',
      type: 'link',
      onClick: () => console.log('Terms'),
    },
    {
      id: 'privacy-policy',
      icon: '🔐',
      label: 'Privacy Policy',
      type: 'link',
      onClick: () => console.log('Privacy Policy'),
    },
    {
      id: 'support',
      icon: '💬',
      label: 'Contact Support',
      type: 'link',
      onClick: () => console.log('Support'),
    },
    {
      id: 'rate',
      icon: '⭐',
      label: 'Rate Us',
      type: 'link',
      onClick: () => console.log('Rate'),
    },
  ];

  // Handlers
  const handleEditPhoto = () => {
    console.log('Edit photo');
    // TODO: Trigger Telegram photo picker
  };

  const handleAchievementClick = (achievement: Achievement) => {
    console.log('Achievement clicked:', achievement);
    // TODO: Show achievement details modal
  };

  if (isLoading) {
    return (
      <>
        <Container withBottomNav>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="spinner" />
          </div>
        </Container>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Container withBottomNav>
        {/* Profile Header */}
        <ProfileHeader
          photoUrl={user?.photo_url}
          firstName={user?.first_name || 'Gamer'}
          lastName={user?.last_name}
          username={user?.username}
          level={5}
          levelTitle="Pro Gamer"
          joinDate={new Date('2024-06-15')}
          onEditPhoto={handleEditPhoto}
        />

        {/* Stats Grid */}
        <StatsGrid stats={stats} className="mb-6" />

        {/* Achievements */}
        <AchievementSlider
          achievements={mockAchievements}
          onAchievementClick={handleAchievementClick}
          className="mb-6"
        />

        {/* Level Progress */}
        <LevelProgress
          currentLevel={5}
          currentXP={750}
          xpForNextLevel={1000}
          className="mb-6"
        />

        {/* Settings */}
        <SettingsSection
          title="Settings"
          emoji="⚙️"
          items={settingsItems}
          className="mb-6"
        />

        {/* About */}
        <SettingsSection
          title="About"
          emoji="ℹ️"
          items={aboutItems}
          className="mb-6"
        />

        {/* Version */}
        <p className="text-center text-tg-hint text-xs pb-6">
          Version 1.0.0
        </p>
      </Container>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
}
