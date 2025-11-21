# Start Parameter (Telegram Mini Apps Docs Snapshot)

Source: https://docs.telegram-mini-apps.com/platform/start-parameter  
Fetched: 2025-11-17  
Note: Ellipses (...) mark truncated sections.

## Overview
`start` parameter is a custom string passed to a Mini App via external link patterns. Exposed to app as `tgWebAppStartParam` (launch parameters) and mirrored in init data `start_param`.

## When It Appears
1. Bot link query `startattach`:
   - `https://t.me/botusername?startattach=ABC`
2. Direct Mini App link query `startapp`:
   - `https://t.me/botusername/appname?startapp=ABC`
Result: Start parameter value becomes `ABC`.

INFO: This parameter is in URL query, not in hash. Retrieve via `new URL(location.href).searchParams.get('startapp')` or similar depending on link type.

TIP: Use to pre-load context (e.g., deep-linked resource, promo code) before UI render; store securely if used for privileged flows.

## Access Patterns
```typescript
// Generic extraction
const url = new URL(window.location.href);
const startParam = url.searchParams.get('startapp')
  || url.searchParams.get('startattach')
  || new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppStartParam');
```

Also from init data (after validation):
```typescript
const { initData } = retrieveLaunchParams();
const startParam2 = initData?.start_param;
```
Cross-check values for integrity.

## Restrictions
Allowed chars: `A-Z a-z 0-9 _ -` (underscores, hyphen). Length ≤ 512.
Regex: `/^[\w-]{0,512}$/`
For binary or arbitrary content: encode using Base64URL.

## Recommended Uses
- Deep link to specific UI state or entity ID.
- Track campaign / referral sources.
- Pass ephemeral onboarding parameters.
- Select compact vs fullscreen launch mode in conjunction (e.g., `&mode=compact`).

## Security Considerations
- Treat as untrusted until server-side validation (e.g., verifying user permissions).
- Avoid placing secrets; prefer opaque tokens that map server-side.
- Rate-limit flows triggered solely by start parameter to prevent abuse.

## Example Flow
1. User taps deep link `https://t.me/mybot/myapp?startapp=REF123`.
2. Mini App reads `startParam = 'REF123'`.
3. Sends init data + startParam to backend.
4. Backend validates init data, resolves `REF123` to referral metadata.
5. App displays referral-based onboarding.

## Additional Links (Selected)
Launch Parameters | Init Data | Authorizing User | Creating New App | Debugging

## Metadata
Last updated (source): 2025-10-18 22:59
Edit on GitHub: https://github.com/telegram-mini-apps/tma.js/blob/master/apps/docs/platform/start-parameter.md

End of snapshot.
