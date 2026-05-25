
import { LocalNotifications, ScheduleOptions, ScheduleResult, Importance, Visibility } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import SunCalc from 'suncalc';
import { getToken, onMessage } from 'firebase/messaging';
import { getMessagingInstance, db, auth } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { SystemNotification, fixOrphans, CUDA_PLAYLIST_URL, SupportedLanguage, SMS_SUB_NUMBER } from '../types';
import { PersistenceService } from './persistenceService';

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'cuda' | 'support' | 'wakeup4am' | 'wakeup6am' | 'motivation_1' | 'motivation_2' | 'motivation_3';

const FCM_VAPID_KEY = 'BJQik4qEm4tv4-puzowxwdHWUwggVG97RCxuSQH0C527-aFVJFK8K5NIqrTU8e3ZJQYU91xYnHA5ntBdnBYoSNs';

const CHANNELS = {
  PRAYER_MIRACLES: {
    id: 'prayer_miracles',
    name: 'Modlitwa i Cuda',
    description: 'Intencje modlitewne i świadectwa cudów',
    importance: 5 as Importance, // HIGH
    sound: 'bell.wav',
    visibility: 1 as Visibility,
  },
  PREMIERES: {
    id: 'premieres',
    name: 'Premiery i Multimedia',
    description: 'Informacje o nowych transmisjach i filmach CC',
    importance: 3 as Importance, // DEFAULT
    visibility: 1 as Visibility,
  },
  SUPPORT: {
    id: 'support_cc',
    name: 'Wsparcie CC',
    description: 'Patronat i inspiracje',
    importance: 4 as Importance, // HIGH
    visibility: 1 as Visibility,
  },
  WAKE_UP: {
    id: 'wake_up_v2',
    name: 'Motywacyjne Pobudki',
    description: 'Pobudki dla Wojowników i Uczniów Jezusa',
    importance: 5 as Importance, // HIGH
    visibility: 1 as Visibility,
    sound: 'dzwonek_cc_dzien_dobry.mp3'
  },
  SABBATH_BLESSING: {
    id: 'sabbath_blessing',
    name: 'Błogosławieństwo',
    description: 'Błogosławieństwo na Szabat (Piątek zachód słońca)',
    importance: 4 as Importance, // HIGH
    visibility: 1 as Visibility,
  }
};

const NATIVE_ACTIONS = {
  OPEN: 'OPEN_ACTION',
  SHARE: 'SHARE_ACTION',
  FAVORITE: 'FAVORITE_ACTION',     // NEW
  READ_VERSE: 'READ_VERSE_ACTION', // NEW for Verse
  LESSON: 'LESSON_ACTION',         // NEW for School
  TURN_OFF_ALARM: 'TURN_OFF_ALARM_ACTION', // NEW for Alarm
  TURN_ON_RADIO: 'TURN_ON_RADIO_ACTION',   // NEW for Alarm
  PRAY: 'PRAY_ACTION',
  ADD_INTENTION: 'ADD_INTENTION_ACTION',
  WATCH: 'WATCH_ACTION',
  SEND_SMS: 'SEND_SMS_ACTION',
  SUBSCRIBE: 'SUBSCRIBE_ACTION',
  PATRONITE: 'PATRONITE_ACTION',
  REVOLUT: 'REVOLUT_ACTION',
  NOTIFY_FRIENDS: 'NOTIFY_FRIENDS_ACTION',
  READ: 'READ_ACTION'
};

