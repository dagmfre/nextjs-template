# Launch Parameters (Telegram Mini Apps Docs Snapshot)

Source: https://docs.telegram-mini-apps.com/platform/launch-parameters  
Fetched: 2025-11-17  
Note: Ellipses (...) mark truncated sections.

## Overview
Launch parameters are key-value pairs Telegram injects into the Mini App on startup (via hash fragment) describing client version, platform, theme, init data, inline mode state, start parameter and more.

## Transmission Method
Telegram passes parameters in `window.location.hash` as a query string (after `#`). Access with `window.location.hash`. Example raw: `tgWebAppData=...&tgWebAppVersion=6.2&...`.

## Extraction Example
```typescript
const hash = window.location.hash.slice(1); // remove leading '#'
const params = new URLSearchParams(hash);
params.get('tgWebAppVersion'); // e.g. "6.2"
```
TIP: Persist the initial hash early; user refreshes or client-side routing may overwrite it.

## Parameters List (Summary)
- `tgWebAppVersion`: Bot API / Mini Apps version supported by client. Use to feature-detect methods.
- `tgWebAppData`: Encoded init data (user info + signature). See `Init Data` page.
- `tgWebAppPlatform`: Client platform identifier (Android, iOS, macOS, WebK, etc.) helpful for platform-specific UI adjustments.
- `tgWebAppThemeParams`: JSON string of theme colors (bg_color, text_color, hint_color, link_color, button_color, button_text_color, secondary_bg_color...). Parse via `JSON.parse`.
- `tgWebAppShowSettings`: Internal flag used by Telegram SDK to show Settings Button on startup (not generally used externally).
- `tgWebAppBotInline`: Present when launched in inline mode (enables calling `web_app_switch_inline_query`).
- `tgWebAppStartParam`: Custom start parameter from bot/app link (`startapp`, `startattach`).
- `tgWebAppFullscreen`: Indicates if Mini App currently launched in fullscreen mode.

## Theme Params Example
```typescript
const theme = JSON.parse(params.get('tgWebAppThemeParams')!);
// theme.bg_color, theme.text_color, etc.
```
Use early for skeleton/loading screen theming.

## Usage Guidelines
1. Immediately parse & cache `tgWebAppData` for validation (send to server).
2. Use `tgWebAppVersion` to gate new API calls (e.g., bottom bar color, sensors).
3. Apply `tgWebAppThemeParams` to CSS variables before initial paint.
4. Check `tgWebAppStartParam` to branch initial UX (deep linking scenarios).
5. Detect fullscreen for layout decisions (safe area, header presence).

## Minimal Validation Flow (Client)
```typescript
const lp = new URLSearchParams(window.location.hash.slice(1));
const rawInit = lp.get('tgWebAppData'); // send to backend for signature validation
```

## Additional Links (Selected)
Init Data | Start Parameter | Methods | Events | Theming | Debugging

## Metadata
Last updated (source): 2025-10-18 22:59
Edit on GitHub: https://github.com/telegram-mini-apps/tma.js/blob/master/apps/docs/platform/launch-parameters.md

End of snapshot.
