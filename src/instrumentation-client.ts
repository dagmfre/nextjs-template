// This file is normally used for setting up analytics and other
// services that require one-time initialization on the client.

import { isTMA, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { init } from './core/init';
import { getInitialHash } from '@/utils/launchParamsCache';
import { validateInitData } from '@/utils/initDataApi';

// Persist Telegram hash as soon as possible to avoid losing launch params.
getInitialHash();

/**
 * Initialize the app, mocking Telegram environment if needed (development outside Telegram).
 */
async function bootstrap() {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Check if we're running inside Telegram
  const isInsideTelegram = await isTMA('complete');
  
  // If in development and NOT inside Telegram, mock the environment first
  if (isDev && !isInsideTelegram) {
    const { mockTelegramEnv } = await import('@/mockEnv');
    await mockTelegramEnv();
  }

  try {
    const launchParams = retrieveLaunchParams();
    const { tgWebAppPlatform: platform } = launchParams;
    const debug =
      (launchParams.tgWebAppStartParam || '').includes('debug') || isDev;

    // Configure all application dependencies.
    await init({
      debug,
      eruda: debug && ['ios', 'android'].includes(platform),
      mockForMacOS: false, // Already handled above
    });

    validateInitData().then(({ valid, user, error }) => {
      if (valid) {
        console.info('Init data validated', user);
        return;
      }

      if (error) {
        console.warn('Init data validation failed:', error);
      }
    });
  } catch (e) {
    console.error('[Bootstrap] Failed to initialize:', e);
  }
}

bootstrap();
