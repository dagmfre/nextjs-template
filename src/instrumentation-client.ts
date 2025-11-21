// This file is normally used for setting up analytics and other
// services that require one-time initialization on the client.

import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { init } from './core/init';
import { getInitialHash } from '@/utils/launchParamsCache';
import { validateInitData } from '@/utils/initDataApi';

// Persist Telegram hash as soon as possible to avoid losing launch params.
getInitialHash();

try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug =
    (launchParams.tgWebAppStartParam || '').includes('debug') ||
    process.env.NODE_ENV === 'development';

  // Configure all application dependencies.
  init({
    debug,
    eruda: debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === 'macos',
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
  console.log(e);
}
