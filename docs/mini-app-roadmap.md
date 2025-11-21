# Telegram Mini App Roadmap (High-Level, Using `nextjs-template`)

This roadmap outlines phased steps from initial setup to deployment and post-launch iteration for a Telegram Mini App built on the provided Next.js template. It is intentionally high-level but comprehensive enough to enumerate required TODOs. Execute phases in order; some tasks can run in parallel where noted.

**CRITICAL**: Always develop in TEST environment first. Avoid developing directly in production to prevent broken user experiences during experimentation.

ALWAYS USE 'https://github.com/Telegram-Mini-Apps/tma.js' AND OTHER DOCS AS REFERENCE FOR ACTUAL IMPLEMENTATION DETAILS.
---
## Phase 0: Foundations & Planning
- Clarify core app purpose, MVP scope, target platforms (Android, iOS, Web, Desktop, macOS).
- Decide feature set: auth, TON Connect, payments (Stars subscriptions/gifts), storage (CloudStorage/DeviceStorage/SecureStorage), deep links.
- Identify sensitive data flows (init data, bot token, user tokens) and security requirements.
- Choose hosting (Vercel recommended per README, or custom) and production domain.
- Define success metrics (daily active, conversion, latency) & logging strategy.
- **Document decision**: Menu Button vs Direct Mini App link (or both) for user access pattern.

## Phase 1: Local Environment Setup
- **Requirement**: Install PNPM (template uses pnpm; other package managers will error).
- Install PNPM, Node version matching template requirements.
- Run `pnpm install` and verify `pnpm run dev` works (mock environment active).
- Review `mockEnv.ts` / `Root` component to understand Telegram env mocking via `mockTelegramEnv` function.
- **CRITICAL**: `mockTelegramEnv` simulates Telegram environment for local dev. Plan removal/conditional disabling for production.
- Set up ESLint enforcement (already present). Confirm `pnpm run lint` passes.
- Configure `.env.local` (bot token placeholder - **keep secret, never in client code**, TON settings, API base URL).

## Phase 2: Bot & Mini App Registration (Test Environment First)
- **CRITICAL**: Use Telegram **test environment** for initial development (allows HTTP, direct IP usage).
- Refer to Test Environment article for switching to test environment.
- Log into Telegram test environment and create test user.
- Create bot via BotFather command: `/newbot` (supply bot name and username).
- **Result**: Bot token provided - keep this SECRET.
- Register Mini App via BotFather command: `/newapp` on your bot.
- **Result**: Direct link pattern available: `https://t.me/{mybot}/{myapp}`.
- **Two attachment modes**:
  - **Menu Button** (optional): Configure via `/setmenubutton` - users access app from bottom-left menu in bot chat.
  - **Direct Mini App link**: Configure via `/myapps` > select app > Edit link - users open via `https://t.me/{mybot}/{myapp}` without starting chat first.
- Map deep link patterns: `startattach` (menu button context) and `startapp` (direct link context).
- **Test environment advantages**: HTTP links OK, separate accounts/bots, isolated experimentation.
- **Production deployment**: Create production bot + Mini App ONLY after stable test iteration.
- **Production requirement**: HTTPS links only (no HTTP or direct IP).

## Phase 3: Core App Adaptation & Launch Parameters Handling
- **CRITICAL**: Conditionally disable mock environment for real Telegram context (guard by NODE_ENV or environment detection).
- Implement initialization: Call `retrieveLaunchParams()` from `@telegram-apps/sdk` as early as possible.
- **CRITICAL**: Persist initial `window.location.hash` immediately on app load; user refreshes or client routing may overwrite it.
- Extract and cache launch parameters from hash fragment:
  - `tgWebAppVersion`: Bot API version (use for feature detection via `isVersionAtLeast`).
  - `tgWebAppData`: Raw init data (signed user info) - **send to server for validation**.
  - `tgWebAppPlatform`: Client platform (Android, iOS, macOS, WebK, etc.) - use for platform-specific UI.
  - `tgWebAppThemeParams`: JSON string of theme colors - parse early for skeleton/loading theming.
  - `tgWebAppShowSettings`: Internal flag for Settings Button (SDK-handled).
  - `tgWebAppBotInline`: Present when launched in inline mode.
  - `tgWebAppStartParam`: Custom start parameter from bot/app link (deep linking).
  - `tgWebAppFullscreen`: Indicates fullscreen launch mode.
- Add validation pipeline placeholder (client sends raw init data with `Authorization: tma <rawInitData>` header).
- Create backend endpoint spec for auth (if not using external service).
- Add typed wrappers for launch parameters, theme parameters.
- Implement fallback logic if hash routing conflicts with SPA client-side routing.

## Phase 4: Authorization & Init Data Validation
**Init data is a signed bundle of session/user/chat parameters used for user authorization/authentication.**

### Client-Side (Retrieval)
- Use `retrieveLaunchParams()` to get `initDataRaw` (full raw query string) and `initData` (parsed object).
- **CRITICAL**: Do NOT trust `initData` until server validates signature.
- Send `initDataRaw` to backend with header format: `Authorization: tma <initDataRaw>`.

### Server-Side (Validation)
**Two validation methods available:**

#### Method 1: HMAC-SHA256 (Bot Token Validation)
- Use `@telegram-apps/init-data-node` package (Node.js) or `github.com/telegram-mini-apps/init-data-golang` (Go).
- Algorithm:
  1. Split raw init data into key-value pairs; extract and store `hash` parameter separately.
  2. Sort remaining pairs alphabetically by key.
  3. Compute `secret_key = HMAC_SHA256(bot_token, "WebAppData")` (raw bytes, NOT hex).
  4. Join sorted pairs with `\n` to create data-check-string.
  5. Compute `calculated_hash = HMAC_SHA256(data-check-string, secret_key)`; hex encode.
  6. Compare `calculated_hash === hash` (constant-time comparison recommended).
- **Expiration check**: Validate `auth_date` field (reject if older than acceptable window, e.g., 1 hour via `expiresIn: 3600`).
- **Replay protection**: Consider storing validated hashes or session IDs.