const NOTIF_TEMPLATES: Record<TimeSlot, Partial<Record<SupportedLanguage, { title: string; msg: string; icon: string }>>> = {
  morning: {
    pl: { title: "Dobre Słowo na Dziś", msg: "Twój werset dnia i planer uświęcenia czekają. Oddaj Panu pierwociny tego poranka.", icon: "📖" },
    en: { title: "Daily Word", msg: "Your daily verse and sanctification planner are ready. Give the Lord the firstfruits of this morning.", icon: "📖" }
  },
  motivation_1: {
    pl: { title: "Motywacja Dnia ⚔️", msg: "Pamiętaj, że w Jezusie jesteś zwycięzcą! Polecaj innym Motywacje Dnia od Christian Culture. MaranaTha", icon: "⚔️" },
    en: { title: "Daily Motivation ⚔️", msg: "Remember that in Jesus you are a winner! Recommend Daily Motivations from Christian Culture to others. MaranaTha", icon: "⚔️" }
  },
  motivation_2: {
    pl: { title: "Motywacja Dnia 💪", msg: "Nie bój się, bo Ja jestem z tobą! Polecaj innym Motywacje Dnia od Christian Culture. MaranaTha", icon: "💪" },
    en: { title: "Daily Motivation 💪", msg: "Do not fear, for I am with you! Recommend Daily Motivations from Christian Culture to others. MaranaTha", icon: "💪" }
  },
  motivation_3: {
    pl: { title: "Motywacja Dnia 🔥", msg: "Wszystko mogę w Chrystusie, który mnie umacnia! Polecaj innym Motywacje Dnia od Christian Culture. MaranaTha", icon: "🔥" },
    en: { title: "Daily Motivation 🔥", msg: "I can do all things through Christ who strengthens me! Recommend Daily Motivations from Christian Culture to others. MaranaTha", icon: "🔥" }
  },
  afternoon: {
    pl: { title: "Wesprzyj Misję CC", msg: "Twoje wsparcie pozwala nam utrzymać radio HI-RES. Sprawdź nowe sposoby pomocy w panelu wsparcia.", icon: "❤️" },
    en: { title: "Support CC Mission", msg: "Your support keeps our HI-RES radio running. Check new ways to help in the support panel.", icon: "❤️" }
  },
  evening: {
    pl: { title: "Globalne Wołanie 21:00", msg: "Dołącz do wieczornej modlitwy wspólnoty. Niech to będzie czas głębokiego wyciszenia z Panem.", icon: "🙏" },
    en: { title: "Global Cry 21:00", msg: "Join the evening community prayer. May this be a time of deep silence with the Lord.", icon: "🙏" }
  },
  cuda: {
    pl: { title: "CUDA KAŻDEGO DNIA ✨", msg: "Premiera na kanale Osobowość Plus właśnie się zaczyna! Kliknij, aby dołączyć.", icon: "✨" },
    en: { title: "MIRACLES EVERY DAY ✨", msg: "Premiere on Osobowość Plus channel is starting now! Click to join.", icon: "✨" }
  },
  support: {
    pl: { title: "Misja Christian Culture 🙏", msg: "Dziś czas szczególnego wsparła modlitewnego i finansowego (Blik/Revolut/Konto). Każdy dar buduje naszą wspólną misję!", icon: "🤝" },
    en: { title: "Christian Culture Mission 🙏", msg: "Today is a time for special prayer and financial support (Blik/Revolut/Account). Every gift builds our mission!", icon: "🤝" }
  },
  wakeup4am: {
    pl: { title: "Wyjście z bloków ⚔️", msg: "Wstawaj! Szkoda Dnia! Poranki z Jezusem: motywacyjna pobudka dla Wojowników Chrystusa.", icon: "⚔️" },
    en: { title: "Wake up ⚔️", msg: "Get up! Don't waste the day! Mornings with Jesus: a motivational wake-up for Christ's Warriors.", icon: "⚔️" }
  },
  wakeup6am: {
    pl: { title: "Pobudki Poranne ☀️", msg: "Motywacyjna pobudka dla Uczniów Jezusa. Czas na poranne the Word!", icon: "☀️" },
    en: { title: "Morning Wake-ups ☀️", msg: "Motivational wake-up for Jesus' Disciples. Time for the morning Word!", icon: "☀️" }
  }
};

