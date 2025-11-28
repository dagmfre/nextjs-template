import { getInitialHash } from './launchParamsCache';

export type InitDataValidationResult<TUser = unknown> = {
  valid: boolean;
  user?: TUser;
  error?: string;
};

/**
 * Sends Telegram init data to the backend for signature validation.
 * Uses cached hash to avoid SPA routing issues that can clear the hash.
 */
export async function validateInitData(
  endpoint = '/api/auth/validate',
): Promise<InitDataValidationResult> {
  if (typeof window === 'undefined') {
    return { valid: false, error: 'client-only' };
  }

  // Use cached hash (captured early before SPA routing modifies it)
  const cachedHash = getInitialHash();
  const hashParams = new URLSearchParams(cachedHash);
  const initDataRaw = hashParams.get('tgWebAppData');

  console.log('[Auth Debug] Cached hash length:', cachedHash.length);
  console.log('[Auth Debug] Init data present:', !!initDataRaw);

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
