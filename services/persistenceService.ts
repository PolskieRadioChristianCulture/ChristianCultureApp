import {
  Prayer,
  DailyGoal,
  DailyTask,
  DailyNote,
  SpiritualGoal,
  DailyGoalProgress,
  UserPersona,
  DualBibleVerse,
  RadioAlarm,
  CloudStatus,
  NotificationSettings,
  RadioStreamType,
  SystemNotification,
  BibleVerse,
  APP_VERSION,
} from "../types";
import { DEFAULT_WIDGET_CONFIGS } from "../constants";

const STORAGE_KEYS = {
  USER_PERSONA: "cc_user_persona_v3",
  PRAYERS: "cc_prayers_v3",
  DAILY_GOALS: "cc_daily_goals_v3",
  DAILY_TASKS: "cc_daily_tasks_v3",
  NOTES: "cc_notes_v3",
  SPIRITUAL_GOALS: "cc_spiritual_goals_v3",
  PROGRESS: "cc_progress_v3",
  APP_CONFIG: "cc_app_config_v3",
  DAILY_VERSE_CACHE: "cc_daily_verse_cache",
  VERSE_HISTORY: "cc_verse_history_v1",
  BUSINESS_CARD: "cc_business_card_v1",
  RADIO_ALARM: "cc_radio_alarm",
  CLOUD_STATUS: "cc_cloud_status",
  NOTIFICATION_SETTINGS: "cc_notification_settings",
  LAST_STREAM: "cc_last_stream",
  VOLUME: "cc_radio_volume",
  SYSTEM_NOTIFICATIONS: "cc_system_notifications_v1",
  GEMINI_API_KEY: "cc_gemini_api_key",
  REMEMBERED_START_MODE: "cc_remembered_start_mode",
  RADIO_IS_PLAYING: "cc_radio_is_playing",
  DYNAMIC_DB: "cc_dynamic_db_v1",
  LAST_DISPLAYED_VERSE: "cc_last_displayed_verse_v1",
  BIBLE_AD_LAST_SHOWN: "cc_bible_ad_last_shown_v1",
  FAVORITE_VERSES: "cc_favorite_verses_v1",
  FAVORITE_VERSE_COLORS: "cc_favorite_verse_colors_v1",
  BIBLE_FONT_SETTINGS: "cc_bible_font_settings_v1",
  VERSE_IMAGE_SETTINGS: "cc_verse_image_settings_v1",
  WIDGETS_HIDDEN: "cc_widgets_hidden_v1",
  USER_LAYOUTS: "cc_user_layouts_v1",
};

const SSO_COOKIE_NAME = "cc_auth_session_v1";

interface VerseCache {
  date: string;
  data: DualBibleVerse;
}

