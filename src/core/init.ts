import {
  setDebug,
  mountBackButton,
  restoreInitData,
  init as initSDK,
  mountMiniAppSync,
  bindThemeParamsCssVars,
  mountViewport,
  bindViewportCssVars,
} from '@telegram-apps/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 */
export async function init(options: {
  debug: boolean;
  eruda: boolean;
  mockForMacOS: boolean;
}): Promise<void> {
  // Set @telegram-apps/sdk-react debug mode and initialize it.
  setDebug(options.debug);
  initSDK();

  // Add Eruda if needed.
  options.eruda &&
    void import('eruda').then(({ default: eruda }) => {
      eruda.init();
      eruda.position({ x: window.innerWidth - 50, y: 0 });
    });

  // Conditionally mock Telegram environment only in development for macOS.
  const shouldMock = process.env.NODE_ENV === 'development' && options.mockForMacOS;
  if (shouldMock) {
    const { mockTelegramEnv } = await import('@/mockEnv');
    await mockTelegramEnv();
  }

  // Mount all components used in the project.
  mountBackButton.ifAvailable();
  restoreInitData();

  if (mountMiniAppSync.isAvailable()) {
    mountMiniAppSync();
    bindThemeParamsCssVars();
  }

  if (mountViewport.isAvailable()) {
    mountViewport().then(() => {
      bindViewportCssVars();
    });
  }
}
