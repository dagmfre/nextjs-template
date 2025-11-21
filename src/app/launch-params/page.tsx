'use client';

import { List } from '@telegram-apps/telegram-ui';

import { DisplayData } from '@/components/DisplayData/DisplayData';
import { Page } from '@/components/Page';
import { useLaunchParamsTyped } from '@/hooks/useLaunchParamsTyped';
import { isFullscreenSupported } from '@/utils/versionCheck';

export default function LaunchParamsPage() {
  const lp = useLaunchParamsTyped();
  const fullscreenSupported = isFullscreenSupported(lp.tgWebAppVersion);

  return (
    <Page>
      <List>
        <DisplayData
          rows={[
            { title: 'tgWebAppPlatform', value: lp.tgWebAppPlatform },
            { title: 'tgWebAppShowSettings', value: lp.tgWebAppShowSettings },
            { title: 'tgWebAppVersion', value: lp.tgWebAppVersion },
            { title: 'tgWebAppBotInline', value: lp.tgWebAppBotInline },
            { title: 'tgWebAppStartParam', value: lp.tgWebAppStartParam },
            { title: 'tgWebAppData', type: 'link', value: '/init-data' },
            {
              title: 'Fullscreen supported',
              value: fullscreenSupported ? 'Yes' : 'No',
            },
            {
              title: 'tgWebAppThemeParams',
              type: 'link',
              value: '/theme-params',
            },
          ]}
        />
      </List>
    </Page>
  );
}
