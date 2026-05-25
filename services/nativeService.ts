import { Capacitor, registerPlugin } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// Rejestracja customowego pluginu lokalnego
const WidgetSync = registerPlugin<any>('WidgetSync');
import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { Share } from '@capacitor/share';
import { Motion } from '@capacitor/motion';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { NotificationService } from './notificationService';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update'; // ADDED APP UPDATE

export class NativeService {
  private static instance: NativeService;
  private constructor() {}

  public static getInstance(): NativeService {
    if (!NativeService.instance) {
      NativeService.instance = new NativeService();
    }
    return NativeService.instance;
  }

  public async initialize() {
    if (!Capacitor.isNativePlatform()) {
      console.log('[NativeService] Running in web mode.');
      return;
    }

    console.log('[NativeService] Initializing native features...');

    try {
      // Status Bar
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#000000' });

      // Splash Screen
      await SplashScreen.hide();

      // Device Info
      const info = await Device.getInfo();
      console.log('[NativeService] Device info:', info);

      // Push Notifications Setup
      await this.setupPushNotifications();
      
      // Local Notifications Setup
      await this.setupLocalNotifications();
      
      // Schedule CC Specific Notifications (v4.6.010 Logic)
      await NotificationService.initNative();
      
      // Sprawdzanie aktualizacji z Google Play
      await this.checkAppUpdate();
    } catch (error) {
      console.error('[NativeService] Initialization error:', error);
    }
  }

  /**
   * Sprawdzanie aktualizacji w Google Play (Immediate lub Flexible)
   */
  public async checkAppUpdate() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      const result = await AppUpdate.getAppUpdateInfo();
      console.log('[NativeService] AppUpdateInfo:', result);