#### Method 2: Ed25519 Signature (Third-Party Validation - No Bot Token Required)
- Use when sharing init data with third parties without revealing bot token.
- Algorithm:
  1. Split raw; exclude `hash` & `signature` parameters; store `signature`.
  2. Sort remaining pairs alphabetically.
  3. Construct data-check-string: `<bot_id>:WebAppData\n` + sorted pairs joined with `\n`.
  4. Base64 decode signature (add `==` padding if missing - Telegram may omit).
  5. Ed25519 verify(data-check-string, signature, Telegram public key).
- **Telegram public keys**:
  - Production: `e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d`
  - Test: `40055058a4ee38156a06562e52eece92a771bcd8346a8c4615cb7376eddf72ec`

### Post-Validation
- Parse init data fields: `user`, `chat`, `query_id`, `start_param`, `receiver`, `chat_type`, `chat_instance`, `can_send_after`.
- Store in session/context for downstream use.
- **Security**: Mask/avoid logging raw `initDataRaw`; log only hash & user id.
- Issue signed short-lived session token (optional) to avoid re-validating every request.

### Init Data Parameters (Key Fields)
- `auth_date` (number): Unix timestamp creation; check freshness.
- `hash` (string): HMAC-SHA256 signature for bot token validation.
- `signature` (string, optional): Ed25519 signature for third-party validation.
- `query_id` (string, optional): Session ID for `answerWebAppQuery` method.
- `user` (User object, optional): Current user info (id, first_name, last_name, username, language_code, is_premium, is_bot, added_to_attachment_menu, allows_write_to_pm, photo_url).
- `receiver` (User object, optional): Chat partner in attachment menu private chat.
- `chat` (Chat object, optional): Present for attachment menu launches (id, type, title, username, photo_url).
- `chat_type` (string, optional): `sender`/`private`/`group`/`supergroup`/`channel` (direct link launches).
- `chat_instance` (string, optional): Global identifier for chat (direct link).
- `start_param` (string, optional): Custom parameter from bot/app link.
- `can_send_after` (number, optional): Seconds until message may be sent via `answerWebAppQuery`.

## Phase 5: Start Parameter & Deep Linking
**Start parameter is a custom string passed to Mini App via external link patterns.**

### When Start Parameter Appears
- **Bot link with `startattach` query**: `https://t.me/botusername?startattach=ABC` → start parameter = `ABC`.
- **Direct Mini App link with `startapp` query**: `https://t.me/botusername/appname?startapp=ABC` → start parameter = `ABC`.
- Accessible as `tgWebAppStartParam` in launch parameters AND `start_param` in init data.

### Extraction
```typescript
// From URL query (note: in query, NOT hash)
const url = new URL(window.location.href);
const startParam = url.searchParams.get('startapp') 
  || url.searchParams.get('startattach')
  || new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppStartParam');

// From init data (after validation)
const { initData } = retrieveLaunchParams();
const startParam2 = initData?.start_param;
```

### Restrictions
- **Allowed characters**: `A-Z a-z 0-9 _ -` (alphanumeric, underscore, hyphen only).
- **Max length**: 512 characters.
- **Regex validation**: `/^[\w-]{0,512}$/`
- For binary or arbitrary content: encode using Base64URL before passing.

### Recommended Uses
- Deep link to specific UI state or entity ID.
- Track campaign/referral sources.
- Pass ephemeral onboarding parameters.
- Select compact vs fullscreen launch mode (e.g., `&mode=compact` if supported).

### Implementation
- Implement start parameter routing logic (e.g., promo code handling, entity pre-load).
- Cross-check start parameter from URL query vs init data for integrity.
- **Security**: Treat as untrusted input until server-side validation; verify user permissions.
- Avoid placing secrets in start parameter; prefer opaque tokens that map server-side.
- Rate-limit flows triggered solely by start parameter to prevent abuse.

## Phase 6: Theming & Safe Areas
### Theme Parameters
- Parse `tgWebAppThemeParams` from launch parameters (JSON string).
- **Available theme colors** (per Bot API 7.0+):
  - `bg_color`, `text_color`, `hint_color`, `link_color`
  - `button_color`, `button_text_color`
  - `secondary_bg_color`
  - `header_bg_color` (Bot API 7.0+)
  - `accent_text_color` (Bot API 7.0+)
  - `section_bg_color`, `section_header_text_color` (Bot API 7.0+)
  - `section_separator_color` (Bot API 7.6+)
  - `subtitle_text_color` (Bot API 7.0+)
  - `destructive_text_color` (Bot API 7.0+)
  - `bottom_bar_bg_color` (Bot API 7.10+)
- **Implementation**:
  - Map theme params to CSS variables BEFORE first paint (prevent flash of unstyled content).
  - Example: `--tg-theme-bg-color`, `--tg-theme-text-color`, etc.
  - Apply to root element or `:root` selector.
- **Dynamic updates**: Listen to `themeChanged` event and re-apply CSS variables.
- Provide dark/light adaptive tokens; verify contrast accessibility (WCAG AA minimum).

### Safe Areas
- **Bot API 8.0+ fields** (fullscreen mode):
  - `safeAreaInset`: Insets from screen edges (top, bottom, left, right) to avoid system UI overlap.
  - `contentSafeAreaInset`: Additional insets for content area.
- **Implementation**:
  - Apply safe area insets using CSS variables: `--tg-safe-area-inset-top`, etc.
  - Use CSS `env(safe-area-inset-*)` as fallback for iOS notch compatibility.
  - Ensure critical UI elements (buttons, forms) respect safe areas.
- **Events**: Listen to `safeAreaChanged` and `contentSafeAreaChanged` events for dynamic updates (orientation changes, fullscreen toggle).

## Phase 7: UI & Interaction Enhancements
### Buttons (Bot API 7.10+)
- **MainButton** (renamed to **BottomButton** in Bot API 7.10):
  - Primary action button at bottom of Mini App.
  - Properties: `text`, `color`, `textColor`, `isVisible`, `isActive`, `isProgressVisible`.
  - Methods: `setText()`, `onClick()`, `show()`, `hide()`, `enable()`, `disable()`, `showProgress()`, `hideProgress()`.
  - Event: `mainButtonClicked`.
