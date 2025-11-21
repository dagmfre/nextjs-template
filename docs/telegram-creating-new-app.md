# Creating New App (Telegram Mini Apps Docs Snapshot)

Source: https://docs.telegram-mini-apps.com/platform/creating-new-app  
Fetched: 2025-11-17  
Note: Ellipses (...) indicate truncated sections from fetch.

---

## Overview
Guides through developing and registering a new Telegram Mini App: creating bot + Mini App entity, building the web frontend, acquiring and applying its HTTPS URL.

Basic steps:
1. Create Telegram bot and register Mini App via BotFather.
2. Develop the web application (frontend served at HTTPS link).
3. Obtain application URL and configure it using BotFather commands.

---

## Before Starting
Rule: Avoid developing in production. Use the test environment for building & iteration. Production-only after stable.
Test environment advantages:
- Allows HTTP (non-TLS) and direct IP usage.
- Separate accounts & bots; isolates experimentation.
Linking: See Test Environment article for switching instructions.
Production requires valid HTTPS links only.

---

## Creating Application in BotFather
1. Find @BotFather and run `/newbot` to create bot (supply name, username).
2. Run `/newapp` to create Mini App application linked to that bot.
Result: Direct link `https://t.me/{mybot}/{myapp}` becomes available.

INFO: You may also expose a Mini App without `/newapp` by using a bot web interface extension via `/setmenubutton` (menu button integration).

---

## Web Application Link
Precondition: Your frontend is deployed and reachable at its final HTTPS URL (or test HTTP).

### Obtaining
Refer to Getting App Link page for full instructions.

### Applying
Two principal attachment modes:
- Menu Button (`/setmenubutton`): Users opening bot chat can access app from bottom-left menu button.
- Direct Mini App link (`/myapps` > select app > Edit link): App opens when user follows `https://t.me/{mybot}/{myapp}` without needing to start chat.

#### Menu Button
BotFather flow: send `/setmenubutton` > select bot > provide URL + title. Users see menu button and can launch web application.

#### Direct Link
Configure via `/myapps`:
1. Send `/myapps` to BotFather.
2. Select application.
3. Choose `Edit link` and set URL.
User clicking `https://t.me/{mybot}/{myapp}` loads the app using configured source URL.

Usage scenarios:
- Menu Button: Good for conversational bots with embedded tools.
- Direct Link: Faster entry; no need to join chat first.

---

## Debugging Application
For debugging procedures and tooling (webview inspection, etc.), see Debugging page.

---

## Security & Deployment Notes
- Test environment: OK for HTTP/IP; do not leak secrets to production logs.
- Production: Must serve over HTTPS; ensure TLS and stable domain early to prevent re-registration steps.
- Keep bot token secret; avoid embedding raw token in frontend code.
- Use versioning for app link updates to minimize downtime.

---

## Common Pitfalls
- Developing directly in production leads to broken user experience when experimenting.
- Forgetting to update direct link after redeploying to new domain.
- Using `/newapp` on wrong bot instance (test vs production) causing mismatched environment.
- Not configuring menu button leads users to rely solely on direct link (less discoverable).

---

## Quick Checklist
Bot setup:
- [ ] `/newbot` executed
- [ ] `/newapp` executed
Frontend:
- [ ] Deployed (test: HTTP ok; prod: HTTPS cert valid)
Link config:
- [ ] Menu button (optional) via `/setmenubutton`
- [ ] Direct link updated via `/myapps` > Edit link
Testing:
- [ ] Open `https://t.me/{bot}/{app}` loads app
- [ ] Menu button launches app (if configured)

---

## Additional Links (Selected)
- Getting App Link: https://docs.telegram-mini-apps.com/platform/getting-app-link
- Test Environment: https://docs.telegram-mini-apps.com/platform/test-environment
- Debugging: https://docs.telegram-mini-apps.com/platform/debugging
- Authorizing User: https://docs.telegram-mini-apps.com/platform/authorizing-user
- Init Data: https://docs.telegram-mini-apps.com/platform/init-data
- Launch Parameters: https://docs.telegram-mini-apps.com/platform/launch-parameters
- Start Parameter: https://docs.telegram-mini-apps.com/platform/start-parameter

(For full navigation tree, refer to source.)

---

## Metadata
Last updated (source footer): 2025-10-18 22:59
Edit on GitHub: https://github.com/telegram-mini-apps/tma.js/blob/master/apps/docs/platform/creating-new-app.md

---

End of snapshot.
