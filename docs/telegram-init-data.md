# Init Data (Telegram Mini Apps Docs Snapshot)

Source: https://docs.telegram-mini-apps.com/platform/init-data  
Fetched: 2025-11-17  
Note: Ellipses (...) mark truncated content. Includes both conceptual and validation details.

## Overview
Init data (raw in launch parameter `tgWebAppData`) is a signed bundle of session/user/chat parameters emitted by the Telegram client when a Mini App launches. It can be used for user authorization/authentication after server-side signature verification.

## Retrieving
Client helper:
```typescript
import { retrieveLaunchParams } from '@telegram-apps/sdk';
const { initDataRaw, initData } = retrieveLaunchParams();
```
- `initDataRaw`: Full raw query-string style payload; send to backend for validation.
- `initData`: Parsed object (do not trust until validated).

## Authorization & Authentication
Telegram signs init data using bot secret. Validate signature to ensure integrity and origin. Supports two validation modes:
1. HMAC-SHA256 with bot token (classic).
2. Ed25519 signature (third-party validation) using Telegram public key + bot identifier.

## Sending to Server Example
```typescript
import { retrieveLaunchParams } from '@telegram-apps/sdk';
const { initDataRaw } = retrieveLaunchParams();
fetch('https://example.com/api', {
  method: 'POST',
  headers: { Authorization: `tma ${initDataRaw}` },
});
```
Server flow:
1. Extract `Authorization` header `tma <raw>`.
2. Validate signature.
3. Parse & trust fields.

## Validation (Bot Token) – Algorithm
1. Split raw into key-value pairs; exclude `hash` (store hash).
2. Sort pairs alphabetically.
3. Compute `secret_key = HMAC_SHA256(bot_token, 'WebAppData')` (raw bytes).
4. Compute `calc_hash = HMAC_SHA256(sorted_pairs_joined_with\n, secret_key)`; hex encode.
5. Compare `calc_hash === hash`.
6. (Optional) Check `auth_date` age (expiration window).

### Bot Token Example (Condensed)
- Bot token: `5768337691:AAH5Yk...`
- Raw init data includes: `query_id=...&user=...&auth_date=1662771648&hash=<hex>`.
- Sorted data-check string: `auth_date=1662771648\nquery_id=...\nuser={...}`.
- secret_key (HMAC of token with `WebAppData`): `a5c609aa52f63c...` (bytes).
- Final computed hash matches given hash → trust data.

## Validation (Telegram Public Key) – Algorithm (Third-Party)
Used when sharing init data with third parties without bot token.
1. Split raw; exclude `hash` & `signature` (store `signature`).
2. Sort remaining pairs alphabetically.
3. Construct data-check string: `<bot_id>:WebAppData\n` + sorted joined with `\n`.
4. Base64 decode signature (ensure proper padding `==`).
5. Ed25519 verify(data-check-string, signature, Telegram public key).
6. If true → trust data.
Public keys:
- Production: `e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d`
- Test: `40055058a4ee38156a06562e52eece92a771bcd8346a8c4615cb7376eddf72ec`

### Public Key Notes
Telegram may emit signature variants missing padding; add `=` signs to complete base64 length.

## Recommendation
Add expiration checks using `auth_date` (reject if older than e.g. 1h). Consider replay protection (store hashes or session IDs).

## Parameters List (Summary)
| Name | Type | Notes |
|------|------|-------|
| auth_date | number | Unix timestamp creation moment (check freshness). |
| can_send_after | number? | Seconds until message may be sent via `answerWebAppQuery`. |
| chat | Chat? | Present for attachment menu launches (group/channel). |
| chat_type | string? | `sender` / `private` / `group` / `supergroup` / `channel` (direct link launches). |
| chat_instance | string? | Global identifier for chat (direct link). |
| hash | string | HMAC-SHA256 signature (bot token validation). |
| signature | string? | Ed25519 signature (third-party validation). |
| query_id | string? | Session ID for `answerWebAppQuery`. |
| receiver | User? | Chat partner user object (attachment menu private chat). |
| start_param | string? | From `startapp` / `startattach` (also in launch params). |
| user | User? | Current user object. |

### Chat Object
- id: number
- type: `group` | `supergroup` | `channel`
- title: string
- username?: string
- photo_url?: string (.jpeg or .svg; attachment menu only)

### User Object
Fields (optional when noted):
- id (number)
- first_name
- last_name?
- username?
- language_code?
- is_premium?
- is_bot?
- added_to_attachment_menu?
- allows_write_to_pm?
- photo_url? (.jpeg/.svg; attachment menu only)

## Usage Flow (End-to-End)
1. Client loads, retrieves `initDataRaw`.
2. Sends to server with Authorization header.
3. Server validates (HMAC or Ed25519) and checks `auth_date` freshness.
4. Server parses JSON fields (`user`, `chat`, etc.).
5. Server establishes or updates session; returns app-specific data.

## Node & Go Packages
- Node: `@telegram-apps/init-data-node`
- Go: `github.com/telegram-mini-apps/init-data-golang`
Prefer official packages to avoid mistakes.

## Example Node Validation Snippet (HMAC)
```typescript
import { validate, parse } from '@telegram-apps/init-data-node';
function authorize(raw: string, token: string) {
  validate(raw, token, { expiresIn: 3600 }); // throws on invalid
  return parse(raw); // trusted parsed object
}
```

## Example Go Validation Snippet (HMAC)
```go
import initdata "github.com/telegram-mini-apps/init-data-golang"
func Authorize(raw, token string) (initdata.InitData, error) {
  if err := initdata.Validate(raw, token, time.Hour); err != nil { return initdata.InitData{}, err }
  return initdata.Parse(raw)
}
```

## Security Checklist
- [ ] Validate signature (HMAC or Ed25519) on every auth-related request.
- [ ] Enforce max age (e.g., 1h) using `auth_date`.
- [ ] Treat `user` fields as untrusted until validation passes.
- [ ] Use start_param carefully (do not auto-perform privileged actions).
- [ ] Log only minimal metadata (avoid full raw init data in logs).
- [ ] Monitor for repeated identical valid hashes (replay attempts).

## Additional Links (Selected)
Authorizing User | Launch Parameters | Start Parameter | Debugging | Test Environment | Creating New App

## Metadata
Last updated (source): 2025-10-18 22:59  
Edit on GitHub: https://github.com/telegram-mini-apps/tma.js/blob/master/apps/docs/platform/init-data.md

End of snapshot.
