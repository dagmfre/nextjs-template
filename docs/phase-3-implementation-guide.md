# Phase 3: Core App Adaptation & Launch Parameters Handling

**Purpose**: Extract, persist, and utilize launch parameters from Telegram; prepare pipeline for init data validation.

**Official References**:
- Platform Docs: [Launch Parameters](https://docs.telegram-mini-apps.com/platform/launch-parameters)
- tma.js Repo: [launch-params.ts](https://github.com/Telegram-Mini-Apps/tma.js/tree/main/packages/bridge/src/launch-params.ts)
- SDK Docs: [retrieveLaunchParams](https://docs.telegram-mini-apps.com/packages/telegram-apps-bridge/2-x/launch-parameters#retrieving-launch-parameters)

---

## Step 1: Hash Persistence & Early Capture

**Why**: Telegram passes launch params in `window.location.hash`. Client-side routing or refreshes may overwrite it. Capture immediately.

**Reference**: [Platform Docs - Extraction](https://docs.telegram-mini-apps.com/platform/launch-parameters#extraction)

### Implementation

Create utility to persist hash on first load:

```bash
mkdir -p src/utils
touch src/utils/launchParamsCache.ts
```

**File: `src/utils/launchParamsCache.ts`**

```typescript
// Cache initial hash to prevent loss from routing/refresh
let cachedHash: string | null = null;

export function getInitialHash(): string {
  if (cachedHash === null && typeof window !== 'undefined') {
    cachedHash = window.location.hash.slice(1); // remove leading '#'
  }
  return cachedHash || '';
}

export function resetHashCache() {
  cachedHash = null;
}
```

**Call early** in `src/instrumentation-client.ts` (before `init`):

```typescript
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { init } from './core/init';
import { getInitialHash } from '@/utils/launchParamsCache'; // Add

// Persist hash immediately
getInitialHash();

try {
  const launchParams = retrieveLaunchParams();
  // ... existing init code
```

**Verification**:
```bash
pnpm run dev
# Open browser console
# Navigate to: http://localhost:3000/#tgWebAppVersion=8.0&tgWebAppPlatform=tdesktop
# Console log hash early to confirm capture
```

---

## Step 2: Extract & Type Launch Parameters

**Why**: Launch params describe platform version, theme, init data, start parameter, fullscreen mode. Typed access avoids errors.

**Reference**: [SDK - retrieveLaunchParams](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk-react/3-x#uselaunchparams), [tma.js source](https://github.com/Telegram-Mini-Apps/tma.js/blob/main/packages/sdk-react/src/hooks.ts#L38-L54)

### Implementation

Template already uses `useLaunchParams()` hook. Add typed wrapper for clarity:

**File: `src/hooks/useLaunchParamsTyped.ts`**

```typescript
import { useLaunchParams } from '@telegram-apps/sdk-react';
import type { LaunchParams } from '@telegram-apps/sdk-react';

/**
 * Typed launch parameters with platform metadata.
 * Includes: tgWebAppVersion, tgWebAppPlatform, tgWebAppThemeParams,
 * tgWebAppData (init data), tgWebAppStartParam, tgWebAppFullscreen, etc.
 */
export function useLaunchParamsTyped(): LaunchParams {
  return useLaunchParams();
}

/**
 * Camel-cased version (optional; keep snake_case for consistency with platform).
 */
export function useLaunchParamsCamelCase() {
  return useLaunchParams(true);
}
```

**Usage in components**:

```typescript
import { useLaunchParamsTyped } from '@/hooks/useLaunchParamsTyped';

function MyComponent() {
  const lp = useLaunchParamsTyped();
  const version = lp.tgWebAppVersion; // "8.0"
  const platform = lp.tgWebAppPlatform; // "tdesktop"
  const theme = lp.tgWebAppThemeParams; // { bg_color: "...", ... }
  const startParam = lp.tgWebAppStartParam; // custom deep link param

  return <div>Version: {version}</div>;
}
```

**Create type exports** for convenience:

**File: `src/types/launchParams.ts`**

```typescript
export type {
  LaunchParams,
  ThemeParams,
  Platform,
  Version,
} from '@telegram-apps/sdk-react';
```

---

## Step 3: Feature Detection via Version Check

**Why**: Use `tgWebAppVersion` to gate API calls (e.g., BottomButton requires 7.10+, fullscreen 8.0+). Prevent crashes on older clients.

**Reference**: [Platform - tgWebAppVersion](https://docs.telegram-mini-apps.com/platform/launch-parameters#tgwebappversion), [SDK - supports](https://github.com/Telegram-Mini-Apps/tma.js/blob/main/packages/bridge/src/methods/supports.ts)

### Implementation

**File: `src/utils/versionCheck.ts`**

```typescript
import { supports } from '@telegram-apps/sdk-react';
import type { Version } from '@telegram-apps/sdk-react';

/**
 * Check if current client version supports a method.
 * Example: isSupported('web_app_request_fullscreen', '8.0')
 */
export function isMethodSupported(method: string, requiredVersion: Version): boolean {
  return supports(method as any, requiredVersion);
}

/**
 * Compare versions: -1 (a < b), 0 (a === b), 1 (a > b)
 */
export function compareVersions(a: Version, b: Version): number {
  const [aMajor, aMinor = 0] = a.split('.').map(Number);
  const [bMajor, bMinor = 0] = b.split('.').map(Number);
  if (aMajor !== bMajor) return aMajor - bMajor;
  return aMinor - bMinor;
}

/**
 * Example: check if >= 8.0 for fullscreen
 */
export function isFullscreenSupported(version: Version): boolean {
  return compareVersions(version, '8.0') >= 0;
}
```

**Usage**:

```typescript
import { useLaunchParamsTyped } from '@/hooks/useLaunchParamsTyped';
import { isFullscreenSupported } from '@/utils/versionCheck';

function FeatureComponent() {
  const { tgWebAppVersion } = useLaunchParamsTyped();

  if (isFullscreenSupported(tgWebAppVersion)) {
    // Call miniApp.requestFullscreen()
  } else {
    // Fallback UI
  }
}
```

---

## Step 4: Theme Params Application

**Why**: `tgWebAppThemeParams` provides Telegram's color palette (bg_color, text_color, button_color, etc.). Apply early to avoid flash of unstyled content.

**Reference**: [Platform - tgWebAppThemeParams](https://docs.telegram-mini-apps.com/platform/launch-parameters#tgwebappthemeparams), [Theme Params Spec](https://docs.telegram-mini-apps.com/platform/theming#launch-parameter)

### Implementation

Template already handles theme via `bindThemeParamsCssVars()` in `src/core/init.ts`. Confirm it runs:

**Check `src/core/init.ts`**:

```typescript
if (mountMiniAppSync.isAvailable()) {
  mountMiniAppSync();
  bindThemeParamsCssVars(); // ✓ Already present
}
```

**CSS Variables** are automatically bound to root (e.g., `--tg-theme-bg-color`). Use in global styles:

**File: `src/app/_assets/globals.css`** (add):

```css
:root {
  /* Telegram theme variables injected by SDK */
  background-color: var(--tg-theme-bg-color, #ffffff);
  color: var(--tg-theme-text-color, #000000);
}

body {
  background: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

a {
  color: var(--tg-theme-link-color);
}

button {
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
}
```

**Verify theme application**:

```bash
pnpm run dev
# Open DevTools > Elements > Computed styles
# Check for --tg-theme-* variables
```

---

## Step 5: Start Parameter Extraction

**Why**: `tgWebAppStartParam` is custom string from `startapp=` or `startattach=` in link. Use for deep linking (e.g., `startParam=ref123` → load referral context).

**Reference**: [Start Parameter Docs](https://docs.telegram-mini-apps.com/platform/start-parameter), [tma.js repo](https://github.com/Telegram-Mini-Apps/tma.js/blob/main/apps/docs/platform/start-parameter.md)

### Implementation

**File: `src/utils/startParam.ts`**

```typescript
import { useLaunchParamsTyped } from '@/hooks/useLaunchParamsTyped';

/**
 * Allowed chars: A-Z a-z 0-9 _ - (max 512 length)
 */
export function validateStartParam(param: string): boolean {
  return /^[\w-]{0,512}$/.test(param);
}

/**
 * Hook to safely retrieve start parameter.
 */
export function useStartParam(): string | undefined {
  const lp = useLaunchParamsTyped();
  const raw = lp.tgWebAppStartParam;
  return raw && validateStartParam(raw) ? raw : undefined;
}

/**
 * Parse start param for routing/state (example: "ref123" -> navigate to /ref/123)
 */
export function parseStartParam(param: string): Record<string, string> | null {
  // Implement app-specific logic
  // Example: "action_profile_123" -> { action: "profile", id: "123" }
  return null; // Placeholder
}
```

**Usage**:

```typescript
'use client';
import { useStartParam } from '@/utils/startParam';
import { useEffect } from 'react';

export default function HomePage() {
  const startParam = useStartParam();

  useEffect(() => {
    if (startParam) {
      console.log('Deep link param:', startParam);
      // Route or load context based on startParam
    }
  }, [startParam]);

  return <div>Welcome</div>;
}
```

---

## Step 6: Init Data Validation Pipeline (Placeholder)

**Why**: `tgWebAppData` contains signed user info. Send to backend for signature verification before trusting.

**Reference**: [Init Data Docs](https://docs.telegram-mini-apps.com/platform/init-data), [Authorizing User](https://docs.telegram-mini-apps.com/platform/authorizing-user)

### Implementation

**Create API utility**:

**File: `src/utils/initDataApi.ts`**

```typescript
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

/**
 * Send raw init data to backend for validation.
 * Returns: { valid: boolean, user?: User }
 */
export async function validateInitData(): Promise<{ valid: boolean; user?: any }> {
  const lp = retrieveLaunchParams();
  const initDataRaw = new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppData');

  if (!initDataRaw) {
    return { valid: false };
  }

  try {
    const response = await fetch('/api/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `tma ${initDataRaw}`,
      },
    });

    if (!response.ok) throw new Error('Validation failed');
    return await response.json();
  } catch (error) {
    console.error('Init data validation error:', error);
    return { valid: false };
  }
}
```

**Backend endpoint spec** (to implement later):

```typescript
// pages/api/auth/validate.ts (Next.js API route)
import { validate, parse } from '@telegram-apps/init-data-node';

export default async function handler(req, res) {
  const [authType, authData = ''] = (req.headers.authorization || '').split(' ');

  if (authType !== 'tma') {
    return res.status(401).json({ error: 'Invalid auth type' });
  }

  try {
    validate(authData, process.env.BOT_TOKEN!, { expiresIn: 3600 });
    const initData = parse(authData);
    return res.json({ valid: true, user: initData.user });
  } catch (err) {
    return res.status(401).json({ valid: false, error: err.message });
  }
}
```

**Add to `.env.local`**:

```bash
BOT_TOKEN=your_test_bot_token_here
```

**Call during app init**:

```typescript
// src/instrumentation-client.ts (after init)
import { validateInitData } from '@/utils/initDataApi';

init({
  debug,
  eruda: debug && ['ios', 'android'].includes(platform),
  mockForMacOS: platform === 'macos',
});

// Validate init data
validateInitData().then(({ valid, user }) => {
  if (valid) {
    console.log('User authenticated:', user);
    // Store user in global state/context
  } else {
    console.warn('Init data validation failed');
  }
});
```

---

## Step 7: Fallback for Hash Routing Conflicts

**Why**: If using client-side hash routing (e.g., React Router hash mode), it may conflict with Telegram's hash-based launch params. Next.js uses path-based routing, so no conflict—but document pattern.

**Reference**: [tma.js Vue Router](https://github.com/Telegram-Mini-Apps/tma.js/blob/main/apps/docs/packages/telegram-apps-sdk-vue.md#vue-router-integration)

### Implementation

Next.js uses HTML5 history mode by default (no hash routing). **No action required** for this template.

**If switching to hash routing** (not recommended):

```typescript
// Store params before routing overwrites hash
const cachedParams = new URLSearchParams(window.location.hash.slice(1));
sessionStorage.setItem('tgLaunchParams', cachedParams.toString());

// Retrieve later
const storedParams = sessionStorage.getItem('tgLaunchParams');
```

---

## Verification Checklist

Run all checks:

```bash
# 1. Dev server
pnpm run dev

# 2. Lint
pnpm run lint

# 3. Type check
pnpm run build
```

**Manual tests**:

1. Open `http://localhost:3000/#tgWebAppVersion=8.0&tgWebAppPlatform=tdesktop&tgWebAppThemeParams=%7B%7D`
2. Console: verify `useLaunchParamsTyped()` returns correct values
3. DevTools > Application > Session Storage: check `tapps/launchParams` key (SDK auto-stores)
4. Inspect CSS variables: `--tg-theme-bg-color` present

**Expected**:
- No TypeScript errors
- Launch params accessible in components
- Theme CSS variables applied
- Hash persisted across refresh

---

## Common Issues

**Issue**: `retrieveLaunchParams()` throws `LaunchParamsRetrieveError`

**Fix**: Hash is empty or malformed. Mock params for local dev:

```typescript
// src/mockEnv.ts (update launchParams)
launchParams: new URLSearchParams([
  ['tgWebAppThemeParams', JSON.stringify(themeParams)],
  ['tgWebAppData', new URLSearchParams([
    ['user', JSON.stringify({ id: 1, first_name: 'Test' })],
    ['auth_date', ((new Date().getTime() / 1000) | 0).toString()],
    ['hash', 'mock-hash'],
  ]).toString()],
  ['tgWebAppVersion', '8.4'],
  ['tgWebAppPlatform', 'tdesktop'],
  ['tgWebAppStartParam', 'debug'],
]),
```

**Issue**: Theme colors not applying

**Fix**: Ensure `bindThemeParamsCssVars()` called in init; check browser supports CSS custom properties.

**Issue**: Start param not appearing

**Fix**: Use query param `?startapp=ABC` (not hash) when launching via `t.me/{bot}/{app}?startapp=ABC`. Access via `tgWebAppStartParam` in hash.

---

## Next Steps

- **Phase 4**: Implement backend validation endpoint (`/api/auth/validate`) using `@telegram-apps/init-data-node`
- **Phase 5**: Build UI components using theme params (`--tg-theme-*`)
- **Phase 6**: Add deep linking logic based on `startParam`

---

**End of Phase 3 Guide**
