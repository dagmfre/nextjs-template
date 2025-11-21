# Telegram Mini Apps (Fetched Snapshot)

> Source: https://core.telegram.org/bots/webapps  
> Fetched: 2025-11-17 (Content truncated where original fetch contained ellipses ... indicating omitted sections)  
> Note: Ellipses (...) appear where the fetch_webpage tool returned partial content blocks.

---

### Recent changes

#### July 3, 2025
Bot API 9.1

Added the method hideKeyboard to the class WebApp.

#### April 11, 2025
Bot API 9.0

Added the field DeviceStorage, allowing Mini Apps to use persistent local storage on the user's device.
Added the field SecureStorage, allowing Mini Apps to use a secure local storage on the user's device for sensitive data.

#### November 17, 2024
Bot API 8.0

This is the largest update in the history of Telegram mini apps – adding more than 10 new features and monetization options for developers. To read more about all these changes, check out this dedicated blog post: https://telegram.org/blog/fullscreen-miniapps-and-more.

Full-screen Mode
Mini Apps are now able to become full-screen in both portrait and landscape mode – allowing them to host more games, play widescreen media and support immersive user experiences.
Added the methods requestFullscreen and exitFullscreen to toggle full-screen mode.
Added the fields safeAreaInset and contentSafeAreaInset.
Added the fields isActive and isFullscreen to the class WebApp.
Added the events activated, deactivated, safeAreaChanged, contentSafeAreaChanged, fullscreenChanged and fullscreenFailed.

Homescreen Shortcuts
Mini Apps can now be accessed via direct shortcuts added to the home screen of mobile devices.
Added the method addToHomeScreen.
Added the method checkHomeScreenStatus.
Added the events homeScreenAdded and homeScreenChecked.

Emoji Status
Mini Apps can prompt users to set their emoji status or request access to sync automatically.
Added the method setEmojiStatus.
Added the method requestEmojiStatusAccess.
Added the events emojiStatusSet, emojiStatusFailed and emojiStatusAccessRequested.

Media Sharing and File Downloads
Users can now share media directly from Mini Apps or as a story.
Added the method shareMessage.
Added the method downloadFile.
Added the events shareMessageSent, shareMessageFailed and fileDownloadRequested.

Geolocation Access
Added the field LocationManager.
Added the events locationManagerUpdated and locationRequested.

Device Motion Tracking
Added isOrientationLocked, Accelerometer, DeviceOrientation, Gyroscope.
Added lockOrientation, unlockOrientation.
Added events for accelerometerStarted/Stopped/Changed/Failed, deviceOrientationStarted/Stopped/Changed/Failed, gyroscopeStarted/Stopped/Changed/Failed.

Subscription Plans and Gifts for Telegram Stars
Mini Apps now support paid subscriptions powered by Telegram Stars. They can send gifts to users. See Bot API changelog November 17, 2024.

Loading Screen Customization
Mini Apps can customize loading screen (icon, colors).

Hardware-specific Optimizations
Android Mini Apps can receive basic device performance info.

General
photo_url now available in WebAppUser.
Third parties can validate data without knowing bot token (signature field). Debugging expanded (iOS supported).

#### September 6, 2024
Bot API 7.10

Added SecondaryButton to WebApp.
Event secondaryButtonClicked.
Renamed MainButton to BottomButton.
Added bottomBarColor and setBottomBarColor to WebApp.
Added bottom_bar_bg_color to ThemeParams.

#### July 31, 2024
Bot API 7.8

Added option to set a Main Mini App preview & direct launch.
Added shareToStory.

#### July 7, 2024
Bot API 7.7

Added isVerticalSwipesEnabled, enableVerticalSwipes, disableVerticalSwipes.
Added scanQrPopupClosed.

#### July 1, 2024
Bot API 7.6

Added section_separator_color to ThemeParams.
Changed default opening mode for Direct Link Mini Apps.

#### March 31, 2024
Bot API 7.2

Added BiometricManager.

#### December 29, 2023
Bot API 7.0

Added SettingsButton.
Added header_bg_color, accent_text_color, section_bg_color, section_header_text_color, subtitle_text_color, destructive_text_color.
Mini Apps no longer close on openTelegramLink.

#### September 22, 2023
Bot API 6.9

Added CloudStorage.
Added requestWriteAccess and requestContact.
Added added_to_attachment_menu and allows_write_to_pm to WebAppUser.
Events writeAccessRequested, contactRequested.
setHeaderColor improvements.

#### April 21, 2023
Bot API 6.7

Launch from inline query results and direct link.
Added switchInlineQuery.

#### December 30, 2022
Bot API 6.4

Added platform, options to openLink; showScanQrPopup, closeScanQrPopup, readTextFromClipboard.
Events qrTextReceived, clipboardTextReceived.

#### August 12, 2022
Bot API 6.2

Added isClosingConfirmationEnabled, enableClosingConfirmation, disableClosingConfirmation, showPopup, showAlert, showConfirm.
Added is_premium to WebAppUser.
Event popupClosed.