- **SecondaryButton** (Bot API 7.10+):
  - Secondary action button alongside MainButton.
  - Properties/methods: Similar to MainButton.
  - Event: `secondaryButtonClicked`.
- **BackButton**:
  - Shows back arrow in header; use for in-app navigation stack.
  - Methods: `show()`, `hide()`, `onClick()`.
  - Event: `backButtonClicked`.
- **SettingsButton** (Bot API 7.0+):
  - Shows settings icon in header.
  - Methods: `show()`, `hide()`, `onClick()`.
  - Event: `settingsButtonClicked`.
- **Bottom Bar Color** (Bot API 7.10+):
  - Customize bottom bar background via `setBottomBarColor(color)`.
  - Access via `bottomBarColor` property.

### Haptic Feedback
- Use `HapticFeedback` for meaningful user interactions (button taps, errors, success).
- Methods:
  - `impactOccurred(style)`: `light`, `medium`, `heavy`, `rigid`, `soft`.
  - `notificationOccurred(type)`: `error`, `success`, `warning`.
  - `selectionChanged()`: For selection changes.

### Fullscreen Mode (Bot API 8.0+)
- **Methods**:
  - `requestFullscreen()`: Enter fullscreen (portrait or landscape).
  - `exitFullscreen()`: Exit fullscreen.
- **Properties**:
  - `isFullscreen`: Current fullscreen state.
  - `isActive`: Whether Mini App is currently active/visible.
- **Events**:
  - `fullscreenChanged`: Fullscreen state changed.
  - `fullscreenFailed`: Fullscreen request failed.
  - `activated`, `deactivated`: App visibility changed.
- **Orientation Lock**:
  - `lockOrientation()`: Lock to current orientation.
  - `unlockOrientation()`: Allow orientation changes.
  - Property: `isOrientationLocked`.

### Viewport
- **Viewport properties**: `height`, `width`, `isExpanded`, `stableHeight`.
- **Methods**:
  - `expand()`: Expand Mini App to full viewport height.
  - `requestFullscreen()` / `exitFullscreen()` (see above).
- **Events**:
  - `viewportChanged`: Viewport dimensions changed (rotation, keyboard, expansion).
- **Vertical Swipes** (Bot API 7.7+):
  - `enableVerticalSwipes()` / `disableVerticalSwipes()`: Control swipe-to-close gesture.
  - Property: `isVerticalSwipesEnabled`.

### Closing Confirmation (Bot API 6.2+)
- Enable/disable confirmation dialog when user attempts to close Mini App.
- Methods: `enableClosingConfirmation()`, `disableClosingConfirmation()`.
- Property: `isClosingConfirmationEnabled`.

## Phase 8: Additional Features & Integrations
### TON Connect Integration
- Verify existing TON Connect page wiring (`ton-connect/page.tsx`).
- Configure wallet connection flows & error handling.
- Secure server validation of TON transactions or signatures (if applicable).
- Provide fallback UI when wallet not available.

### Media Sharing & File Downloads (Bot API 8.0+)
- **Share Message**: `shareMessage(msgId, callback)` - share media from Mini App.
  - Events: `shareMessageSent`, `shareMessageFailed`.
- **Share to Story** (Bot API 7.8+): `shareToStory(mediaUrl, params)`.
- **Download File** (Bot API 8.0+): `downloadFile(url, fileName)`.
  - Event: `fileDownloadRequested`.

### QR Code Scanner (Bot API 6.4+)
- **Methods**:
  - `showScanQrPopup(params, callback)`: Show QR scanner popup.
  - `closeScanQrPopup()`: Close QR scanner.
- **Events**:
  - `qrTextReceived`: QR code scanned.
  - `scanQrPopupClosed` (Bot API 7.7+): Scanner closed.

### Clipboard (Bot API 6.4+)
- `readTextFromClipboard(callback)`: Read clipboard text.
- Event: `clipboardTextReceived`.

### Popups & Alerts (Bot API 6.2+)
- **Methods**:
  - `showPopup(params, callback)`: Custom popup with buttons.
  - `showAlert(message, callback)`: Simple alert.
  - `showConfirm(message, callback)`: Confirm dialog.
- **Event**: `popupClosed`.

### Links & Navigation
- **Open Links**:
  - `openLink(url, options)`: Open URL in external browser or in-app browser (Bot API 6.4+: `try_instant_view` option).
  - Mini Apps no longer auto-close on `openTelegramLink()` (Bot API 7.0+).
- **Switch Inline Query** (Bot API 6.7+):
  - `switchInlineQuery(query, chooseChatTypes)`: Switch to inline mode with pre-filled query.

### Contact & Permissions (Bot API 6.9+)
- **Request Write Access**: `requestWriteAccess(callback)` - request permission to send messages to user.
  - Event: `writeAccessRequested`.
- **Request Contact**: `requestContact(callback)` - request user's phone number.
  - Event: `contactRequested`.

### Emoji Status (Bot API 8.0+)
- **Set Emoji Status**: `setEmojiStatus(customEmojiId, params)`.
  - Events: `emojiStatusSet`, `emojiStatusFailed`.
- **Request Emoji Status Access**: `requestEmojiStatusAccess(callback)`.
  - Event: `emojiStatusAccessRequested`.

### Homescreen Shortcuts (Bot API 8.0+)
- **Add to Homescreen**: `addToHomeScreen()` - prompt to add Mini App to device homescreen.
  - Event: `homeScreenAdded`.
- **Check Homescreen Status**: `checkHomeScreenStatus(callback)`.
  - Event: `homeScreenChecked`.

### Biometric Authentication (Bot API 7.2+)
- Access via `BiometricManager`.
- Methods: `init()`, `requestAccess()`, `authenticate()`, `updateBiometricToken()`.
- Check `isInited`, `isBiometricAvailable`, `biometricType`, `isAccessGranted`, `isAccessRequested`, `isBiometricTokenSaved`, `deviceId`.

### Geolocation (Bot API 8.0+)
- Access via `LocationManager`.
- Events: `locationManagerUpdated`, `locationRequested`.