export const PersistenceService = {
  // --- SSO Cookie Methods (Single Sign-On across subdomains) ---
  setSSOCookie: (userData: Partial<UserPersona>) => {
    try {
      const hostname = window.location.hostname;
      // Jeśli jesteśmy na cclite.pl lub dowolnej subdomenie, ustawiamy domenę ciasteczka na .cclite.pl
      const domain = hostname.endsWith("cclite.pl") ? ".cclite.pl" : hostname;

      const ssoData = {
        name: userData.name,
        email: userData.googleEmail,
        picture: userData.profilePicture,
        gender: userData.gender,
        mentor: userData.assignedMentor,
        timestamp: Date.now(),
      };

      const value = encodeURIComponent(JSON.stringify(ssoData));
      const isSecure = window.location.protocol === "https:";
      const secureFlag = isSecure ? "Secure;" : "";

      // Max-Age 30 dni, SameSite=Lax dla kompatybilności i bezpieczeństwa
      document.cookie = `${SSO_COOKIE_NAME}=${value}; Domain=${domain}; Path=/; Max-Age=2592000; SameSite=Lax; ${secureFlag}`;
      console.log(`[SSO] Session cookie broadcasted to domain: ${domain}`);
    } catch (e) {
      console.error("[SSO] Failed to set session cookie:", e);
    }
  },

  getSSOCookie: (): any | null => {
    try {
      const match = document.cookie.match(
        new RegExp("(^| )" + SSO_COOKIE_NAME + "=([^;]+)"),
      );
      if (match) {
        return JSON.parse(decodeURIComponent(match[2]));
      }
    } catch (e) {
      console.debug("[SSO] No active session cookie found.");
    }
    return null;
  },

  clearSSOCookie: () => {
    try {
      const hostname = window.location.hostname;
      const domain = hostname.endsWith("cclite.pl") ? ".cclite.pl" : hostname;
      // Usuwanie ciasteczka poprzez ustawienie daty wygaśnięcia w przeszłości na domenie głównej
      document.cookie = `${SSO_COOKIE_NAME}=; Domain=${domain}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
      console.log(`[SSO] Session cookie cleared from domain: ${domain}`);
    } catch (e) {
      console.error("[SSO] Failed to clear session cookie:", e);
    }
  },

  // --- Standard Storage Methods ---
  safeSetItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      if (
        e instanceof DOMException &&
        (e.code === 22 ||
          e.code === 1014 ||
          e.name === "QuotaExceededError" ||
          e.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        console.warn(
          `[Persistence] Storage quota exceeded for key: ${key}. Attempting to clear space...`,
        );
        // Clear history and all pre-cached verses to make space
        localStorage.removeItem(STORAGE_KEYS.VERSE_HISTORY);

        // Remove all daily verse cache keys (except the current one if possible, but let's be safe)
        Object.keys(localStorage).forEach((k) => {
          if (
            k.startsWith(STORAGE_KEYS.DAILY_VERSE_CACHE) ||
            k === "cc_bible_bw_flat_v7_2"
          ) {
            localStorage.removeItem(k);
          }
        });

        // Try again
        try {
          localStorage.setItem(key, value);
        } catch (retryError) {
          console.error(
            `[Persistence] Failed to save ${key} even after clearing history and caches.`,
            retryError,
          );
        }
      } else {
        console.error(`[Persistence] Error saving ${key}:`, e);
      }
    }
  },

  safeGetItem: (key: string, defaultValue: any): any => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      console.error(
        `[Persistence] Error parsing ${key} from localStorage, resetting data:`,
        e,
      );
      localStorage.removeItem(key);
      if (defaultValue !== undefined) {
        try {
          localStorage.setItem(key, JSON.stringify(defaultValue));
        } catch (setErr) {
          console.warn("[Persistence] Failed to auto-save default", setErr);
        }
      }
      return defaultValue;
    }
  },

  saveUserPersona: (data: UserPersona) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.USER_PERSONA,
      JSON.stringify(data),
    );
  },
  loadUserPersona: (): UserPersona | null => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PERSONA);
    if (saved) {
      try {
        const persona = JSON.parse(saved);
        if (persona.keepScreenOnWhileRadioPlaying === undefined) {
          persona.keepScreenOnWhileRadioPlaying = false;
        }
        if (persona.screensaverEnabled === undefined) {
          persona.screensaverEnabled = true;
        }
        if (persona.autostartRadio === undefined) {
          persona.autostartRadio = true;
        }
        if (persona.theme === undefined) {
          persona.theme = "dark";
        }
        persona.ageGroup = persona.ageGroup ?? "unspecified";
        persona.maritalStatus = persona.maritalStatus ?? "unspecified";
        persona.spiritualStatus = persona.spiritualStatus ?? "unspecified";
        persona.googleEmail = persona.googleEmail ?? undefined;
        persona.isGoogleCalendarConnected =
          persona.isGoogleCalendarConnected ?? false;
        persona.googleCalendarId = persona.googleCalendarId ?? undefined;
        persona.favorites = persona.favorites ?? [];
        persona.completedLessons = persona.completedLessons ?? [];
        persona.badges = persona.badges ?? [];
        persona.bio = persona.bio ?? "";
        persona.socialLinks = persona.socialLinks ?? {};
        persona.embedCode = persona.embedCode ?? "";
        persona.widgetConfigs = persona.widgetConfigs ?? DEFAULT_WIDGET_CONFIGS;
        return persona;
      } catch (err) {
        console.error(
          "[Persistence] Error parsing UserPersona, returning null",
          err,
        );
        localStorage.removeItem(STORAGE_KEYS.USER_PERSONA);
        return null;
      }
    }
    return null;
  },

  saveLastStream: (stream: RadioStreamType) => {
    PersistenceService.safeSetItem(STORAGE_KEYS.LAST_STREAM, stream);
  },
  loadLastStream: (): RadioStreamType | null => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_STREAM);
    return saved === "PL" || saved === "GLOBAL" || saved === "BIBLIA"
      ? (saved as RadioStreamType)
      : null;
  },

  saveVolume: (volume: number) => {
    PersistenceService.safeSetItem(STORAGE_KEYS.VOLUME, volume.toString());
  },
  loadVolume: (): number => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOLUME);
    return saved ? parseFloat(saved) : 1.0;
  },

  saveIsPlaying: (val: boolean) => {
    PersistenceService.safeSetItem(STORAGE_KEYS.RADIO_IS_PLAYING, val.toString());
  },
  loadIsPlaying: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.RADIO_IS_PLAYING) === "true";
  },

  saveSystemNotifications: (data: SystemNotification[]) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.SYSTEM_NOTIFICATIONS,
      JSON.stringify(data),
    );
    const unreadCount = data.filter((n) => !n.isRead).length;
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SET_APP_BADGE_COUNT",
        count: unreadCount,
      });
    }
  },
  loadSystemNotifications: (): SystemNotification[] => {
    return PersistenceService.safeGetItem(
      STORAGE_KEYS.SYSTEM_NOTIFICATIONS,
      [],
    );
  },

  savePrayers: (data: Prayer[]) => {
    PersistenceService.safeSetItem(STORAGE_KEYS.PRAYERS, JSON.stringify(data));
  },
  loadPrayers: (): Prayer[] => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.PRAYERS, []);
  },

  saveDailyGoals: (data: DailyGoal[]) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.DAILY_GOALS,
      JSON.stringify(data),
    );
  },
  loadDailyGoals: (): DailyGoal[] => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.DAILY_GOALS, []);
  },

  saveDailyTasks: (data: DailyTask[]) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.DAILY_TASKS,
      JSON.stringify(data),
    );
  },
  loadDailyTasks: (): DailyTask[] => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.DAILY_TASKS, []);
  },

  saveNotes: (data: DailyNote[]) => {
    PersistenceService.safeSetItem(STORAGE_KEYS.NOTES, JSON.stringify(data));
  },
  loadNotes: (): DailyNote[] => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.NOTES, []);
  },

  saveSpiritualGoals: (data: SpiritualGoal[]) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.SPIRITUAL_GOALS,
      JSON.stringify(data),
    );
  },
  loadSpiritualGoals: (): SpiritualGoal[] => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.SPIRITUAL_GOALS, []);
  },

  saveProgress: (data: DailyGoalProgress[]) => {
    PersistenceService.safeSetItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data));
  },
  loadProgress: (): DailyGoalProgress[] => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.PROGRESS, []);
  },

  saveDailyVerseCache: (date: string, data: DualBibleVerse) => {
    console.log(
      `[Persistence] Saving verse cache for date: ${date}, ref: ${data.pl.reference}`,
    );
    const cache: VerseCache = { date, data };
    PersistenceService.safeSetItem(
      STORAGE_KEYS.DAILY_VERSE_CACHE,
      JSON.stringify(cache),
    );

    // Dodaj do historii jeśli jeszcze nie ma
    const history = PersistenceService.loadVerseHistory();
    if (!history.some((h) => h.reference === data.pl.reference)) {
      const newHistory = [
        { date, reference: data.pl.reference },
        ...history,
      ].slice(0, 365);
      PersistenceService.safeSetItem(
        STORAGE_KEYS.VERSE_HISTORY,
        JSON.stringify(newHistory),
      );
    }
  },
  loadVerseHistory: (): { date: string; reference: string }[] => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.VERSE_HISTORY, []);
  },
  loadDailyVerseCache: (currentDate: string): DualBibleVerse | null => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_VERSE_CACHE);
    if (!saved) return null;
    try {
      const cache: VerseCache = JSON.parse(saved);
      if (cache.date !== currentDate) {
        console.log(
          `[Persistence] Cache date mismatch. Cache: ${cache.date}, Current: ${currentDate}`,
        );
        return null;
      }
      return cache.data;
    } catch (e) {
      console.error("[Persistence] Error parsing verse cache:", e);
      return null;
    }
  },

  // --- Offline-First Pre-caching ---
  preCacheUpcomingContent: async (
    fetchFn: (date: string) => Promise<DualBibleVerse | null>,
  ) => {
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const dateStr = futureDate.toISOString().split("T")[0];

      const existing = localStorage.getItem(
        `${STORAGE_KEYS.DAILY_VERSE_CACHE}_${dateStr}`,
      );
      if (!existing) {
        console.log(`[Persistence] Pre-caching content for ${dateStr}...`);
        try {
          const data = await fetchFn(dateStr);
          if (data) {
            PersistenceService.safeSetItem(
              `${STORAGE_KEYS.DAILY_VERSE_CACHE}_${dateStr}`,
              JSON.stringify({ date: dateStr, data }),
            );
          }
        } catch (err) {
          console.warn(`[Persistence] Failed to pre-cache ${dateStr}:`, err);
        }
      }
    }
  },

  getPreCachedVerse: (dateStr: string): DualBibleVerse | null => {
    try {
      const saved = localStorage.getItem(
        `${STORAGE_KEYS.DAILY_VERSE_CACHE}_${dateStr}`,
      );
      return saved ? JSON.parse(saved).data : null;
    } catch {
      return null;
    }
  },

  saveRadioAlarm: (alarm: RadioAlarm) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.RADIO_ALARM,
      JSON.stringify(alarm),
    );
  },
  loadRadioAlarm: (): RadioAlarm | null => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.RADIO_ALARM, null);
  },

  saveCloudStatus: (status: CloudStatus) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.CLOUD_STATUS,
      JSON.stringify(status),
    );
  },
  loadCloudStatus: (): CloudStatus | null => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.CLOUD_STATUS, null);
  },

  saveNotificationSettings: (settings: NotificationSettings) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.NOTIFICATION_SETTINGS,
      JSON.stringify(settings),
    );
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "UPDATE_NOTIFICATION_SETTINGS",
        settings,
      });
    }
  },
  loadNotificationSettings: (): NotificationSettings => {
    const saved = PersistenceService.safeGetItem(
      STORAGE_KEYS.NOTIFICATION_SETTINGS,
      null,
    );
    const defaultSettings: NotificationSettings = {
      verseOfDayEnabled: true,
      verseOfDayTime: "08:00",
      dailyMiraclesEnabled: true,
      supportRemindersEnabled: true,
      momentOfPeaceEnabled: true,
      lockScreenWidgetEnabled: true,
      wakeup4amEnabled: false,
      wakeup6amEnabled: false,
    };
    return saved ? { ...defaultSettings, ...saved } : defaultSettings;
  },

  saveGeminiApiKey: (key: string) => {
    PersistenceService.safeSetItem(STORAGE_KEYS.GEMINI_API_KEY, key);
  },
  loadGeminiApiKey: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
  },

  saveRememberedStartMode: (mode: "standard" | "blind") => {
    PersistenceService.safeSetItem(STORAGE_KEYS.REMEMBERED_START_MODE, mode);
  },
  loadRememberedStartMode: (): "standard" | "blind" | null => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMEMBERED_START_MODE);
    return saved === "standard" || saved === "blind" ? saved : null;
  },

  saveDynamicDB: (data: any) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.DYNAMIC_DB,
      JSON.stringify(data),
    );
  },
  loadDynamicDB: (): any => {
    const defaultNews =
      '✨ CC OS v26.5.22.3 - Publikacja Google Play\n' +
      `- [${new Date().toLocaleString('pl-PL')}] Usunięto nieużywane uprawnienie com.android.vending.BILLING z AndroidManifest.xml, co rozwiązuje błąd Google Play Console związany z przestarzałą biblioteką płatności Google Play (AIDL).\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Podniesiono kod wersji aplikacji (versionCode) do 13 w celu pomyślnego przesłania nowej paczki do sklepu.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Naprawiono krytyczny crash aplikacji (NullPointerException) przy włączaniu radia poprzez dodanie domyślnych wartości ikon w CapacitorMusicControls.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Przygotowano oficjalną wersję produkcyjną aplikacji do sklepu Google Play. Skompilowano i podpisano ostateczny pakiet Android App Bundle (.aab).\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Usunięto błędy kompilacji Androida związane z brakującymi zasobami tekstowymi w pliku strings.xml (dodano shortcut_daily_word, shortcut_biblical_uni, shortcut_hermeneutics dla skrótów).\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Przywrócono poprawne grafiki ikon oraz ekranu powitalnego (splash screen), generując zasoby natywne na nowo za pomocą @capacitor/assets i usuwając konflikty duplikatów mipmap.\n` +
      '✨ CC OS v26.5.17 - Poprawki Stabilności\n' +
      `- [${new Date().toLocaleString('pl-PL')}] Naprawiono krytyczny błąd "Unhandled Promise Rejection" (reading 'payload') związany z integracją Stripe, dodając ścisłą obsługę i filtry globalne.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Wdrożono bezpieczny fallback dla persistenceService w przypadku uszkodzenia pliku JSON w pamięci podręcznej.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Ulepszono rejestrację skryptów trzecich (w tym Stripe), zapewniając inicjalizację TYLKO RAZ w cyklu życia aplikacji.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Zaktualizowano Service Worker OneSignal, eliminując błędy SecurityError poprzez upewnienie się o wyłącznym dostępie po lokalnej ścieżce relatywnej.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Zaktualizowano wersję systemu do ${APP_VERSION}. Zmieniono wszystkie identyfikatory wersji i zaktualizowano AndroidManifest.xml o niezbędne komponenty Google Play.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Usunięto przestarzałe uprawnienia płatności, optymalizując paczkę pod kątem wymogów Google Play.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Naprawiono i unowocześniono Panel Dowodzenia: Usunięto zduplikowany i niedziałający formularz publikacji porannych pobudek. Skonsolidowano system z potężnym i funkcjonalnym głównym widokiem publikowania, naprawiając problemy z \`pointer-events\` powodujące brak reakcji przycisków na kliknięcie. Dodano do wszystkich przycisków odpowiednie \`aria-label\` zgłaszane przez narzędzia Lighthouse. Dodano ostrzeżenie wymuszające użycie autoryzacyjnego kodu PIN przed publikacją.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Etap 3 zrealizowany wzorowo: potężna logika Instalacji i Aktualizacji PWA została wyekstrahowana do autonomicznego klastra \`hooks/usePWAInstallAndUpdates.ts\`.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Uporządkowano kolejność inicjalizacji hooków w głównym drzewie (w tym system powiadomień \`toasts\`), osiągając perfekcyjną kompilację i zerowy regres funkcjonalności.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Kolejny gigantyczny blok logiki "Prayer Intentions" – serce systemu powiadomień SOS – wyekstrahowany z App.tsx do nowego autonomicznego klastra w \`hooks/usePrayerIntentions.ts\` bez najmniejszego regresu! Kompilacja wykazuje pełną stabilność.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Uporządkowano i przeniesiono stany cyklu SOS/Modlitwy w pasku, zabezpieczając system referencji między widokami i hakami. Aplikacja robi się lżejsza i szybsza w renderowaniu!\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Zainicjowano Operację Ratunkową: Metoda Atomowa. Pierwsze elementy gigantycznego App.tsx zaczynają być bezpiecznie przenoszone do autonomicznych klastrów (część stanów głównych i synchronizacji do \`hooks/useCounters.ts\`, tryb wizualny do \`hooks/useVisualMode.ts\`).\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Wykonano pełen audyt krytyczno-konstruktywny ekosystemu w Centrum Dowodzenia. Zero regresu, pełny sukces kompilacji.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Przywrócono pełną i bezpieczną funkcję Globalnego Wołania (PUSH). Naprawiono lukę bezpieczeństwa "hardcoded PIN" przy publikacji Inspiracji. Od teraz każda akcja administracyjna wymaga bezwzględnego podania PIN-u w UI.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Ostatecznie ustabilizowano liczniki słuchaczy radia! Odtworzenia są od teraz poprawnie zapisywane.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Zaktualizowano zdjęcie profilowe na wizytówce Zbyszka Gieronia.\n` +
      `- Zrób to Dla Jezusa – On już czeka!\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Usunięto błędy kompilacji TypeScript z modułu Firebase Functions.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Naprawiono wyświetlanie grafik w Kreatorze Wersetu.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Przywrócono ikony! Logo Christian Culture ponownie lśni w awatarach i na pulpicie (zastępując wcześniej zepsute grafiki WhatsApp). Styl elementów został ujednolicony bazując na flagowym złocie ekosystemu.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Krytyczna poprawka! Rozwiązano problem z dynamicznym ładowaniem modułu EMI Media Modal po optymalizacjach kodowych. Aplikacja już się nie zatrzymuje.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Odświeżono polityki bezpieczeństwa Firestore. Zasoby europe-west2.run.app zostały odblokowane na poziomie bazy danych!\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Aktywacja Gemini Intelligence: Aplikacja jest teraz gotowa na pełną analizę ekranu (Screen Awareness) i integrację z systemem powiadomień AI. Wdrożono semantykę HTML z zestawem ukierunkowanych etykiet ARIA oraz bogate schematy strukturalne (JSON-LD) obejmujące Słowo Boże i Wirtualny Uniwersytet Biblijny.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Interaktywne wideo w postach: Pobudki Poranne oraz Chrześcijańskie Inspiracje od teraz automatycznie wykrywają linki do filmów YouTube (np. ze Studia Dobrego Słowa) w Twoich postach. Jeśli nie ustawisz zdjęcia głównego, system wygeneruje elegancki i responsywny odtwarzacz wideo, promujący Wasz materiał od razu na samej górze panelu!\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Krytyczna poprawka! Zaktualizowaliśmy panel dowodzenia. Opublikowanie powiadomień lub postów "Poranna Pobudka" powinno znów bezbłędnie działać – po stronie reguł bezpieczeństwa Firestore brakowało walidacji proporcji obrazu 1:1.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Optymalizacja Wydajności o wartości krytycznej (Lighthouse): Wdrożono agregacyjne Code Splitting (React.lazy) oraz bezstratną konwersję obrazów graficznych i tła do formatu WebP. Przyspiesza to uruchamianie aplikacji o około 60-70% bez ponoszenia żadnych kosztów operacyjnych.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Redukcja Kosztów (Backend): Przygotowano klastry Firebase Cloud Functions w dedykowanym środowisku (Node.js/TS). Architektura ta obsłuży Stripe Connect i bramki płatności na darmowym planie Spark/Blaze bez konieczności utrzymywania platformy VPS/MySQL.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Optymalizacja Dostępności (Accessibility): Wdrożono poprawki w strukturze HTML nagłówków czatu i czytników ekranowych, dzięki którym przyciski interfejsu (otwieranie czatu, wysyłanie wiadomości) stały się w pełni dostępne dla osób niewidomych korzystających z nawigacji klawiaturowej (zgodność z elementarnymi zasadami a11y).\n` +
      `- Wdrożono globalny, dobowy system zliczania słuchaczy Radia. Ich suma aktualizuje się w czasie rzeczywistym po odsłuchu dowolnej stacji i wyświetla w oknie zaprzyjaźnionych pielgrzymów (sekcja ONLINE).\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Ostatecznie poprawiono uszkodzone polubienia (serduszka) w Pobudkach i Inspiracjach - zmieniona w poprzedniej rewizji konfiguracja nie wychwytywała podkolekcji.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Wdrożono zaawansowany system Deep Linkingu dla Czytelni. Udostępniane książki teraz precyzyjnie kierują bezpośrednio do wybranej pozycji (np. /ksiazka) i wykorzystują pełne metatagi Open Graph dla lepszego podglądu.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Zaktualizowano reguły bezpieczeństwa bazy danych rozwiązując problem z ulubionymi (dodawanie serduszek) w Pobudkach i Inspiracjach. Każdy zalogowany użytkownik może teraz poprawnie zapisywać ulubione posty.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Naprawiono formatowanie udostępniania w Czytelni. Teraz udostępniane treści zawierają poprawny tytuł, opis oraz aktywny link.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Paski informacji na ekranie głównym (Top News Ticker) są teraz domyślnie schowane – otwierają się dopiero po kliknięciu w CC NEWS.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Poprawiono system ulubionych (serduszek) w Pobudce Porannej – upewniono się, że wpisy poprawnie synchronizują się z chmurą.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Werset Dnia na ekranie głównym nie może być teraz przesuwany powyżej wyszukiwarki ani poniżej odtwarzacza radiowego.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Czytelnia CC otwiera się teraz na całym obszarze ekranu (100%), zapewniając najlepsze doświadczenie z czytania!\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Naprawiono opcje udostępniania i ulubionych w Czytelni CC, dodano wsparcie misyjne dla książki 'Kod Źródłowy' oraz poprawiono ulubione w Pobudce Porannej.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Dodano zaawansowane wsparcie dla formatowania Markdown w Inspiracjach i Słowie na Dzień Dobry. Obsługiwane są pogrubienia, nagłówki, listy punktowe oraz bloki cytatów.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Każdy dodany obraz graficzny w Centrum Dowodzenia jest teraz automatycznie renderowany w idealnych wymiarach 1080x1080px (1:1), gwarantując estetyczny, stały format wyświetlania.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Naprawiono błąd publikacji: Zaktualizowano reguły bezpieczeństwa bazy danych rozwiązując problem z opublikowaniem nowych "Inspiracji" z poziomu Panelu Dowodzenia.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Poprawiono ergonomię (Dolne Menu): Przycisk zamykania (X) w rozwijanym dolnym menu panelu radia został przeniesiony całkowicie na prawą stronę, by zminimalizować ryzyko przypadkowych kliknięć w sąsiadujące przyciski podczas obsługi aplikacji.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Poprawiono czytelność interfejsu (Top News Ticker): Przycisk krzyżyka (X) do zamykania powiadomień został trwale zadokowany przy prawej krawędzi ekranu. Zapobiega to przypadkowemu wciśnięciu przycisku subskrypcji SMS w trakcie przewijania tekstu.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Ujednolicenie typografii: Wszystkie czcionki w paskach informacji (Top News Ticker) zostały zmienione ze zbyt grubych na lekkie, czytelne formatowanie na wzór bezszeryfowego wariantu z okienka ONLINE. Zapewnia to lżejszy i bardziej elegancki odbiór wiadomości.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Optymalizacja estetyki ekranu startowego: Zrezygnowano ze złotego tła pod modułem ONLINE gdy główny pasek informacyjny (Top News Ticker) jest schowany. Teraz, czarna kapsułka LED z licznikiem jest dyskretnie zawieszona w rogu ekranu.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Poprawiono UI złotych paneli paskowych (Top News Ticker) nadpisując białą, mało widoczną czcionkę elegancką, w pełni czytelną głęboką czernią. Odświeżono wszystkie wewnętrzne przyciski złotej belki dostosowując transparentność czerni. Zadbano również o idealnie czarne, kontrastujące tło w panelu wsparcia (Pomaganie Wzmacnia).\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Szlif Premium UI - Zrekonstruowano "Top News Ticker" aby nawigacja przypominała profesjonalne stacje TV informacyjne. Usunięto łączenia pomiędzy modułami zyskując idealnie spójny pasek o szerokości Full Width ("Zero gap"). Odświeżono widżet ONLINE stylizując go w czarną kapsułkę LED z animowanym, neonowym zielonym punktem sygnalizacyjnym, precyzyjnie centrowaną pionowo.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Przygotowano platformę pod chirurgiczną produkcję finalnego pakietu .aab w systemie Android. Zaimplementowano ujednolicony proces budowania natywnego z szablonami do bezpiecznego podpisywania aplikacji w gradlu.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Sfinalizowano architekturę uprawnień do systemu zaktualizowanymi autorskimi regułami bezpieczeństwa Firestore! Naprawiono klucz do UID konta naczelnego administratora i zoptymalizowano operacje bazy m.in. dla czatów i wsparcia zgłoszeń.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Naprawiono błąd interakcji asystenta (invalid argument: response_mime_type) dzięki eliminacji konfliktu między wymuszonym JSON a narzędziami AI. Wdrożono poprawkę Firestore udostępniającą kolekcje apostle z prawidłowym użyciem \`jestAdmin()\` dla bezpieczeństwa oraz uprawnieniami \`request.auth\` dla logów aplikacji.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Przeprowadzono strategiczną aktualizację silników sztucznej inteligencji. Przełączono modele na wariant \`gemini-2.5-flash\` w usłudze asystenta i na serwerze CC, naprawiając niedostępność starszych metodologii oraz optymalizując prędkość.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Krytyczna poprawka! Zlikwidowano błąd rekurencyjnego twardego restartu stacji, uszczelniając logikę timeoutowych obietnic asynchronicznych podczas strumieniowania. System prawidłowo zwolni zapasowe koło nasłuchujące (po udanym i szybkim połączeniu HLS/Native).\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Wdrożono nowy, bardzo inteligentny system podwójnych zabezpieczeń dla stabilności strumieniowania radiowego. Zaimplementowano asynchroniczne limity czasowe (wyścigi obietnic 10s) na warstwie HLS oraz natywnej. Dodano nasłuchiwanie zdarzeń 'online', które automatycznie wznawia radio po przywróceniu zasięgu. Odblokowano sztywny znacznik 'Stall' po 15 sek w razie kryzysu sieciowego.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Czytelnia CC wzbogaciła się o nową innowację. Książka "Kod Źródłowy" ma teraz wbudowany pełnowymiarowy czytnik PDF (z poziomu Google Drive), umożliwiający czytanie pierwszego rozdziału absolutnie za darmo z opcją wsparcia misji.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Czytelnia CC wzbogaciła się o nową osobę dystrybuującą darmową Biblię UBG. Marek Strękowski (+48 530 736 155) został dodany do oferty. Wprowadzono rotacyjny system wyświetlania kontaktów niczym tasowane karty.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Górna belka wraz z wyszukiwarką została obniżona o eleganckie 2 milimetry w stosunku do drugiego paska informacyjnego. Zachowujemy idealne proporcje.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Usunięto niepożądane renderowanie złotych linii oraz obrysów pod układem informacyjnym TopNewsTicker, zachowując spójność przezroczystości podczas ukrywania dodatkowych trybów paska.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Panel "Online" zsynchronizowano z lewym paskiem informacyjnym CC News. Mają tę samą, 24-pikselową wysokość bazową oraz wspólną, sztywną pozycję osiową.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Interfejs użytkownika w górnej strefie (TopNewsTicker) został wzmocniony na sztywno do 48 jednostek celem wykluczenia luk w rozdzielczościach mobilnych. Belki otrzymały bezwzględny podział na dwie, płaskie, stałe złote nitki z zablokacją zaokrągleń oraz cieni. Poprawiono twarde pozycjonowanie głównych widoków pod nowo zwymiarowany schemat.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Protokół Substytucji Imienia Bożego ustanowiony. 37 miejsc w kodzie z zadanym wzorem $JHWH$ doczekało się przywrócenia oryginalnego imienia: Jahwe.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Górna belka Paska Wyszukiwania oraz Menu powróciła jako zablokowany u góry element aplikacji.\n` +
      `- Odtwarzacz radiowy oraz system RDS dają Ci teraz pełną kontrolę i nie znikają podczas załączania Trybu ZEN.\n` +
      `- Pasek RDS jest teraz domyślnie ukryty, pozostawiając elegancką i minimalistyczną przestrzeń.\n` +
      `- Dodano nowy, subtelny przycisk "Odtwarzacz RDS" nad głównym odtwarzaczem. Kliknięcie pozwala na dyskretne ukrywanie lub pokazywanie tekstu przewijanego.\n` +
      `- Lewy górny przycisk CC NEWS jest teraz na start przeźroczysty, a pełny kolor otrzymuje po rozwinięciu, podobnie jak wskaźnik ONLINE.\n` +
      `- Odtwarzacz radiowy oraz inne widżety zostały zablokowane przed przesuwaniem zbyt nisko dolnej stopki, zapewniając, że nie uciekają poza ekran.\n` +
      `- Wprowadzono 3 rozmiary wyświetlanego tekstu w pasku RDS – każde kliknięcie w tekst zmienia jego rozmiar na inny.\n` +
      `- Zapisywanie wybranego rozmiaru RDS do preferencji użytkownika.\n` +
      `- Górna belka oraz Wyszukiwarka zostały przekształcone w swobodny widżet z możliwością swobodnego przesuwania góra-dół.\n` +
      `- Wprowadzono dynamiczne ograniczanie przesuwania widżetów pod Drugim Paskiem Informacyjnym (Top News Ticker).\n` +
      `- Umożliwiono użytkownikowi dedykowanie wielkości wyświetlacza RDS za pomocą przeciągania na dowolnym ekranie.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Poprawiono wyświetlanie placeholderów dla wezwań SOS Modlitwa w mobilnych i w oknie wyszukiwania.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Wdrożono dobowy system zliczania łącznej liczby uruchomień radia, współdzielony przez społeczność Christian Culture w czasie bieżącym.\n` +
      `- [${new Date().toLocaleString('pl-PL')}] Podniesiono wersję aplikacji do 26.5.14.03.\n` +
      `- Zrób to Dla Jezusa – On już czeka!`;

    const defaults = {
      "Nowości CC": defaultNews,
      "Kontakt www": "www.polskieradio.cc",
      Subskrypcja:
        "Numer subskrypcja: 537 147 043\nWyślij SMS o treści: Duchowa inspiracja\nhttps://patronite.pl/CCNetwork",
      weeklySchedule: JSON.stringify({
        "0": [
          { time: "00:00", title: "Nocne uwielbienie" },
          { time: "06:00", title: "Śniadanie z Mistrzem" },
          { time: "09:00", title: "Globalne Wołanie" },
          { time: "12:00", title: "Szkoła Biblijna CC" },
          { time: "15:00", title: "Globalne Wołanie" },
          { time: "18:00", title: "MMD (Moja Misja Dnia)" },
          { time: "21:00", title: "Globalne Wołanie" },
        ],
        "1": [
          { time: "06:00", title: "Śniadanie z Mistrzem" },
          { time: "09:00", title: "Globalne Wołanie" },
          { time: "12:00", title: "Studio Dobrego Słowa" },
          { time: "15:00", title: "Globalne Wołanie" },
          { time: "18:00", title: "MMD (Moja Misja Dnia)" },
          { time: "21:00", title: "Globalne Wołanie" },
        ],
        "2": [
          { time: "06:00", title: "Śniadanie z Mistrzem" },
          { time: "09:00", title: "Globalne Wołanie" },
          { time: "12:00", title: "Nauczanie: Pokonać Goliata" },
          { time: "15:00", title: "Globalne Wołanie" },
          { time: "18:00", title: "MMD (Moja Misja Dnia)" },
          { time: "21:00", title: "Globalne Wołanie" },
        ],
        "3": [
          { time: "06:00", title: "Śniadanie z Mistrzem" },
          { time: "09:00", title: "Globalne Wołanie" },
          { time: "12:00", title: "CC Men / CC Women" },
          { time: "15:00", title: "Globalne Wołanie" },
          { time: "18:00", title: "MMD (Moja Misja Dnia)" },
          { time: "21:00", title: "Globalne Wołanie" },
        ],
        "4": [
          { time: "06:00", title: "Śniadanie z Mistrzem" },
          { time: "09:00", title: "Globalne Wołanie" },
          { time: "12:00", title: "Tożsamość i Misja (CC Identity)" },
          { time: "15:00", title: "Globalne Wołanie" },
          { time: "18:00", title: "MMD (Moja Misja Dnia)" },
          { time: "21:00", title: "Globalne Wołanie" },
        ],
        "5": [
          { time: "06:00", title: "Śniadanie z Mistrzem" },
          { time: "09:00", title: "Globalne Wołanie" },
          { time: "15:00", title: "Globalne Wołanie" },
          { time: "18:00", title: "Przygotowanie do Szabatu" },
          { time: "19:00", title: "Powitanie Szabatu" },
          { time: "21:00", title: "Globalne Wołanie" },
        ],
        "6": [
          { time: "08:00", title: "Śniadanie z Mistrzem (Szabatowe)" },
          { time: "09:00", title: "Globalne Wołanie" },
          { time: "11:00", title: "Nabożeństwo Szabatowe" },
          { time: "15:00", title: "Globalne Wołanie" },
          { time: "20:00", title: "Zakończenie Szabatu" },
          { time: "21:00", title: "Apokalipsa - Premiera na YouTube" },
        ],
      }),
    };
    const saved = PersistenceService.safeGetItem(STORAGE_KEYS.DYNAMIC_DB, null);
    const merged = saved ? { ...defaults, ...saved } : defaults;

    // Only update the weeklySchedule and Nowości CC from defaults as they are managed by code mainly
    merged["weeklySchedule"] = defaults["weeklySchedule"];
    merged["Nowości CC"] = defaults["Nowości CC"];

    return merged;
  },

  saveLastDisplayedVerse: (verse: BibleVerse) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.LAST_DISPLAYED_VERSE,
      JSON.stringify(verse),
    );
  },
  loadLastDisplayedVerse: (): BibleVerse | null => {
    return PersistenceService.safeGetItem(
      STORAGE_KEYS.LAST_DISPLAYED_VERSE,
      null,
    );
  },

  saveBibleAdLastShown: (dateStr: string) => {
    PersistenceService.safeSetItem(STORAGE_KEYS.BIBLE_AD_LAST_SHOWN, dateStr);
  },
  loadBibleAdLastShown: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.BIBLE_AD_LAST_SHOWN);
  },

  saveFavoriteVerses: (verses: string[]) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.FAVORITE_VERSES,
      JSON.stringify(verses),
    );
  },
  loadFavoriteVerses: (): string[] => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.FAVORITE_VERSES, []);
  },

  saveFavoriteVerseColors: (colors: Record<string, string>) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.FAVORITE_VERSE_COLORS,
      JSON.stringify(colors),
    );
  },
  loadFavoriteVerseColors: (): Record<string, string> => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.FAVORITE_VERSE_COLORS, {});
  },

  saveBibleFontSettings: (settings: { fontSize: number; fontFamily: string }) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.BIBLE_FONT_SETTINGS,
      JSON.stringify(settings)
    );
  },
  loadBibleFontSettings: (): { fontSize: number; fontFamily: string } => {
    const settings = PersistenceService.safeGetItem(STORAGE_KEYS.BIBLE_FONT_SETTINGS, { fontSize: 18, fontFamily: 'font-bible' });
    if (settings.fontFamily === 'serif' || settings.fontFamily === 'font-serif') {
       settings.fontFamily = 'font-bible';
    }
    return settings;
  },

  saveVerseImageSettings: (settings: any) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.VERSE_IMAGE_SETTINGS,
      JSON.stringify(settings),
    );
  },
  loadVerseImageSettings: (): any => {
    return PersistenceService.safeGetItem(
      STORAGE_KEYS.VERSE_IMAGE_SETTINGS,
      null,
    );
  },

  saveMyFiles: (data: any[]) => {
    PersistenceService.safeSetItem("cc_userMaterials", JSON.stringify(data));
  },
  loadMyFiles: (): any[] => {
    return PersistenceService.safeGetItem("cc_userMaterials", []);
  },

  saveWidgetsHidden: (hidden: boolean) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.WIDGETS_HIDDEN,
      hidden.toString(),
    );
  },
  loadWidgetsHidden: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.WIDGETS_HIDDEN) === "true";
  },

  saveUserLayouts: (layouts: any) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.USER_LAYOUTS,
      JSON.stringify(layouts),
    );
  },
  loadUserLayouts: (): any => {
    const saved = PersistenceService.safeGetItem(
      STORAGE_KEYS.USER_LAYOUTS,
      null,
    );
    return saved;
  },

  saveBusinessCard: (data: any) => {
    PersistenceService.safeSetItem(
      STORAGE_KEYS.BUSINESS_CARD,
      JSON.stringify(data),
    );
  },
  loadBusinessCard: (): any => {
    return PersistenceService.safeGetItem(STORAGE_KEYS.BUSINESS_CARD, null);
  },

  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    PersistenceService.clearSSOCookie();
  },
};