export const NotificationService = {
  getUpdateSlot(hour: number): TimeSlot | null {
    if (hour === 18) return 'cuda';
    
    const day = new Date().getDate();
    if ((day === 1 || day === 15) && hour === 10) return 'support';

    if (hour >= 9 && hour < 12) return 'morning';
    if (hour >= 15 && hour < 18) return 'afternoon';
    // Globalne Wołanie - only triggered if it's exactly 21:00 (within that hour)
    if (hour === 21) return 'evening';
    return null;
  },

  generateNotification(slot: TimeSlot, lang: SupportedLanguage, customActions?: { label: string; onClick: () => void }[], customMessage?: string, customTitle?: string): SystemNotification {
    const template = NOTIF_TEMPLATES[slot][lang] || NOTIF_TEMPLATES[slot]['en'] || NOTIF_TEMPLATES[slot]['pl']!;
    let action = undefined;
    let actions = customActions;
    
    if (!actions) {
      if (slot === 'cuda') {
        action = { 
          label: 'OGLĄDAJ', 
          onClick: async () => {
            if ((window as any).cc_stopRadio) (window as any).cc_stopRadio();
            await Browser.open({ url: 'https://youtube.com/playlist?list=PLQBdxcl9HBc8jNIM45udIp2N6ucvK75rW&si=vtQYu4ttsDtMnwbT' });
          }
        };
      } else if (slot === 'support') {
        action = { label: 'WESPRZYJ', onClick: async () => await Browser.open({ url: 'https://zrzutka.pl/3bbxzn' }) };
      }
    }
    
    return {
      id: `auto-${slot}-${new Date().toDateString()}`,
      title: customTitle || template.title,
      message: fixOrphans(customMessage || template.msg),
      timestamp: new Date().toISOString(),
      isRead: false,
      type: (slot === 'afternoon' || slot === 'support' || slot === 'cuda') ? 'event' : 'info',
      icon: template.icon,
      action,
      actions
    };
  },

  shouldUpdate(lastUpdateStr: string | null, currentSlot: TimeSlot): boolean {
    if (!lastUpdateStr) return true;
    try {
      const lastUpdate = JSON.parse(lastUpdateStr);
      const today = new Date().toDateString();
      return lastUpdate.date !== today || lastUpdate.slot !== currentSlot;
    } catch (e) {
      return true;
    }
  },

  initialized: false,

  /**
   * INICJALIZACJA NATIVE NOTIFICATIONS (v4.6.020)
   */
  async initNative(dailyVerse?: { text: string; reference: string }): Promise<void> {
    if (this.initialized && !dailyVerse) return;
    try {
      const perms = await LocalNotifications.requestPermissions();
      if (perms.display !== 'granted') return;

      this.initialized = true;

      // 1. Definiowanie kanałów (Android)
      await LocalNotifications.createChannel(CHANNELS.PRAYER_MIRACLES);
      await LocalNotifications.createChannel(CHANNELS.PREMIERES);
      await LocalNotifications.createChannel(CHANNELS.SUPPORT);
      await LocalNotifications.createChannel(CHANNELS.WAKE_UP);
      await LocalNotifications.createChannel(CHANNELS.SABBATH_BLESSING);

      // Initialize FCM
      try {
        await this.initFCM();
      } catch (fcmErr) {
        console.error('[FCM] Failed to auto-init FCM:', fcmErr);
      }

      // 2. Definiowanie kategorii akcji
      await LocalNotifications.registerActionTypes({
        types: [
          {
            id: 'MOTIVATION_CATEGORY',
            actions: [
              { id: NATIVE_ACTIONS.OPEN, title: 'Otwórz' },
              { id: NATIVE_ACTIONS.FAVORITE, title: 'Ulubione ❤️' },
              { id: NATIVE_ACTIONS.SHARE, title: 'Udostępnij' }
            ]
          },
          {
            id: 'SCHOOL_CATEGORY',
            actions: [
              { id: NATIVE_ACTIONS.LESSON, title: 'Zacznij Lekcję' }
            ]
          },
          {
            id: 'ALARM_CATEGORY',
            actions: [
              { id: NATIVE_ACTIONS.TURN_ON_RADIO, title: 'Włącz Radio' },
              { id: NATIVE_ACTIONS.TURN_OFF_ALARM, title: 'Wyłącz' },
            ]
          },
          {
            id: 'PRAYER_9_CATEGORY',
            actions: [
              { id: NATIVE_ACTIONS.PRAY, title: 'Módl się' },
              { id: NATIVE_ACTIONS.ADD_INTENTION, title: 'Dodaj intencję' }
            ]
          },
          {
            id: 'CUDA_CATEGORY',
            actions: [
              { id: NATIVE_ACTIONS.WATCH, title: 'Oglądaj Premierę' },
              { id: NATIVE_ACTIONS.SHARE, title: 'Udostępnij' }
            ]
          },
          {
            id: 'PRAYER_21_CATEGORY',
            actions: [
              { id: NATIVE_ACTIONS.PRAY, title: 'Módl się' },
              { id: NATIVE_ACTIONS.SEND_SMS, title: 'Wyślij SMS' }
            ]
          },
          {
            id: 'SMS_SUBSCRIPTION_CATEGORY',
            actions: [
              { id: NATIVE_ACTIONS.SUBSCRIBE, title: 'Subskrybuj' },
              { id: NATIVE_ACTIONS.SHARE, title: 'Udostępnij' }
            ]
          },
          {
            id: 'PATRON_CATEGORY',
            actions: [
              { id: NATIVE_ACTIONS.PATRONITE, title: 'Patronite' },
              { id: NATIVE_ACTIONS.REVOLUT, title: 'Revolut' }
            ]
          },
          {
            id: 'SABBATH_CATEGORY',
            actions: [
              { id: NATIVE_ACTIONS.SHARE, title: 'Udostępnij' },
              { id: NATIVE_ACTIONS.READ_VERSE, title: 'Czytaj w Biblii' }
            ]
          }
        ]
      });

      // 3. Słuchacz akcji - Usuwamy tylko konkretny listener, by nie psuć innych modułów
      await LocalNotifications.removeAllListeners();
      
      LocalNotifications.addListener('localNotificationActionPerformed', async (notification) => {
        const actionId = notification.actionId;
        const payload = notification.notification;
        console.log(`[NotificationService] Action triggered: ${actionId}`, payload);

        try {
          switch (actionId) {
            case NATIVE_ACTIONS.SUBSCRIBE:
              await Browser.open({ url: 'https://patronite.pl/CCNetwork' }); // Updated link to matching sub
              break;
            case NATIVE_ACTIONS.PATRONITE:
              console.log('[NotificationService] Opening Patronite...');
              await Browser.open({ url: 'https://patronite.pl/osobowoscplus' });
              break;
            case NATIVE_ACTIONS.REVOLUT:
              console.log('[NotificationService] Opening Revolut...');
              await Browser.open({ url: 'https://revolut.me/christianculture' });
              break;
          case NATIVE_ACTIONS.SHARE:
          case NATIVE_ACTIONS.NOTIFY_FRIENDS:
            Share.share({
              title: payload.title,
              text: payload.body,
              url: 'https://polskieradio.cc',
              dialogTitle: 'Udostępnij Dobrą Nowinę'
            });
            break;
          case NATIVE_ACTIONS.FAVORITE:
            window.dispatchEvent(new CustomEvent('cc_save_favorite', { detail: { title: payload.title, body: payload.body } }));
            break;
          case NATIVE_ACTIONS.TURN_ON_RADIO:
            window.dispatchEvent(new CustomEvent('cc_trigger_radio_alarm'));
            break;
          case NATIVE_ACTIONS.TURN_OFF_ALARM:
            if ((window as any).cc_stopRadio) (window as any).cc_stopRadio();
            break;
          case NATIVE_ACTIONS.READ_VERSE:
            window.dispatchEvent(new CustomEvent('cc_open_bible'));
            break;
          case NATIVE_ACTIONS.LESSON:
            window.dispatchEvent(new CustomEvent('cc_open_biblical_school'));
            break;
          case NATIVE_ACTIONS.SEND_SMS:
            window.open(`sms:${SMS_SUB_NUMBER.replace(/\s+/g, '')}?body=Proszę o modlitwę...`, '_blank');
            break;
          case NATIVE_ACTIONS.WATCH:
            await Browser.open({ url: CUDA_PLAYLIST_URL });
            break;
          case NATIVE_ACTIONS.PRAY:
          case NATIVE_ACTIONS.OPEN:
          case NATIVE_ACTIONS.READ:
            if (payload.id === 800) {
              window.dispatchEvent(new CustomEvent('cc_open_bible'));
            } else {
              window.dispatchEvent(new CustomEvent('cc_open_community'));
            }
            break;
          case NATIVE_ACTIONS.ADD_INTENTION:
            window.dispatchEvent(new CustomEvent('cc_open_community'));
            break;
        }
      } catch (error) {
        console.error('[NotificationService] Error executing notification action:', error);
      }
    });

      // 4. Planowanie harmonogramu (v4.6.020)
      await this.scheduleAll(undefined, dailyVerse);
      
      console.log("🔔 System powiadomień CCN zainicjalizowany (AlarmManager Mode).");
    } catch (e) {
      console.error("Błąd inicjalizacji powiadomień:", e);
    }
  },

  async scheduleAll(persona?: any, dailyVerse?: { text: string; reference: string }): Promise<ScheduleResult> {
    // Czyścimy stare, by uniknąć duplikatów
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    // Odczyt preferencji uzytkownika do czestotliwosci szkoly - domyslnie 'weekly'
    let lessonFreq = 'weekly';
    if (persona && persona.lessonFrequency) {
      lessonFreq = persona.lessonFrequency;
    }

    const notifications: ScheduleOptions = {
      notifications: [
        // 10:00 - Motywacja Dnia 1
        {
          id: 1000,
          title: '⚔️ Motywacja Dnia',
          body: 'Pan jest Twoją siłą i Twoją pieśnią (Wyjścia 15:2). Nie poddawaj się! Polecaj innym Motywacje Dnia od Christian Culture. MaranaTha',
          channelId: CHANNELS.PRAYER_MIRACLES.id,
          schedule: { 
            on: { hour: 10, minute: 0 },
            allowWhileIdle: true,
            repeats: true 
          },
          actionTypeId: 'MOTIVATION_CATEGORY'
        },
        // 14:00 - Motywacja Dnia 2
        {
          id: 1400,
          title: '💪 Motywacja Dnia',
          body: 'Bóg nie dał nam ducha bojaźni, ale mocy i miłości (2 Tymoteusza 1:7). Polecaj innym Motywacje Dnia od Christian Culture. MaranaTha',
          channelId: CHANNELS.PRAYER_MIRACLES.id,
          schedule: { 
            on: { hour: 14, minute: 0 },
            allowWhileIdle: true,
            repeats: true 
          },
          actionTypeId: 'MOTIVATION_CATEGORY'
        },
        // 17:00 - Motywacja Dnia 3
        {
          id: 1700,
          title: '🔥 Motywacja Dnia',
          body: 'Wszystko mogę w Tym, który mnie umacnia (Filipian 4:13). Zwyciężaj z Jezusem! Polecaj innym Motywacje Dnia od Christian Culture. MaranaTha',
          channelId: CHANNELS.PRAYER_MIRACLES.id,
          schedule: { 
            on: { hour: 17, minute: 0 },
            allowWhileIdle: true,
            repeats: true 
          },
          actionTypeId: 'MOTIVATION_CATEGORY'
        },
        // 09:00 - Intencje Modlitwy (Codziennie)
        {
          id: 900,
          title: '🙏 Poranne Wołanie',
          body: 'Wspólnota czeka na wspólną modlitwę o 9:00. Dołącz do nas.',
          channelId: CHANNELS.PRAYER_MIRACLES.id,
          schedule: { 
            on: { hour: 9, minute: 0 },
            allowWhileIdle: true,
            repeats: true 
          },
          actionTypeId: 'PRAYER_9_CATEGORY'
        },
        // 15:00 - Szkoła Biblijna (W zależności od częstotliwości)
        {
          id: 1500,
          title: '📚 Szkoła Biblijna',
          body: 'Czas na Twoją lekcję w Szkole Biblijnej. Rozwiń swoją relację z Bogiem.',
          channelId: CHANNELS.PREMIERES.id, // Or a new channel if created
          schedule: { 
            on: lessonFreq === 'daily' ? { hour: 15, minute: 0 } : (lessonFreq === 'biweekly' ? { hour: 15, minute: 0, weekday: 3 } : { hour: 15, minute: 0, weekday: 6 }), // default weekly on Saturday (6)
            allowWhileIdle: true,
            repeats: true 
          },
          actionTypeId: 'SCHOOL_CATEGORY'
        },
        // 18:00 - Cuda Każdego Dnia (Codziennie)
        {
          id: 1800,
          title: '✨ Cuda Każdego Dnia',
          body: 'Premiera na kanale Osobowość Plus. Zobacz jak Bóg działa dzisiaj!',
          channelId: CHANNELS.PRAYER_MIRACLES.id,
          schedule: { 
            on: { hour: 18, minute: 0 },
            allowWhileIdle: true,
            repeats: true 
          },
          actionTypeId: 'CUDA_CATEGORY'
        },
        // 19:00 - Subskrypcje SMS (Codziennie)
        {
          id: 1900,
          title: '📱 Biblijne Inspiracje SMS',
          body: 'Subskrybuj nasze codzienne inspiracje na nr 537 147 043. Bądź blisko Słowa!',
          channelId: CHANNELS.PREMIERES.id,
          schedule: { 
            on: { hour: 19, minute: 0 },
            allowWhileIdle: true,
            repeats: true 
          },
          actionTypeId: 'SMS_SUBSCRIPTION_CATEGORY'
        },
        // 20:00 - Zostań Patronem (Codziennie)
        {
          id: 2000,
          title: '🛡️ Zostań Patronem CC',
          body: 'Twoje wsparcie buduje Christian Culture. Dołącz do grona Patronów.',
          channelId: CHANNELS.SUPPORT.id,
          schedule: { 
            on: { hour: 20, minute: 0 },
            allowWhileIdle: true,
            repeats: true 
          },
          actionTypeId: 'PATRON_CATEGORY'
        },
        // 21:00 - Intencje Modlitwy (Codziennie)
        {
          id: 2100,
          title: '🌑 Globalne Wołanie 21:00',
          body: 'Czas na wieczorne uświęcenie i wspólną modlitwę za intencje.',
          channelId: CHANNELS.PRAYER_MIRACLES.id,
          schedule: { 
            on: { hour: 21, minute: 0 },
            allowWhileIdle: true,
            repeats: true 
          },
          actionTypeId: 'PRAYER_21_CATEGORY'
        },
        // 21:00 - Sobota - Apokalipsa (Tylko Sobota)
        {
          id: 2102,
          title: '🔥 Apokalipsa - Premiera',
          body: 'Wielka premiera na Christian Culture TV! Nie przegap.',
          channelId: CHANNELS.PREMIERES.id,
          schedule: { 
            on: { weekday: 7, hour: 21, minute: 0 }, // 21:00 Saturday
            allowWhileIdle: true,
            repeats: true 
          },
          actionTypeId: 'SATURDAY_PREMIERE_CATEGORY'
        }
      ]
    };

    const notifSettings = PersistenceService.loadNotificationSettings();
    if (notifSettings.wakeup4amEnabled) {
      notifications.notifications.push({
        id: 400,
        title: NOTIF_TEMPLATES['wakeup4am']['pl']!.title,
        body: NOTIF_TEMPLATES['wakeup4am']['pl']!.msg,
        channelId: CHANNELS.WAKE_UP.id,
        sound: 'dzwonek_cc_dzien_dobry.mp3',
        schedule: { 
          on: { hour: 4, minute: 0 },
          allowWhileIdle: true,
          repeats: true 
        },
        actionTypeId: 'MOTIVATION_CATEGORY'
      });
    }

    if (notifSettings.wakeup6amEnabled) {
      notifications.notifications.push({
        id: 600,
        title: NOTIF_TEMPLATES['wakeup6am']['pl']!.title,
        body: NOTIF_TEMPLATES['wakeup6am']['pl']!.msg,
        channelId: CHANNELS.WAKE_UP.id,
        sound: 'dzwonek_cc_dzien_dobry.mp3',
        schedule: { 
          on: { hour: 6, minute: 0 },
          allowWhileIdle: true,
          repeats: true 
        },
        actionTypeId: 'MOTIVATION_CATEGORY'
      });
    }

    // Sabbath Blessings scheduling based on geolocation
    let lat = 52.2297; // Default Warsaw
    let lng = 21.0122;
    try {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const getPos = (): Promise<GeolocationPosition> => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000, maximumAge: 86400000 }));
        const pos = await getPos();
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }
    } catch(e) {
      // Ignore
    }

    let dateCursor = new Date();
    let addedFridays = 0;
    while (addedFridays < 4) {
      if (dateCursor.getDay() === 5) { // Friday
        const times = SunCalc.getTimes(dateCursor, lat, lng);
        const sunsetTime = times.sunset;
        if (sunsetTime > new Date()) {
          notifications.notifications.push({
            id: 5000 + addedFridays,
            title: 'Odpocznij',
            body: '„Niech ci błogosławi Pan i niechaj cię strzeże; Niech rozjaśni Pan oblicze swoje nad tobą i niech ci miłościw będzie; Niech obróci Pan twarz swoją ku tobie i niech ci da pokój.”\n— 4 Mojżeszowa (Liczb) 6:24-26',
            channelId: CHANNELS.SABBATH_BLESSING.id,
            schedule: {
              at: sunsetTime,
              allowWhileIdle: true
            },
            actionTypeId: 'SABBATH_CATEGORY'
          });
          addedFridays++;
        }
      }
      dateCursor.setDate(dateCursor.getDate() + 1);
      dateCursor.setHours(0, 0, 0, 0); // reset clock for next day
    }

    return await LocalNotifications.schedule(notifications);
  },

  /**
   * INICJALIZACJA FIREBASE CLOUD MESSAGING (v4.7.170)
   */
  async initFCM(): Promise<void> {
    try {
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      const token = await getToken(messaging, { vapidKey: FCM_VAPID_KEY });
      if (token) {
        console.log('[FCM] Device token:', token);
        await this.syncFCMToken(token);
        
        // Auto-subscribe to global broadcasts
        try {
          await fetch('/api/admin/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, topic: 'global_call' })
          });
          console.log('[FCM] Auto-subscribed to global_call topic.');
        } catch (subErr) {
          console.warn('[FCM] Auto-subscribe failed:', subErr);
        }
      }

      onMessage(messaging, (payload) => {
        console.log('[FCM] Foreground message:', payload);
        // Dispatch custom event for app-wide notification handling
        window.dispatchEvent(new CustomEvent('cc_fcm_message', { detail: payload }));
        
        // Show as a system toast if needed
        if (payload.notification) {
          window.dispatchEvent(new CustomEvent('cc_show_toast', { 
            detail: { 
              msg: payload.notification.body, 
              title: payload.notification.title,
              type: 'info'
            } 
          }));
        }
      });
    } catch (error) {
      console.error('[FCM] Error initializing FCM:', error);
    }
  },

  async syncFCMToken(token: string): Promise<void> {
    const user = auth.currentUser;
    const deviceId = (window as any).cc_deviceId || 'web-browser-' + Math.random().toString(36).substring(7);
    
    // Save to Firestore under tokens collection
    const tokenRef = doc(db, 'fcm_tokens', token);
    try {
      await setDoc(tokenRef, {
        token,
        userId: user?.uid || null,
        email: user?.email || null,
        deviceId: deviceId,
        platform: 'web',
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('[FCM] Token synced to cloud.');
    } catch (err) {
      console.warn('[FCM] Token sync failed (likely permission), saving locally.');
      localStorage.setItem('cc_fcm_token', token);
    }
  }
};