### Device Motion Tracking (Bot API 8.0+)
- **Accelerometer**: Track device acceleration.
  - Events: `accelerometerStarted`, `accelerometerStopped`, `accelerometerChanged`, `accelerometerFailed`.
- **Gyroscope**: Track device rotation.
  - Events: `gyroscopeStarted`, `gyroscopeStopped`, `gyroscopeChanged`, `gyroscopeFailed`.
- **Device Orientation**: Track device orientation.
  - Events: `deviceOrientationStarted`, `deviceOrientationStopped`, `deviceOrientationChanged`, `deviceOrientationFailed`.

### Performance Info (Bot API 8.0+)
- Android Mini Apps can receive basic device performance info for hardware-specific optimizations.

### Loading Screen Customization (Bot API 8.0+)
- Customize loading screen icon and colors for branded experience.

## Phase 9: Data Persistence & Storage
**Three storage types available** (feature detection via `isVersionAtLeast` required):

### CloudStorage (Bot API 6.9+)
- **Purpose**: Sync small key-value pairs across devices (up to 1024 keys per user).
- **Methods**: `setItem(key, value)`, `getItem(key)`, `getItems(keys)`, `removeItem(key)`, `removeItems(keys)`, `getKeys()`.
- **Limits**: Key max 128 chars, value max 4096 chars.
- **Use cases**: User preferences, settings, cross-device sync.
- **Note**: Not suitable for large data or sensitive secrets (use SecureStorage).

### DeviceStorage (Bot API 9.0+)
- **Purpose**: Persistent local storage on user's device (larger capacity than CloudStorage).
- **Use cases**: Cached data, offline content, non-sensitive app state.
- **Note**: Device-specific; not synced across devices.

### SecureStorage (Bot API 9.0+)
- **Purpose**: Secure local storage for sensitive data (tokens, keys, credentials).
- **Methods**: Similar to DeviceStorage with encryption.
- **Use cases**: Auth tokens, API keys, user secrets.
- **Security**: Encrypted at rest; device-specific.

### Implementation Guidelines
- Abstract storage layer with feature detection (`isVersionAtLeast` checks).
- Implement serialization (JSON.stringify/parse) and error handling callbacks.
- **Encrypt or tokenize** sensitive values before storing in CloudStorage or DeviceStorage.
- Use SecureStorage for sensitive tokens when available (fallback to server-side session).
- Provide graceful degradation if storage unavailable (e.g., in-memory fallback).

## Phase 10: Server API & Business Logic
- Define API routes (e.g., `/api/auth`, `/api/user`, `/api/actions`).
- **Authentication**: Validate init data on each request OR issue signed short-lived session token after initial validation.
- Add rate limiting (per user id/hash) to mitigate abuse.
- Implement structured error responses & correlation IDs for debugging.
- Integrate database (Prisma + chosen DB: PostgreSQL, MySQL, SQLite) if persistent user state needed.
- Add cache strategy for static catalogs / reference data (Redis, in-memory).
- **Security**: Ensure all endpoints validate user identity; prevent unauthorized access.

## Phase 11: Payments & Monetization (Bot API 8.0+)
**Telegram Stars** payment system integration:

### Subscription Plans
- Create recurring subscription plans powered by Telegram Stars.
- Manage subscription lifecycle (activate, renew, cancel).
- Handle subscription status webhooks.

### Gifts
- Send Telegram Stars gifts to users from Mini App.
- Track gift transactions and user balances.

### Implementation
- Integrate Telegram payments API for Stars transactions.
- Implement server-side payment verification and receipt validation.
- Store subscription/payment state in database.
- Handle payment callbacks and update user entitlements.
- Provide UI for payment flows (subscribe, purchase, gift).

## Phase 11: Security Hardening
- **Init Data Validation**: Validate signature on each request OR issue signed short-lived session token after initial validation.
- **Expiration Enforcement**: Reject init data older than acceptable window (e.g., 1 hour) via `auth_date` check.
- **Replay Protection**: Store validated hashes or session IDs to prevent reuse.
- **CSRF Protection**: Implement for non-idempotent endpoints (token or same-origin policy).
- **Input Sanitization**: Sanitize all user-provided inputs (`start_param`, referral codes, form data).
- **Content Security Policy (CSP)**: Configure CSP headers (consider Telegram webview constraints).
- **HTTPS Enforcement**: 
  - **Production requirement**: HTTPS only (no HTTP or direct IP).
  - Set HSTS (HTTP Strict Transport Security) header on final domain.
- **Bot Token Security**:
  - **CRITICAL**: Keep bot token SECRET at all times.
  - **NEVER** embed bot token in client-side code or logs.
  - Store in environment variables; access server-side only.
  - Use different tokens for test vs production environments.
- **Secure Storage**: Use SecureStorage for sensitive client-side data; encrypt before storing in CloudStorage/DeviceStorage.
- **Rate Limiting**: Implement per-user and per-IP rate limiting to prevent abuse.
- **Error Messages**: Avoid leaking sensitive information in error responses (stack traces, internal paths).

## Phase 12: Error Monitoring & Logging
- Integrate client logging (console wrapper) with log levels sent to backend.
- Capture key events (authorization success/failure, storage errors). 
- Aggregate server logs (structured JSON) in monitoring stack (e.g., Logtail, ELK).
- Add alerting thresholds (auth failures spike, latency > target).

## Phase 13: Testing Strategy
- **Unit Tests**: 
  - Utilities (init data parsers, validators, signature verification).
  - Storage abstractions (CloudStorage, DeviceStorage, SecureStorage wrappers).
  - Launch parameter extraction logic.
- **Integration Tests**: 
  - Init data validation flows (HMAC-SHA256 and Ed25519).
  - Start parameter routing and deep linking scenarios.
  - Theme parameter parsing and CSS variable application.
  - Storage operations (set/get/remove across storage types).
- **End-to-End Tests** (Cypress/Playwright):
  - Test under mock environment AND real Telegram test environment.
  - User flows: launch → auth → main features → payment/subscription (if applicable).
  - Button interactions (MainButton, SecondaryButton, BackButton, SettingsButton).
  - Fullscreen mode, orientation lock, viewport changes.
  - Theme switching (light/dark mode).
