[Skip to content](https://docs.telegram-mini-apps.com/platform/events#VPContent)

[![](https://docs.telegram-mini-apps.com/logo.db0268ac.png)Telegram Mini Apps](https://docs.telegram-mini-apps.com/)

Search`` `K`

Main Navigation [Home](https://docs.telegram-mini-apps.com/) [Platform](https://docs.telegram-mini-apps.com/platform/about) [Packages](https://docs.telegram-mini-apps.com/packages/tma-js-signals)

[github](https://github.com/telegram-mini-apps)

Appearance

[github](https://github.com/telegram-mini-apps)

Menu

On this page

Sidebar Navigation

## Introduction

[About Platform](https://docs.telegram-mini-apps.com/platform/about)

## Functional Features

[Closing Behavior](https://docs.telegram-mini-apps.com/platform/closing-behavior)

[Swipe Behavior](https://docs.telegram-mini-apps.com/platform/swipe-behavior)

[Haptic Feedback](https://docs.telegram-mini-apps.com/platform/haptic-feedback)

## Apps Communication

[Flow Definition](https://docs.telegram-mini-apps.com/platform/apps-communication)

[Methods](https://docs.telegram-mini-apps.com/platform/methods)

[Events](https://docs.telegram-mini-apps.com/platform/events)

## Launch Parameters

[About](https://docs.telegram-mini-apps.com/platform/launch-parameters)

[Start Parameter](https://docs.telegram-mini-apps.com/platform/start-parameter)

[Init Data](https://docs.telegram-mini-apps.com/platform/init-data)

## Development

[Debugging](https://docs.telegram-mini-apps.com/platform/debugging)

[Test Environment](https://docs.telegram-mini-apps.com/platform/test-environment)

## UI

[Back Button](https://docs.telegram-mini-apps.com/platform/back-button)

[Main Button](https://docs.telegram-mini-apps.com/platform/main-button)

[Popup](https://docs.telegram-mini-apps.com/platform/popup)

[Settings Button](https://docs.telegram-mini-apps.com/platform/settings-button)

[Theming](https://docs.telegram-mini-apps.com/platform/theming)

[Viewport](https://docs.telegram-mini-apps.com/platform/viewport)

## Guides

[Authorizing User](https://docs.telegram-mini-apps.com/platform/authorizing-user)

[Creating New App](https://docs.telegram-mini-apps.com/platform/creating-new-app)

[Getting App Link](https://docs.telegram-mini-apps.com/platform/getting-app-link)

[Sticky App](https://docs.telegram-mini-apps.com/platform/sticky-app)

[Migrating from VK](https://docs.telegram-mini-apps.com/platform/migrating-from-vk)

On this page

- [Web](https://docs.telegram-mini-apps.com/platform/events#web "Web")
- [Desktop, Mobile and Windows Phone](https://docs.telegram-mini-apps.com/platform/events#desktop-mobile-and-windows-phone "Desktop, Mobile and Windows Phone")
- [Listening to Events](https://docs.telegram-mini-apps.com/platform/events#listening-to-events "Listening to Events")
- [Available Events](https://docs.telegram-mini-apps.com/platform/events#available-events "Available Events")
  - [accelerometer\_changed](https://docs.telegram-mini-apps.com/platform/events#accelerometer-changed "accelerometer_changed")
  - [accelerometer\_failed](https://docs.telegram-mini-apps.com/platform/events#accelerometer-failed "accelerometer_failed")
  - [accelerometer\_started](https://docs.telegram-mini-apps.com/platform/events#accelerometer-started "accelerometer_started")
  - [accelerometer\_stopped](https://docs.telegram-mini-apps.com/platform/events#accelerometer-stopped "accelerometer_stopped")
  - [back\_button\_pressed](https://docs.telegram-mini-apps.com/platform/events#back-button-pressed "back_button_pressed")
  - [biometry\_auth\_requested](https://docs.telegram-mini-apps.com/platform/events#biometry-auth-requested "biometry_auth_requested")
  - [biometry\_info\_received](https://docs.telegram-mini-apps.com/platform/events#biometry-info-received "biometry_info_received")
  - [biometry\_token\_updated](https://docs.telegram-mini-apps.com/platform/events#biometry-token-updated "biometry_token_updated")
  - [clipboard\_text\_received](https://docs.telegram-mini-apps.com/platform/events#clipboard-text-received "clipboard_text_received")
  - [content\_safe\_area\_changed](https://docs.telegram-mini-apps.com/platform/events#content-safe-area-changed "content_safe_area_changed")
  - [custom\_method\_invoked](https://docs.telegram-mini-apps.com/platform/events#custom-method-invoked "custom_method_invoked")
  - [device\_orientation\_changed](https://docs.telegram-mini-apps.com/platform/events#device-orientation-changed "device_orientation_changed")
  - [device\_orientation\_failed](https://docs.telegram-mini-apps.com/platform/events#device-orientation-failed "device_orientation_failed")
  - [device\_orientation\_started](https://docs.telegram-mini-apps.com/platform/events#device-orientation-started "device_orientation_started")
  - [device\_orientation\_stopped](https://docs.telegram-mini-apps.com/platform/events#device-orientation-stopped "device_orientation_stopped")
  - [device\_storage\_cleared](https://docs.telegram-mini-apps.com/platform/events#device-storage-cleared "device_storage_cleared")
  - [device\_storage\_failed](https://docs.telegram-mini-apps.com/platform/events#device-storage-failed "device_storage_failed")
  - [device\_storage\_key\_received](https://docs.telegram-mini-apps.com/platform/events#device-storage-key-received "device_storage_key_received")
  - [device\_storage\_key\_saved](https://docs.telegram-mini-apps.com/platform/events#device-storage-key-saved "device_storage_key_saved")
  - [emoji\_status\_access\_requested](https://docs.telegram-mini-apps.com/platform/events#emoji-status-access-requested "emoji_status_access_requested")
  - [emoji\_status\_failed](https://docs.telegram-mini-apps.com/platform/events#emoji-status-failed "emoji_status_failed")
  - [emoji\_status\_set](https://docs.telegram-mini-apps.com/platform/events#emoji-status-set "emoji_status_set")
  - [file\_download\_requested](https://docs.telegram-mini-apps.com/platform/events#file-download-requested "file_download_requested")
  - [fullscreen\_changed](https://docs.telegram-mini-apps.com/platform/events#fullscreen-changed "fullscreen_changed")
  - [fullscreen\_failed](https://docs.telegram-mini-apps.com/platform/events#fullscreen-failed "fullscreen_failed")
  - [gyroscope\_changed](https://docs.telegram-mini-apps.com/platform/events#gyroscope-changed "gyroscope_changed")
  - [gyroscope\_failed](https://docs.telegram-mini-apps.com/platform/events#gyroscope-failed "gyroscope_failed")
  - [gyroscope\_started](https://docs.telegram-mini-apps.com/platform/events#gyroscope-started "gyroscope_started")
  - [gyroscope\_stopped](https://docs.telegram-mini-apps.com/platform/events#gyroscope-stopped "gyroscope_stopped")
  - [home\_screen\_added](https://docs.telegram-mini-apps.com/platform/events#home-screen-added "home_screen_added")
  - [home\_screen\_checked](https://docs.telegram-mini-apps.com/platform/events#home-screen-checked "home_screen_checked")
  - [home\_screen\_failed](https://docs.telegram-mini-apps.com/platform/events#home-screen-failed "home_screen_failed")
  - [invoice\_closed](https://docs.telegram-mini-apps.com/platform/events#invoice-closed "invoice_closed")
  - [location\_checked](https://docs.telegram-mini-apps.com/platform/events#location-checked "location_checked")
  - [location\_requested](https://docs.telegram-mini-apps.com/platform/events#location-requested "location_requested")
  - [main\_button\_pressed](https://docs.telegram-mini-apps.com/platform/events#main-button-pressed "main_button_pressed")
  - [phone\_requested](https://docs.telegram-mini-apps.com/platform/events#phone-requested "phone_requested")
  - [popup\_closed](https://docs.telegram-mini-apps.com/platform/events#popup-closed "popup_closed")
  - [prepared\_message\_failed](https://docs.telegram-mini-apps.com/platform/events#prepared-message-failed "prepared_message_failed")
  - [prepared\_message\_sent](https://docs.telegram-mini-apps.com/platform/events#prepared-message-sent "prepared_message_sent")
  - [qr\_text\_received](https://docs.telegram-mini-apps.com/platform/events#qr-text-received "qr_text_received")
  - [reload\_iframe](https://docs.telegram-mini-apps.com/platform/events#reload-iframe "reload_iframe")
  - [safe\_area\_changed](https://docs.telegram-mini-apps.com/platform/events#safe-area-changed "safe_area_changed")
  - [scan\_qr\_popup\_closed](https://docs.telegram-mini-apps.com/platform/events#scan-qr-popup-closed "scan_qr_popup_closed")
  - [secondary\_button\_pressed](https://docs.telegram-mini-apps.com/platform/events#secondary-button-pressed "secondary_button_pressed")
  - [secure\_storage\_cleared](https://docs.telegram-mini-apps.com/platform/events#secure-storage-cleared "secure_storage_cleared")
  - [secure\_storage\_failed](https://docs.telegram-mini-apps.com/platform/events#secure-storage-failed "secure_storage_failed")
  - [secure\_storage\_key\_received](https://docs.telegram-mini-apps.com/platform/events#secure-storage-key-received "secure_storage_key_received")
  - [secure\_storage\_key\_restored](https://docs.telegram-mini-apps.com/platform/events#secure-storage-key-restored "secure_storage_key_restored")
  - [secure\_storage\_key\_saved](https://docs.telegram-mini-apps.com/platform/events#secure-storage-key-saved "secure_storage_key_saved")
  - [set\_custom\_style](https://docs.telegram-mini-apps.com/platform/events#set-custom-style "set_custom_style")
  - [settings\_button\_pressed](https://docs.telegram-mini-apps.com/platform/events#settings-button-pressed "settings_button_pressed")
  - [theme\_changed](https://docs.telegram-mini-apps.com/platform/events#theme-changed "theme_changed")
  - [viewport\_changed](https://docs.telegram-mini-apps.com/platform/events#viewport-changed "viewport_changed")
  - [visibility\_changed](https://docs.telegram-mini-apps.com/platform/events#visibility-changed "visibility_changed")
  - [write\_access\_requested](https://docs.telegram-mini-apps.com/platform/events#write-access-requested "write_access_requested")

# Events [​](https://docs.telegram-mini-apps.com/platform/events\#events)

Events are signals, sent from Telegram native application in case, when some external action was done. Like methods, each event has its unique name and parameters.

## Web [​](https://docs.telegram-mini-apps.com/platform/events\#web)

As mentioned before, the web version uses a standard way of communication between iframes. It means, the parent iframe is able to send events through `window.postMessage` function. To handle this type of message, it is enough to add `message` event listener on the global `window` object:

typescript

```
window.addEventListener('message', ...);
```

The native application will send an event with `data: string` which represents a JSON object converted to string. This object has the same interface as we defined in the [Methods](https://docs.telegram-mini-apps.com/platform/methods#web) section:

typescript

```
interface MessageJSON {
  eventType: string;
  eventData: any;
}
```

Then, lets imagine how we could process an event from Telegram application:

typescript

```
window.addEventListener('message', ({ data }) => {
  const { eventType, eventData } = JSON.parse(data);
  console.log(eventType, eventData);
});
```

WARNING

In this code, we assumed, that the `message` event is sent only by the native application which is not always true in real applications. Additionally, we didn't check if `data` is really of type `string`. Don't forget to check each type and appropriately process incoming events.

## Desktop, Mobile and Windows Phone [​](https://docs.telegram-mini-apps.com/platform/events\#desktop-mobile-and-windows-phone)

Desktop, mobile, and Windows Phone versions of Telegram don’t use the method, described in the previous section. They do it in a bit unusual way. The first thing developer should know, is in case, when Telegram needs to emit an event, it will insert JavaScript code, which calls a globally defined function.

Here is an example:

typescript

```
window.Telegram.WebView.receiveEvent('popup_closed', {
  button_id: 'cancel'
});
```

Path to this function depends on platform:

- `window.TelegramGameProxy.receiveEvent` \- Telegram Desktop;
- `window.Telegram.WebView.receiveEvent` \- Telegram for iOS and Android;
- `window.TelegramGameProxy_receiveEvent` \- Windows Phone

All of these functions have the same signature:

typescript

```
type ReceiveEvent = (eventType: string, eventData: unknown) => void;
```

So, the solution is rather simple. To handle incoming events we should create a function of this type and assign it to all 3 paths.

## Listening to Events [​](https://docs.telegram-mini-apps.com/platform/events\#listening-to-events)

Handling all possible environments for a developer's application can be challenging. To simplify this process, the community developed the [@telegram-apps/sdk](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x) package, which greatly eases integration.

Here's how to use it:

ts

```
import { on } from '@telegram-apps/sdk';

// Start listening to "viewport_changed" event. Returned value
// is a function, which removes this event listener.
const removeListener = on('viewport_changed', payload => {
  console.log('Viewport changed:', payload);
});

// Remove this event listener.
removeListener();
```

You can learn more about calling methods in the package's [documentation](https://docs.telegram-mini-apps.com/packages/telegram-apps-bridge/events#listening-to-events).

## Available Events [​](https://docs.telegram-mini-apps.com/platform/events\#available-events)

This section contains the list of events, sent from Telegram: their names, description, and parameters. Section title means minimal version, from which events inside the section could be sent.

### `accelerometer_changed` [​](https://docs.telegram-mini-apps.com/platform/events\#accelerometer-changed)

Available since: **v8.0**

Accelerometer data changed.

| Field | Type | Description |
| --- | --- | --- |
| x | `number` | The current acceleration in the X-axis, measured in m/s². |
| y | `number` | The current acceleration in the Y-axis, measured in m/s². |
| z | `number` | The current acceleration in the Z-axis, measured in m/s². |

### `accelerometer_failed` [​](https://docs.telegram-mini-apps.com/platform/events\#accelerometer-failed)

Available since: **v8.0**

Failed to start accelerometer data tracking.

| Field | Type | Description |
| --- | --- | --- |
| error | `string` | Occurred error. |

### `accelerometer_started` [​](https://docs.telegram-mini-apps.com/platform/events\#accelerometer-started)

Available since: **v8.0**

Accelerometer data tracking started.

### `accelerometer_stopped` [​](https://docs.telegram-mini-apps.com/platform/events\#accelerometer-stopped)

Available since: **v8.0**

Accelerometer data tracking stopped.

### `back_button_pressed` [​](https://docs.telegram-mini-apps.com/platform/events\#back-button-pressed)

Available since: **v6.1**

User clicked the [Back Button](https://docs.telegram-mini-apps.com/platform/back-button).

### `biometry_auth_requested` [​](https://docs.telegram-mini-apps.com/platform/events\#biometry-auth-requested)

Available since: **v7.2**

Biometry authentication request completed. This event usually occurs in a response to the [web\_app\_request\_auth](https://docs.telegram-mini-apps.com/platform/methods#web-app-biometry-request-auth) method.

If authentication was successful, the event contains a token from the local secure storage.

| Field | Type | Description |
| --- | --- | --- |
| status | `string` | Authentication status. Possible values: `failed` or `authorized`. |
| token | `string` | _Optional_. Token from the local secure storage saved previously. Passed only if `status` is `authorized`. |

### `biometry_info_received` [​](https://docs.telegram-mini-apps.com/platform/events\#biometry-info-received)

Available since: **v7.2**

Biometry settings were received.

| Field | Type | Description |
| --- | --- | --- |
| available | `boolean` | Shows whether biometry is available. |
| access\_requested | `boolean` | Shows whether permission to use biometrics has been requested. |
| access\_granted | `boolean` | Shows whether permission to use biometrics has been granted. |
| device\_id | `string` | A unique device identifier that can be used to match the token to the device. |
| token\_saved | `boolean` | Show whether local secure storage contains previously saved token. |
| type | `string` | The type of biometrics currently available on the device. Possible values: `face` or `finger`. |

### `biometry_token_updated` [​](https://docs.telegram-mini-apps.com/platform/events\#biometry-token-updated)

Available since: **v7.2**

Biometry token was updated.

| Field | Type | Description |
| --- | --- | --- |
| status | `string` | Update status. Possible values: `updated` or `removed`. |

### `clipboard_text_received` [​](https://docs.telegram-mini-apps.com/platform/events\#clipboard-text-received)

Available since: **v6.4**

Telegram application attempted to extract text from clipboard.

| Field | Type | Description |
| --- | --- | --- |
| req\_id | `string` | Passed during the [web\_app\_read\_text\_from\_clipboard](https://docs.telegram-mini-apps.com/platform/methods#web-app-read-text-from-clipboard) method invocation `req_id` value. |
| data | `string` or `null` | _Optional_. Data extracted from the clipboard. The returned value will have the type `string` only in the case, application has access to the clipboard. |

### `content_safe_area_changed` [​](https://docs.telegram-mini-apps.com/platform/events\#content-safe-area-changed)

Available since: **v8.0**

This event occurs whenever the content safe area changes in the user's Telegram app. For instance, when a user switches to landscape mode.

The **safe area** ensures that content does not overlap with Telegram's UI elements.

The **content safe area** is a subset of the device's safe area, specifically covering Telegram's UI.

| Field | Type | Description |
| --- | --- | --- |
| top | `number` | The top inset in pixels, representing the space to avoid at the top of the content area |
| bottom | `number` | The bottom inset in pixels, representing the space to avoid at the bottom of the content area |
| left | `number` | The left inset in pixels, representing the space to avoid on the left side of the content area |
| right | `number` | The right inset in pixels, representing the space to avoid on the right side of the content area |

### `custom_method_invoked` [​](https://docs.telegram-mini-apps.com/platform/events\#custom-method-invoked)

Available since: **v6.9**

Custom method invocation completed.

| Field | Type | Description |
| --- | --- | --- |
| req\_id | `string` | Unique identifier of this invocation. |
| result | `unknown` | _Optional_. Method invocation result. |
| error | `string` | _Optional_. Method invocation error code. |

### `device_orientation_changed` [​](https://docs.telegram-mini-apps.com/platform/events\#device-orientation-changed)

Available since: **v8.0**

Device orientation data changed.

| Field | Type | Description |
| --- | --- | --- |
| absolute | `boolean` | _Optional_. A boolean that indicates whether the device is providing orientation data in absolute values. |
| alpha | `number` | The rotation around the Z-axis, measured in radians. |
| beta | `number` | The rotation around the X-axis, measured in radians. |
| gamma | `number` | The rotation around the Y-axis, measured in radians. |

### `device_orientation_failed` [​](https://docs.telegram-mini-apps.com/platform/events\#device-orientation-failed)

Available since: **v8.0**

Device orientation data tracking failed to start.

| Field | Type | Description |
| --- | --- | --- |
| error | `string` | Occurred error. |

### `device_orientation_started` [​](https://docs.telegram-mini-apps.com/platform/events\#device-orientation-started)

Available since: **v8.0**

Device orientation data tracking started.

### `device_orientation_stopped` [​](https://docs.telegram-mini-apps.com/platform/events\#device-orientation-stopped)

Available since: **v8.0**

Device orientation data tracking stopped.

### `device_storage_cleared` [​](https://docs.telegram-mini-apps.com/platform/events\#device-storage-cleared)

Available since: **v9.0**

Device's local storage was cleared.

| Field | Type | Description |
| --- | --- | --- |
| req\_id | `string` | A unique request identifier. |

### `device_storage_failed` [​](https://docs.telegram-mini-apps.com/platform/events\#device-storage-failed)

Available since: **v9.0**

An error occurred while working with the device's local storage.

| Field | Type | Description |
| --- | --- | --- |
| req\_id | `string` | A unique request identifier. |
| error | `string` | An occurred error. |

### `device_storage_key_received` [​](https://docs.telegram-mini-apps.com/platform/events\#device-storage-key-received)

Available since: **v9.0**

A value from the device's local storage was retrieved.

| Field | Type | Description |
| --- | --- | --- |
| req\_id | `string` | A unique request identifier. |
| value | `string | null` | A retrieved value. |

### `device_storage_key_saved` [​](https://docs.telegram-mini-apps.com/platform/events\#device-storage-key-saved)

Available since: **v9.0**

A value in the device's local storage was saved.

| Field | Type | Description |
| --- | --- | --- |
| req\_id | `string` | A unique request identifier. |

### `emoji_status_access_requested` [​](https://docs.telegram-mini-apps.com/platform/events\#emoji-status-access-requested)

Available since: **v8.0**

Access to set custom emoji status was requested.

| Field | Type | Description |
| --- | --- | --- |
| status | `string` | Request status. Possible values: `allowed` or `cancelled`. |

### `emoji_status_failed` [​](https://docs.telegram-mini-apps.com/platform/events\#emoji-status-failed)

Available since: **v8.0**

Failed to set custom emoji status.

| Field | Type | Description |
| --- | --- | --- |
| error | `string` | Emoji set failure reason. Possible values: `SUGGESTED_EMOJI_INVALID` or `USER_DECLINED` |

### `emoji_status_set` [​](https://docs.telegram-mini-apps.com/platform/events\#emoji-status-set)

Available since: **v8.0**

Custom emoji status set.

### `file_download_requested` [​](https://docs.telegram-mini-apps.com/platform/events\#file-download-requested)

Available since: **v8.0**

| Field | Type | Description |
| --- | --- | --- |
| status | `string` | Request status. Set to `downloading` if a file is being loaded. |

### `fullscreen_changed` [​](https://docs.telegram-mini-apps.com/platform/events\#fullscreen-changed)

Available since: **v8.0**

Occurs whenever the mini app enters or exits the fullscreen mode.

| Field | Type | Description |
| --- | --- | --- |
| is\_fullscreen | `boolean` | Indicates if the application is currently in fullscreen mode. |

### `fullscreen_failed` [​](https://docs.telegram-mini-apps.com/platform/events\#fullscreen-failed)

Available since: **v8.0**

Occurs whenever the mini app enters or exits the fullscreen mode.

| Field | Type | Description |
| --- | --- | --- |
| error | `string` | Fullscreen mode status error. Possible values: `UNSUPPORTED` or `ALREADY_FULLSCREEN`. |

### `gyroscope_changed` [​](https://docs.telegram-mini-apps.com/platform/events\#gyroscope-changed)

Available since: **v8.0**

Gyroscope data changed.

| Field | Type | Description |
| --- | --- | --- |
| x | `number` | The current rotation rate around the X-axis, measured in rad/s. |
| y | `number` | The current rotation rate around the Y-axis, measured in rad/s. |
| z | `number` | The current rotation rate around the Z-axis, measured in rad/s. |

### `gyroscope_failed` [​](https://docs.telegram-mini-apps.com/platform/events\#gyroscope-failed)

Available since: **v8.0**

Gyroscope data tracking failed to run.

| Field | Type | Description |
| --- | --- | --- |
| error | `string` | Occurred error. |

### `gyroscope_started` [​](https://docs.telegram-mini-apps.com/platform/events\#gyroscope-started)

Available since: **v8.0**

Gyroscope data tracking started.

### `gyroscope_stopped` [​](https://docs.telegram-mini-apps.com/platform/events\#gyroscope-stopped)

Available since: **v8.0**

Gyroscope data tracking stopped.

### `home_screen_added` [​](https://docs.telegram-mini-apps.com/platform/events\#home-screen-added)

Available since: **v8.0**

The mini application was added to the device's home screen.

### `home_screen_checked` [​](https://docs.telegram-mini-apps.com/platform/events\#home-screen-checked)

Available since: **v8.0**

The status of the mini application being added to the home screen has been checked.

| Field | Type | Description |
| --- | --- | --- |
| status | `string` | The status of the mini application being added to the home screen. Possible values: `unsupported`, `unknown`, `added` and `missed` |

- `unsupported` – the feature is not supported, and it is not possible to add the icon to the home screen,
- `unknown` – the feature is supported, and the icon can be added, but it is not possible to determine if the icon has already been added,
- `added` – the icon has already been added to the home screen,
- `missed` – the icon has not been added to the home screen.

### `home_screen_failed` [​](https://docs.telegram-mini-apps.com/platform/events\#home-screen-failed)

Available since: **v8.0**

User declined the request to add the current mini application to the device's home screen.

### `invoice_closed` [​](https://docs.telegram-mini-apps.com/platform/events\#invoice-closed)

An invoice was closed.

| Field | Type | Description |
| --- | --- | --- |
| slug | `string` | Passed during the [web\_app\_open\_invoice](https://docs.telegram-mini-apps.com/platform/methods#web-app-open-invoice) method invocation `slug` value. |
| status | `string` | Invoice status. Possible values: `paid`, `failed`, `pending` or `cancelled`. |

### `location_checked` [​](https://docs.telegram-mini-apps.com/platform/events\#location-checked)

Available since: **v8.0**

Location-related functionality availability status was retrieved.

| Field | Type | Description |
| --- | --- | --- |
| available | `boolean` | Shows whether location tracking is available. |
| access\_requested | `boolean` | Shows whether permission to location tracking has been requested. |
| access\_granted | `boolean` | Shows whether permission to location tracking has been granted. |

### `location_requested` [​](https://docs.telegram-mini-apps.com/platform/events\#location-requested)

Available since: **v8.0**

The application received the information about the current user location.

| Field | Type | Description |
| --- | --- | --- |
| available | `boolean` | Shows whether location tracking is available. |
| latitude | `number` | Latitude in degrees. Set only if `available` is True. |
| longitude | `number` | Longitude in degrees. Set only if `available` is True. |
| altitude | `number` | _Optional_. Altitude above sea level in meters. Set only if `available` is True. |
| course | `number` | _Optional_. The direction the device is moving in degrees. Set only if `available` is True. |
| speed | `number` | _Optional_. The speed of the device in m/s. Set only if `available` is True. |
| horizontal\_accuracy | `number` | _Optional_. Accuracy of the latitude and longitude values in meters. Set only if `available` is True. |
| vertical\_accuracy | `number` | _Optional_. Accuracy of the altitude value in meters. Set only if `available` is True. |
| course\_accuracy | `number` | _Optional_. Accuracy of the course value in degrees. Set only if `available` is True. |
| speed\_accuracy | `number` | _Optional_. Accuracy of the speed value in m/s. Set only if `available` is True. |

### `main_button_pressed` [​](https://docs.telegram-mini-apps.com/platform/events\#main-button-pressed)

User clicked the [Main Button](https://docs.telegram-mini-apps.com/platform/main-button).

### `phone_requested` [​](https://docs.telegram-mini-apps.com/platform/events\#phone-requested)

Available since: **v6.9**

Application received phone access request status.

| Field | Type | Description |
| --- | --- | --- |
| status | `string` | Request status. Can only be `sent` or `cancelled`. |

### `popup_closed` [​](https://docs.telegram-mini-apps.com/platform/events\#popup-closed)

[Popup](https://docs.telegram-mini-apps.com/platform/popup) was closed.

| Field | Type | Description |
| --- | --- | --- |
| button\_id | `string` | _Optional_. Identifier of the clicked button. In case, the popup was closed without clicking any button, this property will be omitted. |

### `prepared_message_failed` [​](https://docs.telegram-mini-apps.com/platform/events\#prepared-message-failed)

Available since: **v8.0**

Failed to send a prepared message.

| Field | Type | Description |
| --- | --- | --- |
| error | `string` | Occurred error. |

### `prepared_message_sent` [​](https://docs.telegram-mini-apps.com/platform/events\#prepared-message-sent)

Available since: **v8.0**

A prepared message was sent.

### `qr_text_received` [​](https://docs.telegram-mini-apps.com/platform/events\#qr-text-received)

Available since: **v6.4**

The QR scanner scanned some QR and extracted its content.

| Field | Type | Description |
| --- | --- | --- |
| data | `string` | _Optional_. Data extracted from the QR. |

### `reload_iframe` [​](https://docs.telegram-mini-apps.com/platform/events\#reload-iframe)

Parent iframe requested current iframe reload.

### `safe_area_changed` [​](https://docs.telegram-mini-apps.com/platform/events\#safe-area-changed)

Available since: **v8.0**

This event occurs whenever the safe area changes in the user's Telegram app, such as when the user switches to landscape mode.

The **safe area** prevents content from overlapping with system UI elements like notches or navigation bars.

| Field | Type | Description |
| --- | --- | --- |
| top | `number` | The top inset in pixels, representing the space to avoid at the top of the screen |
| bottom | `number` | The bottom inset in pixels, representing the space to avoid at the bottom of the screen |
| left | `number` | The left inset in pixels, representing the space to avoid on the left side of the screen |
| right | `number` | The right inset in pixels, representing the space to avoid on the right side of the screen |

### `scan_qr_popup_closed` [​](https://docs.telegram-mini-apps.com/platform/events\#scan-qr-popup-closed)

Available since: **v6.4**

QR scanner was closed.

### `secondary_button_pressed` [​](https://docs.telegram-mini-apps.com/platform/events\#secondary-button-pressed)

Available since: **v7.10**

A user clicked the Secondary Button.

### `secure_storage_cleared` [​](https://docs.telegram-mini-apps.com/platform/events\#secure-storage-cleared)

Available since: **v9.0**

Device's secure storage was cleared.

| Field | Type | Description |
| --- | --- | --- |
| req\_id | `string` | A unique request identifier. |

### `secure_storage_failed` [​](https://docs.telegram-mini-apps.com/platform/events\#secure-storage-failed)

Available since: **v9.0**

An error occurred while working with the device's secure storage.

| Field | Type | Description |
| --- | --- | --- |
| req\_id | `string` | A unique request identifier. |
| error | `string` | _Optional_. An occurred error. |

### `secure_storage_key_received` [​](https://docs.telegram-mini-apps.com/platform/events\#secure-storage-key-received)

Available since: **v9.0**

A value from the device's secure storage was retrieved.

| Field | Type | Description |
| --- | --- | --- |
| req\_id | `string` | A unique request identifier. |
| value | `string | null` | A retrieved value. |
| can\_restore | `boolean` | _Optional_. True if this value can be restored. |

### `secure_storage_key_restored` [​](https://docs.telegram-mini-apps.com/platform/events\#secure-storage-key-restored)

Available since: **v9.0**

A value from the device's secure storage was restored.

| Field | Type | Description |
| --- | --- | --- |
| req\_id | `string` | A unique request identifier. |
| value | `string | null` | A restored value. |

### `secure_storage_key_saved` [​](https://docs.telegram-mini-apps.com/platform/events\#secure-storage-key-saved)

Available since: **v9.0**

A value in the device's secure storage was saved.

| Field | Type | Description |
| --- | --- | --- |
| req\_id | `string` | A unique request identifier. |

### `set_custom_style` [​](https://docs.telegram-mini-apps.com/platform/events\#set-custom-style)

The event which is usually sent by the Telegram web application. Its payload represents `<style/>` tag html content, a developer could use. The stylesheet described in the payload will help the developer to stylize the app scrollbar (but he is still able to do it himself).

### `settings_button_pressed` [​](https://docs.telegram-mini-apps.com/platform/events\#settings-button-pressed)

Available since: **v6.1**

Occurs whenever the [Settings Button](https://docs.telegram-mini-apps.com/platform/settings-button) was pressed.

### `theme_changed` [​](https://docs.telegram-mini-apps.com/platform/events\#theme-changed)

Occurs whenever [the theme](https://docs.telegram-mini-apps.com/platform/theming) was changed in the user's Telegram app (including switching to night mode).

| Field | Type | Description |
| --- | --- | --- |
| theme\_params | `Record<string, string>` | Map where the key is a theme stylesheet key and value is the corresponding color in `#RRGGBB` format. |

### `viewport_changed` [​](https://docs.telegram-mini-apps.com/platform/events\#viewport-changed)

Occurs whenever the [viewport](https://docs.telegram-mini-apps.com/platform/viewport) has been changed. For example, when the user started dragging the application or called the expansion method.

| Field | Type | Description |
| --- | --- | --- |
| height | `number` | The viewport height. |
| width | `number` | _Optional_. The viewport width. |
| is\_expanded | `boolean` | Is the viewport currently expanded. |
| is\_state\_stable | `boolean` | Is the viewport current state stable and not going to change in the next moment. |

TIP

Pay attention to the fact, that send rate of this method is not enough to smoothly resize the application window. You should probably use a stable height instead of the current one, or handle this problem in another way.

### `visibility_changed` [​](https://docs.telegram-mini-apps.com/platform/events\#visibility-changed)

Available since: **v8.0**

Active state assumes that the native Telegram client is currently working with the current mini application. It is important to note that this is not related to the mini application’s visibility, but rather its selection among other currently opened mini applications.

| Field | Type | Description |
| --- | --- | --- |
| is\_visible | `boolean` | Indicates if the application is currently active. |

### `write_access_requested` [​](https://docs.telegram-mini-apps.com/platform/events\#write-access-requested)

Available since: **v6.9**

Application received write access request status.

| Field | Type | Description |
| --- | --- | --- |
| status | `string` | Request status. Can only be `allowed` or `cancelled`. |

[Edit this page on GitHub](https://github.com/telegram-mini-apps/tma.js/edit/master/apps/docs/platform/events.md)

Last updated: 10/18/25, 3:59 PM

Pager

[Previous pageMethods](https://docs.telegram-mini-apps.com/platform/methods)

[Next pageAbout](https://docs.telegram-mini-apps.com/platform/launch-parameters)

Released under the MIT License.

Copyright © 2022-present Vladislav Kibenko and Contributors