#### June 20, 2022
Bot API 6.1

Attachment menu in group/supergroup/channel.
Added version, headerColor, backgroundColor, BackButton, HapticFeedback, isVersionAtLeast, setHeaderColor, setBackgroundColor, openLink, openTelegramLink, openInvoice.
Added secondary_bg_color to ThemeParams.
Added offClick to MainButton.
Added chat, can_send_after to WebAppInitData.
Events backButtonClicked, settingsButtonClicked, invoiceClosed.

---

## Designing Mini Apps

### Color Schemes
Mini Apps receive current color theme realtime (Day/Night, custom themes). Adjust UI dynamically.

### Design Guidelines
- Responsive, mobile-first.
- Mirror Telegram UI interaction style.
- Smooth animations (~60fps).
- Accessible labels for inputs/images.
- Use dynamic theme colors from API.
- Respect safe area & content safe area (especially fullscreen).
- Optimize for low-performance Android devices via User-Agent performance class.

---

## Implementing Mini Apps

### Keyboard Button Mini Apps
TL;DR: web_app KeyboardButton can send data via Telegram.WebApp.sendData as service message without external server.
Use custom keyboards or inline buttons; for simple data capture open Mini App from `KeyboardButton` (web_app). Use `sendData` to transmit payload (<=4096 bytes) and close app. Good for custom data inputs & reusable components.

### Inline Button Mini Apps
TL;DR: web_app InlineKeyboardButton opens personalized interface, returns basic user info & `query_id` for sending messages back via answerWebAppQuery.
Good for fully-fledged services; send inline messages back to chat through bot.

### Launching Mini Apps from the Menu Button
TL;DR: Replace default bot menu button with Mini App launch (Bot API 6.0). Configure via BotFather or setChatMenuButton. Behavior similar to inline button launches.

### Launching the Main Mini App
TL;DR: Set a Main Mini App to get Launch app button & media previews on bot profile via BotFather. Supports startapp parameter & chat context tracking (chat_type, chat_instance) for multiplayer/cooperative features. Mode can be `compact` for half-height default. Good for broad integrations and collaborative features.

### Inline Mode Mini Apps
TL;DR: Use InlineQueryResultsButton with type web_app to open Mini App from inline mode; after interaction call switchInlineQuery to return to inline query. No direct chat access; user selects results manually.

### Direct Link Mini Apps
TL;DR: Open a Mini App from direct link in any chat; supports startapp parameter and chat context (chat_type, chat_instance). Default fullscreen since Bot API 7.6 unless `mode=compact`. No direct message sending; must redirect to inline mode.

Examples: `https://t.me/botusername/appname`, `...?startapp=command`, `...?startapp=command&mode=compact`.

### Launching Mini Apps from the Attachment Menu
TL;DR: Bots can be added to attachment menu (major advertisers in prod; anyone on test server). Launch gives user/chat context and `query_id` for answerWebAppQuery. Configure via `/setattach` on test BotFather. Settings item can trigger `settingsButtonClicked`.

Seven Launch Methods Summary: main profile button, keyboard button, inline button, menu button, inline mode, direct link, attachment menu.

---

## Initializing Mini Apps

### ThemeParams
(Partial table; fields available as CSS variables):
- bg_color
- text_color
- hint_color
- link_color
- button_color
- button_text_color
- secondary_bg_color (6.1+)
- header_bg_color (7.0+)
- bottom_bar_bg_color (7.10+)
- accent_text_color (7.0+)
- section_bg_color (7.0+)
- section_header_text_color (7.0+)
- section_separator_color (7.6+)
- subtitle_text_color (7.0+)
- destructive_text_color (7.0+)

### StoryShareParams / StoryWidgetLink
Parameters for native story editor and optional widget link.

### ScanQrPopupParams / PopupParams / PopupButton / EmojiStatusParams / DownloadFileParams
Native popup and QR code scanning configuration objects, emoji status settings, file download parameters (ensure proper headers for consistent behavior: Content-Disposition & Access-Control-Allow-Origin).

### SafeAreaInset / ContentSafeAreaInset
Insets exposed as numeric top/bottom/left/right, also CSS variables for layout safety.

### BackButton
Methods: onClick, offClick, show, hide. Chainable.

### BottomButton (Main & Secondary)
Fields: type, text, color, textColor, isVisible, isActive, hasShineEffect, position (secondary), isProgressVisible.
Methods: setText, onClick, offClick, show, hide, enable, disable, showProgress(leaveActive), hideProgress, setParams.

### SettingsButton
Visibility & event handler control.

### HapticFeedback
Methods: impactOccurred(style), notificationOccurred(type), selectionChanged().

### CloudStorage
Up to 1024 items; methods setItem/getItem/getItems/removeItem/removeItems/getKeys.

### BiometricManager & Related Params
Initialization, requestAccess, authenticate, updateBiometricToken, openSettings.

### Accelerometer / DeviceOrientation / Gyroscope (+ StartParams)
Start/stop tracking with optional refresh_rate; orientation absolute flag; data axes values.

