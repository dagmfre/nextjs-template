import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export type InitDataValidationResult<TUser = unknown> = {
  valid: boolean;
  user?: TUser;
  error?: string;
};

/**
 * Sends Telegram init data to the backend for signature validation.
 */
export async function validateInitData(
  endpoint = '/api/auth/validate',
): Promise<InitDataValidationResult> {
  if (typeof window === 'undefined') {
    return { valid: false, error: 'client-only' };
  }

  const { tgWebAppData } = retrieveLaunchParams();
  const fromHash = new URLSearchParams(window.location.hash.slice(1)).get(
    'tgWebAppData',
  );
  const initDataRaw = fromHash || tgWebAppData;

  if (!initDataRaw) {
    return { valid: false, error: 'missing-init-data' };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `tma ${initDataRaw}`,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Validation failed with status ${response.status}`);
    }

    return (await response.json()) as InitDataValidationResult;
  } catch (error) {
    console.error('Init data validation error:', error);
    return { valid: false, error: (error as Error).message };
  }
}
