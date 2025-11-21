import { supports } from '@telegram-apps/sdk-react';
import type { Version } from '@telegram-apps/sdk-react';

/**
 * Determine whether a Telegram client supports a specific method.
 */
export function isMethodSupported(method: string, requiredVersion: Version): boolean {
  return supports(method as any, requiredVersion);
}

/**
 * Compare two semantic versions (major.minor) emitted by Telegram.
 */
export function compareVersions(a: Version, b: Version): number {
  const [aMajor, aMinor = 0] = a.split('.').map(Number);
  const [bMajor, bMinor = 0] = b.split('.').map(Number);

  if (aMajor !== bMajor) {
    return aMajor - bMajor;
  }

  return aMinor - bMinor;
}

/**
 * Convenience helper for fullscreen capability (Bot API 8.0+).
 */
export function isFullscreenSupported(version: Version): boolean {
  return compareVersions(version, '8.0') >= 0;
}