### LocationManager / LocationData
Init, request access, open settings, getLocation (returns latitude, longitude, etc.).

### DeviceStorage (9.0+) / SecureStorage (9.0+)
Local persistent (5 MB) and secure encrypted (10 items) storage APIs: setItem, getItem, removeItem, clear, restoreItem (secure), etc.

### WebAppInitData / WebAppUser / WebAppChat
Session fields: query_id, user, receiver, chat, chat_type, chat_instance, start_param, can_send_after, auth_date, hash, signature.
User fields: id, is_bot, first_name, last_name, username, language_code, is_premium, added_to_attachment_menu, allows_write_to_pm, photo_url.
Chat fields: id, type, title, username, photo_url.

### Validating Data
Use HMAC-SHA256 with secret_key = HMAC_SHA256(bot_token, "WebAppData") and compare hash. Check auth_date for freshness.

### Validating Data for Third-Party Use (NEW)
Third party validation with signature (Ed25519). Data-check-string includes `bot_id:WebAppData` prefix + sorted fields excluding hash/signature. Provided public keys:
- Test: 40055058a4ee38156a06562e52eece92a771bcd8346a8c4615cb7376eddf72ec
- Production: e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d

### Events Available for Mini Apps (Partial List)
Activation: activated, deactivated.
UI/theme: themeChanged, viewportChanged, safeAreaChanged, contentSafeAreaChanged.
Buttons: mainButtonClicked, secondaryButtonClicked, backButtonClicked, settingsButtonClicked.
Payment: invoiceClosed.
Popups/scanner: popupClosed, qrTextReceived, scanQrPopupClosed.
Clipboard: clipboardTextReceived.
Permissions: writeAccessRequested, contactRequested.
Biometrics: biometricManagerUpdated, biometricAuthRequested, biometricTokenUpdated.
Fullscreen & home screen: fullscreenChanged, fullscreenFailed, homeScreenAdded, homeScreenChecked.
Sensors: accelerometerStarted/Stopped/Changed/Failed, deviceOrientationStarted/Stopped/Changed/Failed, gyroscopeStarted/Stopped/Changed/Failed.
Location: locationManagerUpdated, locationRequested.
Sharing & emoji: shareMessageSent, shareMessageFailed, emojiStatusSet, emojiStatusFailed, emojiStatusAccessRequested.
File: fileDownloadRequested.

### Adding Bots to the Attachment Menu
Link formats: `https://t.me/botusername?startattach` (optional startattach value). Variants with `attach=botusername` or `choose=users+groups+...`. Passes start_param via tgWebAppStartParam.

### Additional Data in User-Agent (Android)
Telegram-Android/{app_version} (...; performance_class LOW|AVERAGE|HIGH). Use for performance optimization.

### Script Initialization
Include `<script src="https://telegram.org/js/telegram-web-app.js?59"></script>` early. `window.Telegram.WebApp` fields include initData, initDataUnsafe, version, platform, colorScheme, themeParams, isActive, isExpanded, viewportHeight, viewportStableHeight, headerColor, backgroundColor, bottomBarColor, isClosingConfirmationEnabled, isVerticalSwipesEnabled, isFullscreen, isOrientationLocked, safeAreaInset, contentSafeAreaInset, BackButton, MainButton, SecondaryButton, SettingsButton, HapticFeedback, CloudStorage, BiometricManager, Accelerometer, DeviceOrientation, Gyroscope, LocationManager, DeviceStorage, SecureStorage.

Core methods include: isVersionAtLeast, setHeaderColor, setBackgroundColor, setBottomBarColor, enableClosingConfirmation, disableClosingConfirmation, enableVerticalSwipes, disableVerticalSwipes, requestFullscreen, exitFullscreen, lockOrientation, unlockOrientation, addToHomeScreen, checkHomeScreenStatus, onEvent, offEvent, sendData, switchInlineQuery, openLink, openTelegramLink, openInvoice, shareToStory, shareMessage, setEmojiStatus, requestEmojiStatusAccess, downloadFile, hideKeyboard, showPopup, showAlert, showConfirm, showScanQrPopup, closeScanQrPopup, readTextFromClipboard, requestWriteAccess, requestContact, ready, expand, close.

(Repeat of object definitions condensed where original tool output contained multiple repeated blocks.)

---

## Testing Mini Apps

### Using bots in the test environment
Login procedures for iOS, Desktop, macOS; test server endpoints use `/test/` in URL. HTTP without TLS allowed.

### Debug Mode for Mini Apps
Instructions for enabling inspection on iOS (Safari Develop menu), Android (chrome://inspect), Telegram Desktop beta (Windows/Linux), macOS beta (Inspect Element).

---

## Overview
Mini Apps: JavaScript interfaces inside Telegram with seamless auth, payments, push notifications. Try @DurgerKingBot sample.

Sections: Recent changes, Designing, Implementing, Initializing, Testing.

Footer navigation (FAQ, Apps, API, etc.) omitted for brevity.

---

End of fetched snapshot.
