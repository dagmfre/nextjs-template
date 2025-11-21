import { useMemo } from 'react';

import { useLaunchParamsTyped } from '@/hooks/useLaunchParamsTyped';

const START_PARAM_REGEX = /^[\w-]{0,512}$/;

export function validateStartParam(param: string): boolean {
  return START_PARAM_REGEX.test(param);
}

export function useStartParam(): string | undefined {
  const lp = useLaunchParamsTyped();

  return useMemo(() => {
    const raw = lp.tgWebAppStartParam;
    return raw && validateStartParam(raw) ? raw : undefined;
  }, [lp.tgWebAppStartParam]);
}

export function parseStartParam(param: string): Record<string, string> | null {
  if (!validateStartParam(param)) {
    return null;
  }

  const [action, ...rest] = param.split('_');

  if (!action) {
    return null;
  }

  return {
    action,
    payload: rest.join('_'),
  };
}
