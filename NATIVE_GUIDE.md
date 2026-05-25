# Christian Culture - Native Implementation Guide

This guide explains how to implement the native features (Widgets & Wearables) that consume data from the Capacitor app.

## 1. Verse of the Day Widget (iOS - WidgetKit)

To display the verse on the iOS Lock Screen/Home Screen:

1.  **App Groups**: In Xcode, add the "App Groups" capability to both your main App and the Widget Extension. Use a group like `group.pl.cclite.app`.
2.  **Data Access**: The `NativeService.ts` saves data to `Preferences`. To make this accessible to the widget, you should modify the Capacitor `Preferences` plugin configuration to use the App Group suite.
3.  **Swift Code**:
    ```swift
    // In your Widget's TimelineProvider
    let sharedDefaults = UserDefaults(suiteName: "group.pl.cclite.app")
    let verseText = sharedDefaults?.string(forKey: "widget_verse_text") ?? "Brak wersetu"
    let verseRef = sharedDefaults?.string(forKey: "widget_verse_ref") ?? ""
    ```

## 2. Verse of the Day Widget (Android - AppWidgets)

1.  **SharedPreferences**: Capacitor Preferences uses standard Android SharedPreferences.
2.  **Java/Kotlin Code**:
    ```kotlin
    val prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE)
    val verseText = prefs.getString("widget_verse_text", "Brak wersetu")
    ```

## 3. Fall Detection (Apple Watch / Android Wear)

The current implementation in `NativeService.ts` uses the phone's accelerometer. 
To support "Fall Detection on the wrist":

1.  **Watch App**: You must create a native WatchOS target in Xcode.
2.  **CoreMotion**: Use `CMSensorRecorder` or `CMMotionManager` on the Watch to detect impacts.
3.  **Communication**: Use `WCSession` (WatchConnectivity) to send the alert back to the phone, or trigger a local notification directly from the watch.

## 4. Push Notifications

The app is already configured to register for Push Notifications.
- **Token**: The registration token is logged in the console.
- **Backend**: You need to send this token to your server to target specific users.
- **FCM/APNS**: Configure Firebase Cloud Messaging (Android) and Apple Push Notification service (iOS) in the respective developer consoles.