- **Performance Checks**:
  - Time to Ready (time until `ready()` method called).
  - Launch parameter extraction latency.
  - Theme application before first paint (no flash of unstyled content).
  - API response times (auth, data fetching).
- **Regression Checklist** (before each release):
  - Theme change handling (dynamic updates).
  - Fullscreen mode toggle.
  - Haptic feedback on supported platforms.
  - TON Connect wallet flows.
  - Storage operations (CloudStorage sync, SecureStorage encryption).
  - Deep linking with various start parameters.
  - Multi-platform testing (Android, iOS, Web, Desktop, macOS).

## Phase 14: Production Deployment
- **Environment**: Switch from test environment to production Telegram.
- **Build**: Run `pnpm run build` and verify build output & SSR integrity.
- **Hosting** (Vercel recommended per README):
  - Deploy to Vercel or chosen hosting platform.
  - Set environment variables:
    - `BOT_TOKEN` (production bot token - keep SECRET).
    - `API_BASE_URL` (production API endpoint).
    - `TON_MANIFEST_URL` (TON Connect manifest URL).
    - Database credentials (if applicable).
    - Other service API keys (payments, analytics).
- **Domain & SSL**:
  - Acquire production domain (custom domain on Vercel or separate).
  - Ensure valid HTTPS certificate (auto-provisioned by Vercel or via Let's Encrypt).
  - **CRITICAL**: Production requires HTTPS only (no HTTP or direct IP).
- **BotFather Configuration**:
  - Update BotFather with production Mini App HTTPS link:
    - Menu Button: `/setmenubutton` → select production bot → provide HTTPS URL + title.
    - Direct Link: `/myapps` → select app → Edit link → set production HTTPS URL.
  - Verify direct link pattern: `https://t.me/{production_bot}/{app_name}`.
- **Mock Environment Removal**:
  - **CRITICAL**: Disable or remove `mockTelegramEnv` function for production.
  - Ensure app detects real Telegram environment (no mocking).
  - Remove development-only code paths.
- **Smoke Testing**:
  - Test via web.telegram.org (Web Telegram).
  - Test on mobile Telegram clients (Android, iOS).
  - Test on desktop Telegram clients (Windows, macOS, Linux).
  - Verify:
    - App loads correctly with real init data.
    - Theme parameters applied properly.
    - Authentication flow works.
    - Main features functional.
    - Payment flows (if applicable).
- **Monitoring Setup**:
  - Configure error tracking (Sentry, Logtail, etc.).
  - Set up logging aggregation.
  - Configure alerting for critical errors.

## Phase 15: Post-Launch Optimization
- **Metrics Collection**: Monitor initial usage metrics (DAU, session length, conversion rates).
- **UI/UX Refinement**: Iterate based on user feedback and analytics.
- **Incremental Features** (Bot API 8.0+):
  - Emoji Status integration (`setEmojiStatus`, `requestEmojiStatusAccess`).
  - Homescreen Shortcuts (`addToHomeScreen`, `checkHomeScreenStatus`).
  - Geolocation features (if applicable via `LocationManager`).
  - Device Motion sensors (Accelerometer, Gyroscope, DeviceOrientation) for interactive features.
- **Localization Improvements**:
  - Leverage existing `i18n` structure (`public/locales/en.json`, `ru.json`).
  - Add additional language support based on user demographics.
  - Use `user.language_code` from init data for auto-detection.
- **Monetization Optimization** (Bot API 8.0+):
  - Subscription Plans: Refine pricing, trial periods, feature tiers.
  - Telegram Stars Gifts: Implement reward/incentive programs.
  - Track subscription lifecycle metrics (churn, renewal rates).
- **Performance Optimization**:
  - Reduce bundle size (code splitting, tree shaking).
  - Optimize images and assets.
  - Implement lazy loading for non-critical components.
  - Monitor and improve Time to Interactive (TTI).
- **Advanced Storage**:
  - Migrate from CloudStorage to SecureStorage for sensitive data (Bot API 9.0+).
  - Implement offline-first architecture using DeviceStorage (Bot API 9.0+).
  - Add data sync conflict resolution for CloudStorage.

## Phase 16: Documentation & Developer Handoff
- **README Updates**:
  - Update with production deployment steps (remove mock environment instructions).
  - Add environment variable documentation (required vars, optional vars, formats).
  - Include BotFather configuration steps (menu button, direct link).
  - Add troubleshooting section (common issues, solutions).
- **SECURITY.md**:
  - Document init data validation process (HMAC-SHA256 and Ed25519).
  - Explain expiration policy (e.g., 1-hour window).
  - List security best practices (bot token handling, input sanitization, rate limiting).
  - Describe storage security model (CloudStorage vs SecureStorage).
- **API Documentation**:
  - Document all API endpoints (routes, methods, parameters, responses).
  - Include authentication requirements (init data validation).
  - Add example requests/responses.
- **Developer Quickstart**:
  - Commands for setup (`pnpm install`, `pnpm run dev`, `pnpm run build`).
  - Environment setup guide (`.env.local` template).
  - Test environment setup (how to switch to Telegram test environment).
  - Local development workflow (mock environment usage).
- **Architecture Documentation**:
  - Document project structure and key components.
  - Explain launch parameter flow and init data validation pipeline.
  - Describe storage abstraction layer.
  - Document theming system and CSS variable mapping.
- **Contribution Guidelines** (if open-source or team project):
  - Code style and linting requirements.
  - Testing requirements (unit, integration, E2E).
  - Pull request process.
  - Issue reporting guidelines.

## Phase 17: Optional Advanced Features
### Third-Party Integration
- Implement Ed25519 signature validation endpoint for third-party partners (no bot token sharing).
- Provide webhook endpoints for external services.
- Document third-party API integration guidelines.

### Progressive Web App (PWA)
- Add offline caching / PWA manifest (if acceptable inside webview).
- Implement service worker for offline functionality.
- Cache static assets and API responses.
- **Note**: Test compatibility with Telegram webview environment.

### Analytics & Monitoring
- Integrate privacy-compliant analytics (respect user privacy, GDPR).
- Implement funnel analysis (user journey tracking).
- Track key conversion events (sign-up, subscription, feature usage).
- Monitor performance metrics (load time, API latency, error rates).
- **Security**: Anonymize user data; avoid logging PII without consent.

### Advanced Settings Sync
- Implement persistent settings sync using CloudStorage.
- Fallback to local storage (DeviceStorage) when CloudStorage unavailable.
- Handle sync conflicts (last-write-wins, merge strategies).
- Encrypt sensitive settings before sync.

### Mini App Preview (Bot API 7.8+)
- Set Main Mini App preview for direct launch.
- Configure preview image and description for better discoverability.

### Debugging Support
- Implement remote debugging capabilities (refer to Debugging documentation).
- Add development tools overlay (feature flags, state inspector).
- Enable verbose logging in test environment.
- Integrate with Telegram's debugging tools (iOS support per Bot API 8.0+).

---
## Consolidated TODO List (By Phase)
### Phase 0: Foundations
- [ ] Define MVP scope and core app purpose.
- [ ] Choose target platforms (Android, iOS, Web, Desktop, macOS).
- [ ] Decide on feature set (auth, TON Connect, payments, storage, deep links).
- [ ] Select hosting platform and acquire domain.
- [ ] Define metrics and logging strategy.
- [ ] Document Menu Button vs Direct Link access decision.

### Phase 1: Local Environment
- [ ] Install PNPM (required; other package managers will error).
- [ ] Run `pnpm install` and verify `pnpm run dev`.
- [ ] Review `mockTelegramEnv` function usage in `mockEnv.ts` / `Root`.
- [ ] Configure `.env.local` (bot token, API URLs, TON settings).
- [ ] Confirm `pnpm run lint` passes.

### Phase 2: Bot & Mini App Registration (Test First)
- [ ] Switch to Telegram test environment.
- [ ] Create test bot via `/newbot`.
- [ ] Register test Mini App via `/newapp`.
- [ ] Configure Menu Button via `/setmenubutton` (optional).
- [ ] Configure Direct Link via `/myapps` > Edit link.
- [ ] Document deep link patterns (`startattach`, `startapp`).

### Phase 3: Core App & Launch Parameters
- [ ] Conditionally disable mock environment for production.
- [ ] Persist initial `window.location.hash` on app load.
- [ ] Extract all launch parameters (version, platform, theme, init data, start param, fullscreen).
- [ ] Create backend auth endpoint spec.
- [ ] Add typed wrappers for launch/theme parameters.
- [ ] Implement hash routing conflict fallback.

### Phase 4: Authorization & Init Data
- [ ] Implement HMAC-SHA256 validation (Node: `@telegram-apps/init-data-node`, Go: `github.com/telegram-mini-apps/init-data-golang`).
- [ ] Add expiration check (`auth_date` within 1 hour).
- [ ] Implement Ed25519 validation (optional, third-party).
- [ ] Parse and store `user`, `chat`, `query_id`, `start_param`, etc.
- [ ] Add replay protection (hash/session tracking).
- [ ] Implement session token (optional, for avoiding re-validation).

### Phase 5: Start Parameter & Deep Linking
- [ ] Extract start parameter from URL query and init data.
- [ ] Implement deep link routing logic.
- [ ] Validate start parameter format (regex: `/^[\w-]{0,512}$/`).
- [ ] Add server-side start parameter validation.
- [ ] Implement rate limiting for start parameter flows.

### Phase 6: Theming & Safe Areas
- [ ] Parse `tgWebAppThemeParams` JSON.
- [ ] Map all theme colors to CSS variables (18+ colors).
- [ ] Apply theme before first paint (prevent flash).
- [ ] Listen to `themeChanged` event for dynamic updates.
- [ ] Implement safe area insets (CSS variables, `env()` fallback).
- [ ] Listen to `safeAreaChanged` and `contentSafeAreaChanged` events.
- [ ] Verify accessibility (contrast ratios).

### Phase 7: UI & Interactions
- [ ] Implement MainButton (BottomButton) states and handlers.
- [ ] Implement SecondaryButton (Bot API 7.10+).
- [ ] Add BackButton for navigation stack.
- [ ] Add SettingsButton (Bot API 7.0+).
- [ ] Configure bottom bar color (Bot API 7.10+).
- [ ] Integrate HapticFeedback (impact, notification, selection).
- [ ] Implement fullscreen mode (request/exit, orientation lock).
- [ ] Handle viewport changes (`viewportChanged` event).
- [ ] Implement closing confirmation (Bot API 6.2+).
- [ ] Add vertical swipes control (Bot API 7.7+).

### Phase 8: Additional Features
- [ ] Configure TON Connect wallet flows.
- [ ] Implement media sharing (`shareMessage`, `shareToStory`).
- [ ] Add file download support (`downloadFile`).
- [ ] Implement QR scanner (`showScanQrPopup`).
- [ ] Add clipboard access (`readTextFromClipboard`).
- [ ] Implement popups/alerts (`showPopup`, `showAlert`, `showConfirm`).
- [ ] Configure link opening (`openLink`, `openTelegramLink`).
- [ ] Add inline query switching (`switchInlineQuery`).
- [ ] Implement contact/permission requests (`requestWriteAccess`, `requestContact`).
- [ ] Add emoji status features (Bot API 8.0+).
- [ ] Implement homescreen shortcuts (Bot API 8.0+).
- [ ] Configure BiometricManager (Bot API 7.2+).
- [ ] Add geolocation support (Bot API 8.0+).
- [ ] Implement device motion tracking (Bot API 8.0+).
- [ ] Customize loading screen (Bot API 8.0+).

### Phase 9: Storage
- [ ] Implement CloudStorage wrapper (sync across devices).
- [ ] Implement DeviceStorage wrapper (local persistence).
- [ ] Implement SecureStorage wrapper (encrypted secrets).
- [ ] Add feature detection for storage types.
- [ ] Implement serialization and error handling.
- [ ] Encrypt sensitive data before CloudStorage/DeviceStorage.

### Phase 10: Server API
- [ ] Define API routes (`/api/auth`, `/api/user`, etc.).
- [ ] Implement init data validation middleware.
- [ ] Add rate limiting per user/IP.
- [ ] Configure database (Prisma + PostgreSQL/MySQL/SQLite).
- [ ] Implement caching strategy (Redis, in-memory).
- [ ] Add structured error responses.

### Phase 11: Payments (Optional)
- [ ] Integrate Telegram Stars payment API.
- [ ] Implement subscription plans.
- [ ] Add gift sending functionality.
- [ ] Configure payment webhooks.
- [ ] Implement receipt validation.
- [ ] Store payment/subscription state.

### Phase 12: Security
- [ ] Enforce init data validation on all requests.
- [ ] Implement expiration checks (`auth_date`).
- [ ] Add replay protection.
- [ ] Implement CSRF protection.
- [ ] Sanitize all user inputs.
- [ ] Configure Content Security Policy.
- [ ] Enforce HTTPS in production (set HSTS).
- [ ] Secure bot token (env vars, never in client/logs).
- [ ] Implement rate limiting.
- [ ] Sanitize error messages (no sensitive data leaks).

### Phase 13: Error Monitoring
- [ ] Configure client-side logging (levels, batching).
- [ ] Capture key events (auth, storage errors).
- [ ] Set up server log aggregation (structured JSON).
- [ ] Configure alerting thresholds.
- [ ] Integrate error tracking service (Sentry, Logtail).

### Phase 14: Testing
- [ ] Write unit tests (validators, parsers, storage).
- [ ] Write integration tests (auth flows, deep linking).
- [ ] Write E2E tests (mock and real Telegram test env).
- [ ] Add performance benchmarks (Time to Ready, API latency).
- [ ] Create regression test checklist.
- [ ] Test on all target platforms (Android, iOS, Web, Desktop, macOS).

### Phase 15: Production Deployment
- [ ] Run `pnpm run build` and verify output.
- [ ] Deploy to Vercel (or chosen platform).
- [ ] Set production environment variables.
- [ ] Configure production domain and SSL.
- [ ] Update BotFather with production HTTPS link.
- [ ] Remove/disable mock environment code.
- [ ] Smoke test on all platforms.
- [ ] Configure production monitoring.

### Phase 16: Post-Launch
- [ ] Monitor usage metrics (DAU, conversion, etc.).
- [ ] Iterate UI/UX based on feedback.
- [ ] Add incremental features (emoji status, homescreen).
- [ ] Expand localization (additional languages).
- [ ] Optimize monetization (subscriptions, gifts).
- [ ] Optimize performance (bundle size, TTI).
- [ ] Migrate to SecureStorage for sensitive data.

### Phase 17: Documentation
- [ ] Update README (deployment, env vars, BotFather config).
- [ ] Create SECURITY.md (validation, best practices).
- [ ] Document API endpoints.
- [ ] Write developer quickstart guide.
- [ ] Document architecture and key flows.
- [ ] Add contribution guidelines (if applicable).

### Phase 18: Advanced Features (Optional)
- [ ] Implement Ed25519 third-party endpoint.
- [ ] Add PWA support (offline, service worker).
- [ ] Integrate analytics (privacy-compliant).
- [ ] Implement advanced settings sync.
- [ ] Configure Mini App preview.
- [ ] Set up remote debugging tools.

---
## Key Best Practices & Critical Notes

### Development Environment
- **CRITICAL**: Always develop in TEST environment first (allows HTTP, direct IP, isolated experimentation).
- Avoid developing directly in production - prevents broken user experiences during experimentation.
- Use separate bots and tokens for test vs production environments.

### Mock Environment
- **Template uses `mockTelegramEnv` function** in `mockEnv.ts` to simulate Telegram environment for local dev.
- This allows development outside Telegram but tricks libraries (like `@telegram-apps/sdk`) into thinking they're in Telegram.
- **CRITICAL**: Do NOT ship mock environment code in production; conditionally disable by NODE_ENV.

### Package Manager
- **Template requires PNPM** - using npm or yarn will result in errors.
- Always use `pnpm install` and `pnpm run` commands.

### Launch Parameters
- **Persist initial `window.location.hash` immediately** on app load; user refreshes or client routing may overwrite it.
- Launch parameters are in hash fragment, NOT query string (except start parameter which is in query).
- Use `retrieveLaunchParams()` from `@telegram-apps/sdk` for reliable extraction.

### Init Data Validation
- **CRITICAL**: Always validate init data signature before trusting user identity.
- Use official packages: `@telegram-apps/init-data-node` (Node) or `github.com/telegram-mini-apps/init-data-golang` (Go).
- **Two validation methods**:
  - HMAC-SHA256 with bot token (standard, server-side only).
  - Ed25519 with Telegram public key (third-party, no bot token needed).
- **Always check expiration**: Reject `auth_date` older than acceptable window (e.g., 1 hour).
- Implement replay protection (store validated hashes or session IDs).

### Bot Token Security
- **CRITICAL**: Bot token must remain SECRET at all times.
- **NEVER** embed in client-side code, logs, or version control.
- Store in environment variables; access server-side only.
- Use different tokens for test and production.

### Start Parameter
- Transmitted in URL query string (NOT hash): `?startapp=ABC` or `?startattach=ABC`.
- Also available in init data as `start_param` after validation.
- **Restrictions**: Alphanumeric + underscore + hyphen only, max 512 chars (`/^[\w-]{0,512}$/`).
- Treat as untrusted input; validate server-side.
- Do NOT place secrets in start parameter; use opaque tokens.

### Theme & Safe Areas
- **Parse and apply theme BEFORE first paint** to prevent flash of unstyled content (FOUC).
- Bot API 7.0+ added 10+ new theme color fields - ensure all are mapped.
- Listen to dynamic theme changes via `themeChanged` event.
- Bot API 8.0+ added safe area insets for fullscreen mode - apply to avoid system UI overlap.

### Feature Detection
- Use `tgWebAppVersion` from launch parameters for feature gating.
- Use `isVersionAtLeast(version)` helper to check API availability.
- Gracefully degrade when features unavailable (e.g., older clients without SecureStorage).

### Storage Security
- **Three storage types** (different capabilities and security):
  - **CloudStorage** (Bot API 6.9+): Syncs across devices; NOT secure for secrets.
  - **DeviceStorage** (Bot API 9.0+): Local only; larger capacity; NOT encrypted.
  - **SecureStorage** (Bot API 9.0+): Local, encrypted, for sensitive data.
- **Always encrypt or tokenize** sensitive values before CloudStorage/DeviceStorage.
- Prefer SecureStorage for auth tokens, API keys, credentials.

### HTTPS Requirement
- **Production CRITICAL**: Mini Apps MUST use HTTPS (no HTTP or direct IP).
- Test environment allows HTTP for convenience.
- Set HSTS header on production domain.

### BotFather Configuration
- **Two attachment modes**:
  - **Menu Button** (`/setmenubutton`): Bottom-left button in bot chat.
  - **Direct Link** (`/myapps` > Edit link): Direct `https://t.me/{bot}/{app}` URL.
- Can configure both or just one depending on access pattern.

### Fullscreen Mode (Bot API 8.0+)
- Mini Apps can now go fullscreen (portrait/landscape).
- Use safe area insets to avoid system UI overlap.
- Lock orientation with `lockOrientation()` / `unlockOrientation()` if needed.

### Payments (Bot API 8.0+)
- Telegram Stars system supports subscriptions and gifts.
- Always validate payment receipts server-side.
- Store subscription/payment state in database.

### Debugging
- Use Telegram test environment for development iteration.
- Refer to Debugging documentation for webview inspection.
- Bot API 8.0+ added iOS debugging support.

### Multi-Platform Testing
- Test on ALL target platforms before production:
  - Android, iOS (mobile).
  - Web (web.telegram.org/k).
  - Desktop (Windows, macOS, Linux Telegram clients).
- Different platforms may have different capabilities (e.g., sensors on mobile only).

---
## Suggested Milestone Timeline (Indicative)

**Week 1: Foundation & Setup**
- Phases 0–2: Planning, environment setup, bot registration in test environment.
- Deliverable: Working local dev environment + test bot configured.

**Week 2: Core Integration**
- Phases 3–5: Launch parameters, init data validation, deep linking.
- Deliverable: Auth flow working; init data validated server-side.

**Week 3: UI & Theme**
- Phase 6–7: Theming, safe areas, buttons, interactions.
- Deliverable: Themed UI with working buttons and haptics.

**Week 4: Features & Storage**
- Phases 8–9: Additional features (TON, media, QR, etc.), storage implementation.
- Deliverable: Feature-complete app with persistent storage.

**Week 5: Backend & Security**
- Phases 10–12: Server API, payments (optional), security hardening, monitoring.
- Deliverable: Production-ready backend with security measures.

**Week 6: Testing & Deployment**
- Phases 13–15: Testing strategy, production deployment, initial optimization.
- Deliverable: App live in production with monitoring.

**Week 7+: Iteration & Documentation**
- Phases 16–18: Post-launch optimization, documentation, advanced features.
- Deliverable: Polished app with comprehensive docs; optional advanced features.

**Note**: Timeline is flexible and depends on:
- Team size and experience.
- Feature scope (minimal MVP vs full-featured app).
- Complexity of business logic and integrations.
- Testing thoroughness requirements.

---
## Reference Documentation Links

### Official Telegram Mini Apps Docs
- **Platform Overview**: https://docs.telegram-mini-apps.com/platform/about
- **Creating New App**: https://docs.telegram-mini-apps.com/platform/creating-new-app
- **Test Environment**: https://docs.telegram-mini-apps.com/platform/test-environment
- **Init Data**: https://docs.telegram-mini-apps.com/platform/init-data
- **Launch Parameters**: https://docs.telegram-mini-apps.com/platform/launch-parameters
- **Start Parameter**: https://docs.telegram-mini-apps.com/platform/start-parameter
- **Authorizing User**: https://docs.telegram-mini-apps.com/platform/authorizing-user
- **Methods**: https://docs.telegram-mini-apps.com/platform/methods
- **Events**: https://docs.telegram-mini-apps.com/platform/events
- **Debugging**: https://docs.telegram-mini-apps.com/platform/debugging

### Telegram Bot API
- **Web Apps**: https://core.telegram.org/bots/webapps
- **Bot API Updates**: https://core.telegram.org/bots/api
- **Bot API 8.0 Announcement** (Nov 17, 2024): https://telegram.org/blog/fullscreen-miniapps-and-more

### SDK & Packages
- **@telegram-apps/sdk**: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x
- **@telegram-apps/sdk-react**: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk-react
- **Init Data Node.js**: `@telegram-apps/init-data-node` (npm)
- **Init Data Golang**: `github.com/telegram-mini-apps/init-data-golang`
- **Telegram UI Components**: https://github.com/Telegram-Mini-Apps/TelegramUI

### Community & Support
- **Telegram Developers Community**: https://t.me/devs
- **GitHub (template)**: Next.js template repository
- **Documentation GitHub**: https://github.com/telegram-mini-apps/tma.js

---
## Next Steps

To begin implementation, start with **Phase 0** (Foundations & Planning) and work sequentially through phases. Each phase builds on previous phases, so order matters.

For specific implementation guidance on a phase, refer to:
1. This roadmap for overview and checklist.
2. Official Telegram docs (linked above) for detailed API specifications.
3. Template code examples in `nextjs-template/src` for patterns.
4. Bot API changelog for feature availability by version.

**Recommended starting point**: Complete Phases 0–2 in Week 1 to establish solid foundation before writing code.

---
End of roadmap.



========================================
Now please i wanna quicly see our next js based telegram mini app launched in telegram without any further complications. So please skip the phases and steps that are not strictly necessary for launching the mini app in telegram or that are optional that can be added later, And prepare a minimal but complete plan and checklist for me to follow to achieve this goal as fast as possible.

======================================
Okay but before executing that plan i wanna makesure on 2 things:
1. Read all the docs and necessary files and provide lists of all the core must-done points for a minimal viable telegram mini app launch
2. Double check our current codebase and all the phases/steps and implementations we have already done and:
    - Compare them against the must-done points list
    - Identify any missing implementations or incomplete steps
3. And finally double check the plan you provided me earlier for launching the mini app quickly and make sure it covers all the must-done points and missing implementations you identified in step 2.