      if (result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
        if (result.immediateUpdateAllowed) {
          try {
            await AppUpdate.performImmediateUpdate();
          } catch (updateErr) {
            console.log('[NativeService] Immediate update cancelled or failed:', updateErr);
            // Zgodnie z wytycznymi - powrót do normalnego stanu bez zawieszenia
          }
        } else if (result.flexibleUpdateAllowed) {
          try {
            await AppUpdate.startFlexibleUpdate();
            
            // Listen for flexible update state change to complete it
            AppUpdate.addListener('onFlexibleUpdateStateChange', async (state) => {
              if (state.installStatus === 11) { // 11 means DOWNLOADED
                console.log('[NativeService] Flexible update downloaded. Prompting to complete.');
                AppUpdate.completeFlexibleUpdate();
              }
            });
            
          } catch (updateErr) {
            console.log('[NativeService] Flexible update cancelled or failed:', updateErr);
            // Powrót do normalnego stanu
          }
        }
      }
    } catch (e) {
      console.error('[NativeService] checkAppUpdate failed:', e);
    }
  }

  /**
   * Schedules Christian Culture specific notifications:
   * Delegated to NotificationService.initNative() for advanced matrix scheduling.
   */
  public async scheduleCCNotifications(
    verseTime: { hour: number; minute: number } = { hour: 8, minute: 0 }, 
    verse?: { text: string; reference: string }
  ) {
    if (!Capacitor.isNativePlatform()) return;
    // We already call initNative in initialize(), but if this is called manually 
    // with a new verse or time, we can re-sync.
    await NotificationService.initNative(verse);
  }

  /**
   * Schedules the Radio Alarm as a local notification.
   * This acts as a backup in case the app is in the background.
   */
  public async scheduleRadioAlarm(alarm: { time: string; selectedDays: number[]; enabled: boolean }) {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Cancel all previous radio alarm notifications (IDs 2000-2007)
      const pending = await LocalNotifications.getPending();
      const idsToRemove = pending.notifications
        .filter(n => n.id >= 2000 && n.id <= 2007)
        .map(n => n.id);
      
      if (idsToRemove.length > 0) {
        await LocalNotifications.cancel({ notifications: idsToRemove.map(id => ({ id })) });
      }

      if (!alarm.enabled || alarm.selectedDays.length === 0) {
        console.log('[NativeService] Radio alarm disabled or no days selected.');
        return;
      }

      const [hour, minute] = alarm.time.split(':').map(Number);
      const notifications = [];

      // Schedule a notification for each selected day
      // selectedDays: 0 (Sun) - 6 (Sat)
      // Capacitor weekday: 1 (Sun) - 7 (Sat)
      for (const day of alarm.selectedDays) {
        notifications.push({
          title: "⏰ Budzik Christian Culture",
          body: "Czas na Twoje spotkanie ze Słowem. Kliknij, aby włączyć radio.",
          id: 2000 + day,
          schedule: {
            on: {
              weekday: day + 1,
              hour,
              minute
            },
            repeats: true,
            allowPause: false
          },
          sound: 'alarm.wav',
          actionTypeId: 'ALARM_CATEGORY',
          extra: { type: 'radio_alarm' }
        });
      }
      
      await LocalNotifications.schedule({ notifications });
      console.log(`[NativeService] Radio alarm scheduled for ${alarm.time} on days: ${alarm.selectedDays.join(',')}`);
    } catch (error) {
      console.error('[NativeService] Error scheduling radio alarm:', error);
    }
  }

  private async setupPushNotifications() {
    try {
      console.log('[NativeService] Skipping PushNotifications setup to prevent native crashes on missing google-services.json');
      // Push Notifications are disabled temporarily to prevent the app from crashing after permission acceptance
      // Because Firebase Cloud Messaging might not be fully configured natively.
    } catch (error) {
      console.error('[NativeService] Push Notifications setup failure:', error);
    }
  }

  private async setupLocalNotifications() {
    const permStatus = await LocalNotifications.requestPermissions();
    if (permStatus.display !== 'granted') {
      console.warn('[NativeService] Local notification permissions not granted.');
    }

    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('[NativeService] Local notification action:', notification);
      if (notification.notification.extra?.type === 'radio_alarm') {
        // We can't directly trigger radio here as we are in the service, 
        // but we can set a flag or broadcast an event.
        // For now, the app will open and the useRadio hook will see the time match if it's within the same minute.
        window.dispatchEvent(new CustomEvent('cc_trigger_radio_alarm'));
      }
    });
  }

  /**
   * Syncs data for Native Widgets (iOS WidgetKit / Android AppWidgets)
   * On iOS, this would ideally use App Groups, but we use Preferences as a fallback
   * that native code can read if configured correctly.
   */
  public async updateWidgetData(data: { verse: string; reference: string; date: string }) {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await Preferences.set({
        key: 'widget_verse_text',
        value: data.verse
      });
      await Preferences.set({
        key: 'widget_verse_ref',
        value: data.reference
      });
      await Preferences.set({
        key: 'widget_last_update',
        value: data.date
      });
      
      // Update widgets via our custom local plugin
      try {
        await WidgetSync.updateWidgets();
      } catch (e) {
        console.warn('[NativeService] WidgetSync plugin not available or failed:', e);
      }
      
      console.log('[NativeService] Widget data synced successfully.');
    } catch (error) {
      console.error('[NativeService] Widget sync error:', error);
    }
  }

  public async updateRadioWidgetData(isPlaying: boolean, streamName: string) {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await Preferences.set({ key: 'widget_radio_playing', value: isPlaying ? 'true' : 'false' });
      await Preferences.set({ key: 'widget_radio_stream', value: streamName });
      
      try {
        await WidgetSync.updateWidgets();
      } catch (e) {
        console.warn('[NativeService] WidgetSync plugin not available or failed:', e);
      }
      
      console.log('[NativeService] Radio Widget data synced successfully.');
    } catch (error) {
      console.error('[NativeService] Radio Widget sync error:', error);
    }
  }

  // Haptic Feedback Methods
  public async hapticImpact(style: ImpactStyle = ImpactStyle.Medium) {
    if (!Capacitor.isNativePlatform()) return;
    await Haptics.impact({ style });
  }

  public async hapticNotification(type: NotificationType = NotificationType.Success) {
    if (!Capacitor.isNativePlatform()) return;
    await Haptics.notification({ type });
  }

  public async hapticSelection() {
    if (!Capacitor.isNativePlatform()) return;
    await Haptics.selectionStart();
    await Haptics.selectionChanged();
    await Haptics.selectionEnd();
  }

  public isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  public async scheduleLocalReminder(title: string, body: string, targetDate: Date) {
    if (!Capacitor.isNativePlatform()) return;
    try {
      const id = Date.now() % 1000000;
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id,
            schedule: { at: targetDate },
            sound: 'alarm.wav',
          }
        ]
      });
      console.log(`[NativeService] Reminder scheduled for ${targetDate}`);
    } catch (e) {
      console.error('[NativeService] scheduleLocalReminder error:', e);
    }
  }

  public async getDeviceInfo() {
    return await Device.getInfo();
  }

  public async share(title: string, text: string, url: string = 'https://cclite.pl'): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.log('Share attempt in web mode:', { title, text, url });
      // W wersji webowej możemy skorzystać z Web Share API jeśli przeglądarka obsługuje
      if (navigator.share) {
         try {
            await navigator.share({ title, text, url });
            return true;
         } catch(e) {
            console.error('Web share failed', e);
         }
      }
      return false;
    }
    
    try {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: title,
      });
      return true;
    } catch (e) {
      console.error('[NativeService] Error sharing:', e);
      return false;
    }
  }

  public async setEmergencyContacts(contacts: any[]) {
    if (!Capacitor.isNativePlatform()) {
       console.log('setEmergencyContacts in web mode', contacts);
       return;
    }
    try {
      await Preferences.set({ 
        key: 'emergency_contacts', 
        value: JSON.stringify(contacts) 
      });
      console.log('[NativeService] Emergency contacts saved natively');
    } catch (e) {
      console.error('[NativeService] Error saving emergency contacts:', e);
    }
  }
}

export const nativeService = NativeService.getInstance();
