import { useLaunchParams } from '@telegram-apps/sdk-react';
import type { LaunchParams } from '@telegram-apps/sdk-react';

/**
 * Wrapper that keeps Telegram launch params strongly typed across the app.
 */
export function useLaunchParamsTyped(): LaunchParams {
  return useLaunchParams();
}

/**
 * Optional camelCased variant if components expect it.
 */
export function useLaunchParamsCamelCase() {
  return useLaunchParams(true);
}
